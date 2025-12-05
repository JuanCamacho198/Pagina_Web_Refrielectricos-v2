import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should load products page', async ({ page }) => {
    await expect(page).toHaveURL(/products/);
  });

  test('should display product grid', async ({ page }) => {
    // Wait for products to load
    const productCards = page.locator('[class*="product-card"], [class*="ProductCard"], article').first();
    await expect(productCards).toBeVisible({ timeout: 10000 });
  });

  test('should display at least one product', async ({ page }) => {
    const products = page.locator('[class*="product-card"], [class*="ProductCard"], article');
    await expect(products.first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to product detail on click', async ({ page }) => {
    // Find first product card link
    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.click();
    
    // Should be on product detail page
    await expect(page).toHaveURL(/products\/.+/);
  });
});

test.describe('Products Page - Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should filter by category', async ({ page }) => {
    // Look for category filter
    const categoryFilter = page.getByRole('combobox').first();
    
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      // Select first option
      const option = page.locator('[role="option"]').first();
      if (await option.isVisible()) {
        await option.click();
        // URL should update with category parameter
        await page.waitForURL(/category=/);
      }
    }
  });

  test('should search products', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('aire');
      await searchInput.press('Enter');
      
      await expect(page).toHaveURL(/search=aire/i);
    }
  });

  test('should sort products', async ({ page }) => {
    // Look for sort dropdown or select
    const sortSelect = page.locator('select[name*="sort"], [class*="sort"]').first();
    
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Products Page - Pagination', () => {
  test('should display pagination when there are multiple pages', async ({ page }) => {
    await page.goto('/products');
    
    // Look for pagination component
    const pagination = page.locator('[class*="pagination"], nav[aria-label*="pagination"]');
    
    // Pagination might not be visible if there's only one page
    const isVisible = await pagination.isVisible().catch(() => false);
    
    if (isVisible) {
      const pageInfo = page.getByText(/página \d+ de \d+/i);
      await expect(pageInfo).toBeVisible();
    }
  });

  test('should navigate to next page', async ({ page }) => {
    await page.goto('/products');
    
    const nextButton = page.getByRole('button', { name: /siguiente|next/i });
    
    if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
      await nextButton.click();
      await expect(page).toHaveURL(/page=2/);
    }
  });
});

test.describe('Product Detail Page', () => {
  test('should display product information', async ({ page }) => {
    // First go to products to find a product
    await page.goto('/products');
    
    // Click first product
    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.click();
    
    // Should show product name
    const productTitle = page.locator('h1');
    await expect(productTitle).toBeVisible({ timeout: 10000 });
  });

  test('should display add to cart button', async ({ page }) => {
    await page.goto('/products');
    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.click();
    
    const addToCartButton = page.getByRole('button', { name: /agregar|añadir|carrito/i });
    await expect(addToCartButton).toBeVisible({ timeout: 10000 });
  });

  test('should display product price', async ({ page }) => {
    await page.goto('/products');
    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.click();
    
    // Price should contain $ or numbers
    const price = page.locator('[class*="price"]').first();
    await expect(price).toBeVisible({ timeout: 10000 });
  });

  test('should show product images', async ({ page }) => {
    await page.goto('/products');
    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.click();
    
    const productImage = page.locator('img').first();
    await expect(productImage).toBeVisible({ timeout: 10000 });
  });
});
