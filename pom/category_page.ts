import { expect, type Page } from '@playwright/test';
const base = require('./common_page');
require('./common_page');

const categoryNameInputbox = '[id="input-username"]';
const subCategoryCheckbox = '[for="customCheckMain"]';
const parentCategoryInputbox = '//*[@formcontrolname="categoryId"]//input';
const acceptButton = '[type="submit"]';

export async function addCategory(page : Page, categoryName : string, parentCategory : string = '') {
    await base.clickAddNew(page);

    await page.locator(categoryNameInputbox).fill(categoryName);
    if(parentCategory != '') {
      await page.locator(subCategoryCheckbox).click();
      await page.locator(parentCategoryInputbox).fill(parentCategory);
      await page.locator(parentCategoryInputbox).press('Enter');
    }
  
    const response = page.waitForResponse('**/api/category-type/create');
  
    await page.locator(acceptButton).click();
  
    await expect((await response).status()).toBe(200);
  
    const spinner = page.locator('[class="loader"]');
    await expect(spinner).toBeHidden({timeout : 10000})
  }

export async function validateCategoryInList(page : Page, categoryName : string) {
  await base.validateNameInList(page, categoryName);
}

export async function goToLastPage(page : Page) {
  await base.goToLastPage(page);
}