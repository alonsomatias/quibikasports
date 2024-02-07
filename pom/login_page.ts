import { expect, type Page } from '@playwright/test';

const emailInputbox = '[formcontrolname="email"]';
const passwordInputbox = '[formcontrolname="password"]';
const authButton = '[type="submit"]';

export async function login(page : Page, userEmail : string, password : string) {  
    // Go to Login
    await page.goto("/#/auth/login");
  
    // Validate Login is displayed
    await expect(page.url()).toContain("login");
    await expect(page.locator('//h3')).toHaveText('Qubika Club');
    
    await expect(page.locator(emailInputbox)).toBeVisible();
    await expect(page.locator(passwordInputbox)).toBeVisible();
    await expect(page.locator(authButton)).toBeVisible();
    
    // Type user data 
    await page.locator(emailInputbox).fill(userEmail);
    await page.locator(passwordInputbox).fill(password);
    await page.locator(authButton).click();
  
    // Validate login
    await page.waitForURL('**/dashboard');
    await expect(page.url()).toContain('dashboard');
  }