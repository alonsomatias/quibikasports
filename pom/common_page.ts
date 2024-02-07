import { type Page, expect} from '@playwright/test';

const addButton = '//i[contains(@class,"fa-plus")]/parent::button';
const lastPageButton = '//div[contains(@class,"footer")]//li[last()]/preceding-sibling::li[1]';

export async function goToLastPage(page : Page) {
  const response = page.waitForResponse('**/api/**/filter?**');

  await page.locator(lastPageButton).click();

  await expect((await response).status()).toBe(200);
}

export async function validateNameInList(page : Page, name : string){
  await expect(page.getByText(name)).toBeVisible();
}

export async function clickAddNew(page : Page) {
  await page.locator(addButton).click();
}