import { type Page, expect } from '@playwright/test';

const categoryLink = '[href="#/category-type"]';

export async function navigateToCategoies(page : Page) {
    await expect(page.locator(categoryLink), 'Category link is not displayed on the page').toBeVisible();
    await page.locator(categoryLink).click();
}
