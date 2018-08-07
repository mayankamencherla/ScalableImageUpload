const puppeteer = require('puppeteer');

test('We can launch a browser', async () => {

  // launch takes in options
  const options = {headless: false};
  const browser = await puppeteer.launch(options);

  // Create page - or a tab on chromium
  const page = await browser.newPage();

  await page.goto('localhost:3000');

  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');

  await browser.close();
});

test('We can launch a browser', async () => {

  // launch takes in options
  const options = {headless: false};
  const browser = await puppeteer.launch(options);

  // Create page - or a tab on chromium
  const page = await browser.newPage();

  await page.goto('localhost:3000');

  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');

  await browser.close();
});

test('clicking starts oAuth', async() => {
  // launch takes in options
  const options = {headless: false};
  const browser = await puppeteer.launch(options);

  // Create page - or a tab on chromium
  const page = await browser.newPage();

  await page.goto('localhost:3000');

  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);

  await browser.close();
});

test('When signed in, shows logout button', async() => {
  const id = '5b65ba970e83500a86a45c54';

  const Buffer = require('safe-buffer').Buffer;

  const sessionObj = {
    passport: {
      user: id
    }
  };

  const sessionString = Buffer.from(JSON.stringify(sessionObj))
                              .toString('base64');

  const KeyGrip = require('keyGrip');

  const keys = require('../config/keys.js');

  const kg = new KeyGrip([keys.cookieKey]);

  const sig = kg.sign('session=' + sessionString);

  console.log(sessionString, sig);

  // launch takes in options
  const options = {headless: false};
  const browser = await puppeteer.launch(options);

  // Create page - or a tab on chromium
  const page = await browser.newPage();

  await page.goto('localhost:3000');

  await page.setCookie({
    name: 'session',
    value: sessionString
  });

  await page.setCookie({
    name: 'session.sig',
    value: sig
  });

  await page.goto('localhost:3000');
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
});
