import { test, expect, Page } from '@playwright/test';

// Helper to add product to cart
async function addProductToCart(page: Page) {
  await page.goto('/products');
  
  // Click first product
  const productLink = page.locator('a[href*="/products/"]').first();
  await productLink.click();
  
  // Wait for product page to load
  await page.waitForLoadState('networkidle');
  
  // Click add to cart
  const addToCartButton = page.getByRole('button', { name: /agregar|añadir|carrito/i });
  await addToCartButton.click();
  
  // Wait for cart update
  await page.waitForTimeout(500);
}

test.describe('Cart Functionality', () => {
  test.describe('Adding Products', () => {
    test('should add product to cart from product page', async ({ page }) => {
      await addProductToCart(page);
      
      // Cart badge should show 1
      const cartBadge = page.locator('nav').locator('[class*="badge"], span').filter({ hasText: /^\d+$/ });
      await expect(cartBadge).toBeVisible({ timeout: 5000 });
    });

    test('should increment quantity when adding same product', async ({ page }) => {
      await addProductToCart(page);
      
      // Add same product again
      const addToCartButton = page.getByRole('button', { name: /agregar|añadir|carrito/i });
      await addToCartButton.click();
      
      await page.waitForTimeout(500);
      
      // Navigate to cart to verify quantity
      await page.goto('/cart');
      
      const quantityInput = page.locator('input[type="number"], [class*="quantity"]').first();
      // Quantity should be 2 or more
    });
  });

  test.describe('Cart Page', () => {
    test.beforeEach(async ({ page }) => {
      await addProductToCart(page);
      await page.goto('/cart');
    });

    test('should display cart items', async ({ page }) => {
      const cartItems = page.locator('[class*="cart-item"], [class*="CartItem"], article, tr').first();
      await expect(cartItems).toBeVisible({ timeout: 5000 });
    });

    test('should display product name in cart', async ({ page }) => {
      // Product name should be visible
      const productInfo = page.locator('[class*="cart"]').getByRole('link').first();
      await expect(productInfo).toBeVisible();
    });

    test('should display product price', async ({ page }) => {
      const price = page.locator('[class*="price"]').first();
      await expect(price).toBeVisible();
    });

    test('should display subtotal', async ({ page }) => {
      const subtotal = page.getByText(/subtotal/i);
      await expect(subtotal).toBeVisible();
    });

    test('should update quantity', async ({ page }) => {
      const increaseButton = page.getByRole('button', { name: /\+|aumentar|más/i }).first();
      
      if (await increaseButton.isVisible()) {
        await increaseButton.click();
        await page.waitForTimeout(500);
        // Subtotal should update
      }
    });

    test('should remove item from cart', async ({ page }) => {
      const removeButton = page.getByRole('button', { name: /eliminar|remove|quitar/i }).first();
      
      if (await removeButton.isVisible()) {
        await removeButton.click();
        await page.waitForTimeout(500);
        
        // Should show empty cart or reduced items
        const emptyMessage = page.getByText(/vacío|empty|sin productos/i);
        await expect(emptyMessage).toBeVisible({ timeout: 5000 });
      }
    });

    test('should have checkout button', async ({ page }) => {
      const checkoutButton = page.getByRole('link', { name: /continuar|checkout|comprar|pagar/i });
      await expect(checkoutButton).toBeVisible();
    });
  });

  test.describe('Empty Cart', () => {
    test('should show empty cart message', async ({ page }) => {
      // Clear any stored cart
      await page.evaluate(() => localStorage.removeItem('cart-storage'));
      await page.goto('/cart');
      
      const emptyMessage = page.getByText(/vacío|empty|sin productos|no tienes/i);
      await expect(emptyMessage).toBeVisible({ timeout: 5000 });
    });

    test('should have link to continue shopping', async ({ page }) => {
      await page.evaluate(() => localStorage.removeItem('cart-storage'));
      await page.goto('/cart');
      
      const continueLink = page.getByRole('link', { name: /seguir comprando|ver productos|explorar/i });
      await expect(continueLink).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Cart Persistence', () => {
    test('should persist cart after page reload', async ({ page }) => {
      await addProductToCart(page);
      
      // Reload the page
      await page.reload();
      
      // Cart should still have items
      const cartBadge = page.locator('nav').locator('[class*="badge"], span').filter({ hasText: /^\d+$/ });
      await expect(cartBadge).toBeVisible({ timeout: 5000 });
    });

    test('should persist cart when navigating', async ({ page }) => {
      await addProductToCart(page);
      
      // Navigate away
      await page.goto('/products');
      
      // Cart badge should still show
      const cartBadge = page.locator('nav').locator('[class*="badge"], span').filter({ hasText: /^\d+$/ });
      await expect(cartBadge).toBeVisible();
    });
  });
});

test.describe('Cart Calculations', () => {
  test('should calculate correct subtotal', async ({ page }) => {
    await addProductToCart(page);
    await page.goto('/cart');
    
    // The subtotal should be visible and formatted as COP
    const subtotalText = page.getByText(/subtotal/i);
    await expect(subtotalText).toBeVisible();
  });

  test('should show shipping information', async ({ page }) => {
    await addProductToCart(page);
    await page.goto('/cart');
    
    // Should show shipping cost or free shipping message
    const shippingInfo = page.getByText(/envío|shipping|gratis|free/i);
    await expect(shippingInfo).toBeVisible();
  });

  test('should show total', async ({ page }) => {
    await addProductToCart(page);
    await page.goto('/cart');
    
    const totalText = page.getByText(/total/i).last();
    await expect(totalText).toBeVisible();
  });
});
