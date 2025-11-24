import { test, expect } from '@playwright/test';

test('homepage has title and main elements', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Refrielectricos/i);

  // Check for main navigation
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();

  // Check for products grid or hero section
  // Adjust this selector based on your actual UI
  const main = page.locator('main');
  await expect(main).toBeVisible();
});
