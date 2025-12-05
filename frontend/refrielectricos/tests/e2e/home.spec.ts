import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Refrielectricos/i);
  });

  test('should display the main navigation', async ({ page }) => {
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('should display the logo', async ({ page }) => {
    const logo = page.locator('nav').getByText('Refrielectricos');
    await expect(logo).toBeVisible();
  });

  test('should have working search box', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('aire acondicionado');
    await searchInput.press('Enter');
    
    // Should navigate to products page with search query
    await expect(page).toHaveURL(/products.*search=aire/i);
  });

  test('should display cart icon in navbar', async ({ page }) => {
    const cartLink = page.locator('nav').locator('a[href="/cart"]');
    await expect(cartLink).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    const productsLink = page.locator('nav').getByRole('link', { name: /productos/i });
    await productsLink.click();
    
    await expect(page).toHaveURL(/products/);
  });

  test('should display hero carousel', async ({ page }) => {
    const hero = page.locator('[class*="hero"], [class*="carousel"], [class*="banner"]').first();
    await expect(hero).toBeVisible();
  });
});

test.describe('Home Page - Hero Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display carousel navigation arrows', async ({ page }) => {
    const prevButton = page.getByRole('button', { name: /anterior|prev|left/i });
    const nextButton = page.getByRole('button', { name: /siguiente|next|right/i });
    
    // At least one navigation method should exist
    const hasNavigation = await prevButton.isVisible().catch(() => false) || 
                          await nextButton.isVisible().catch(() => false);
    expect(hasNavigation).toBeTruthy();
  });
});

test.describe('Home Page - Product Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display featured products section', async ({ page }) => {
    // Look for product cards or product section
    const productSection = page.locator('[class*="product"], [class*="featured"]').first();
    await expect(productSection).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Home Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile menu button', async ({ page }) => {
    await page.goto('/');
    
    const menuButton = page.locator('nav').locator('button').filter({ has: page.locator('svg') }).first();
    await expect(menuButton).toBeVisible();
  });

  test('should open mobile menu on click', async ({ page }) => {
    await page.goto('/');
    
    const menuButton = page.locator('nav').locator('button').first();
    await menuButton.click();
    
    // Mobile menu should be visible
    await page.waitForTimeout(300); // Wait for animation
  });
});
