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
