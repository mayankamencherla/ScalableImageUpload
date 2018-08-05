const mongoose = require('mongoose');

const redis = require('redis');
const util = require('util');

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  // this = query instance
  this.useCache = true;
  // Chainable

  this.hashKey = JSON.stringify(options.key || '');

  return this;
}

mongoose.Query.prototype.exec = async function(){
  console.log('About to run a query');

  if (!this.useCache) return exec.apply(this, arguments);

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  const cacheValue = await client.hget(this.hashKey, key);

  // See if we have a value in redis
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    console.log('cache value ' + doc);

    return Array.isArray(doc) ?
      doc.map(d => new this.model(d)) :
      new this.model(JSON.parse(cacheValue));
  }

  // else return mongo value

  console.log(key);

  const result = await exec.apply(this, arguments);
  console.log(result);

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 120);

  return result;
}

module.exports = {
  clearHash(hashKey) {
    console.log('Clearing user hash');
    client.del(JSON.stringify(hashKey));
  }
}
