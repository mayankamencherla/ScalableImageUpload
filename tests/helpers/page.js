const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory.js');
const userFactory = require('../factories/userFactory.js');

class Page {
  static async build() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const customPage = new Page(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    // Wait for the user to be saved
    const user = await userFactory();

    const {session, sig} = sessionFactory(user);

    await this.page.goto('localhost:3000');

    await this.page.setCookie({
      name: 'session',
      value: session
    });

    await this.page.setCookie({
      name: 'session.sig',
      value: sig
    });

    await this.page.goto('localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }
}

module.exports = {Page};
