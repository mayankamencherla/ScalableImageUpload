const {Page} = require('./helpers/page');

test('When logged in, can create blog create form', async() => {
  page = await Page.build();
  await page.goto('localhost:3000');

  await page.login();

  await page.click('a.btn-floating');

  const label = await page.getContentsOf('form label');

  expect(label).toEqual('Blog Title');

  await page.close();
});
