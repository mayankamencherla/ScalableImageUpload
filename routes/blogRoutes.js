const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

const util = require('util');

const redis = require('redis');
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

client.get = util.promisify(client.get);

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {

    // Do we have any cached data wrt to user.id
    const cachedBlogs = await client.get(req.user.id);

    // If yes respond right away
    if (cachedBlogs) {
      console.log('Serving from cache');
      return res.send(JSON.parse(cachedBlogs));
    }

    // If no pull from DB

    console.log('Serving from MongoDB');

    const blogs = await Blog.find({ _user: req.user.id });

    // Addng to application latency
    client.set(req.user.id, JSON.stringify(blogs), 'EX', 300);

    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
