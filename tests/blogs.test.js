const {Page} = require('./helpers/page');

describe('When logged in', async () => {

  test('Can create blog create form', async() => {
    const page = await Page.build();
    await page.goto('localhost:3000');

    await page.login();

    await page.click('a.btn-floating');

    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');

    await page.close();
  });

  describe('When logged in, and using invalid inputs', async() => {

    test('The form shows an error message', async() => {
      const page = await Page.build();
      await page.goto('localhost:3000');

      await page.login();

      await page.click('form button');

      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');

      await page.close();
    });
  });

  describe('When logged in, and using valid inputs', async() => {

    test('Submitting takes user to review screen', async() => {
      const page = await Page.build();
      await page.goto('localhost:3000');

      await page.login();

      await page.type('.title input', 'My title');
      await page.type('.content input', 'My content');

      await page.click('form button');

      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');

      await page.close();
    });

    test('Submitting then saving adds blog to index page', async() => {
      const page = await Page.build();
      await page.goto('localhost:3000');

      await page.login();

      await page.type('.title input', 'My title');
      await page.type('.content input', 'My content');

      await page.click('form button');

      await page.click('button.green');

      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');

      const content = await page.getContentsOf('p');

      expect(title).toEqual('My title');
      expect(content).toEqual('My content');

      await page.close();
    });
  });
});
