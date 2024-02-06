import { test, expect, type Page } from '@playwright/test';

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

  await login(page, userEmail, password);

  const categoryLink = page.locator('[href="#/category-type"]');
  await categoryLink.click();

})

test('Create Categories', async ({ page }) => {
  const categoryName = 'Main A ' + timeStamp;
  const subCategoryName = 'Sub A ' + timeStamp;

  await addCategory(page, categoryName);
  await addCategory(page, subCategoryName, 'Sport A');

  await goToLastPage(page);

  await validateCategoryInList(page, categoryName);
  await validateCategoryInList(page, subCategoryName);
});

async function login(page : Page, userEmail : string, password : string) {  
  // Go to Login
  await page.goto("/#/auth/login");

  // Validate Login is displayed
  await expect(page.url()).toContain("login");
  await expect(page.locator('//h3')).toHaveText('Qubika Club');

  const emailInputbox = page.locator('[formcontrolname="email"]');
  const passwordInputbox = page.locator('[formcontrolname="password"]');
  const authButton = page.locator('[type="submit"]');

  await expect(emailInputbox).toBeVisible();
  await expect(passwordInputbox).toBeVisible();
  await expect(authButton).toBeVisible();
  
  // Type user data 
  await emailInputbox.fill(userEmail);
  await passwordInputbox.fill(password);
  await authButton.click();

  // Validate login
  await page.waitForURL('**/dashboard');
  await expect(page.url()).toContain('dashboard');
}

async function addCategory(page : Page, categoryName : string, parentCategory : string = '') {
  const addButton = page.locator('//i[contains(@class,"fa-plus")]/parent::button');
  await addButton.click();

  const categoryNameInputbox = page.locator('[id="input-username"]');
  const subCategoryCheckbox = page.locator('[for="customCheckMain"]');
  const parentCategoryInputbox = page.locator('//*[@formcontrolname="categoryId"]//input');
  const acceptButton = page.locator('[type="submit"]');

  await categoryNameInputbox.fill(categoryName);
  if(parentCategory != '') {
    await subCategoryCheckbox.click();
    await parentCategoryInputbox.fill(parentCategory);
    await parentCategoryInputbox.press('Enter');
  }

  const response = page.waitForResponse('**/api/category-type/create');

  await acceptButton.click();

  await expect((await response).status()).toBe(200);

  const spinner = page.locator('[class="loader"]');
  await expect(spinner).toBeHidden({timeout : 10000})
}

async function goToLastPage(page : Page) {
  const response = page.waitForResponse('**/api/category-type/filter?**');

  const lastPageButton = page.locator('//div[contains(@class,"footer")]//li[last()]/preceding-sibling::li[1]');
  await lastPageButton.click();

  await expect((await response).status()).toBe(200);
}

async function validateCategoryInList(page : Page, categoryName : string){
  await expect(page.getByText(categoryName)).toBeVisible();
}