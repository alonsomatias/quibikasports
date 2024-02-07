import { test, expect, type Page } from '@playwright/test';
const LoginPage = require('../pom/login_page');
const SidenavBar = require('../pom/sidenav_bar');
const CategoryPage = require('../pom/category_page');

const timeStamp = Date.now();
const userEmail = 'user' + timeStamp + '@email.com';
const password = 'thisPass';

test.beforeAll('Create User by API', async({request}) => {
  const response = await request.post('https://api.club-administration.qa.qubika.com/api/auth/register', {
    data: {
      "email": userEmail ,
      "password": password,
      "roles": [
        "ROLE_ADMIN"
      ]
    }
  });

  expect(response.status()).toBe(201);
})

test.beforeEach('Go to Category Page', async ({page}) => {
  await LoginPage.login(page, userEmail, password);
  await SidenavBar.navigateToCategoies(page);
})

test('Create Categories', async ({ page }) => {
  const categoryName = 'Main A ' + timeStamp;
  const subCategoryName = 'Sub A ' + timeStamp;

  await CategoryPage.addCategory(page, categoryName);
  await CategoryPage.addCategory(page, subCategoryName, 'Sport A');

  await CategoryPage.goToLastPage(page);

  await CategoryPage.validateCategoryInList(page, categoryName);
  await CategoryPage.validateCategoryInList(page, subCategoryName);
});