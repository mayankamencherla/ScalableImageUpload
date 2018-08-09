const {Page} = require('./helpers/page');

test('We can launch a browser', async () => {

  const page = await Page.build();

  await page.goto('localhost:3000');

  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');

  await page.close();
});

test('We can launch a browser', async () => {

  const page = await Page.build();

  await page.goto('localhost:3000');

  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');

  await page.close();
});

test('clicking starts oAuth', async() => {

  const page = await Page.build();

  await page.goto('localhost:3000');

  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);

  await page.close();
});

test('When signed in, shows logout button', async() => {
  const id = '5b65ba970e83500a86a45c54';

  const page = await Page.build();

  await page.login();

  const text = await page.getContentsOf('a[href="/auth/logout');

  expect(text).toEqual('Logout');
});
