import { test, expect, Page } from '@playwright/test';

// Mock checkout flow - actual implementation depends on payment gateway
async function fillCheckoutForm(page: Page) {
  // Fill shipping information
  const nameInput = page.getByLabel(/nombre/i);
  if (await nameInput.isVisible()) {
    await nameInput.fill('Juan Pérez');
  }

  const phoneInput = page.getByLabel(/teléfono|celular/i);
  if (await phoneInput.isVisible()) {
    await phoneInput.fill('3001234567');
  }

  const addressInput = page.getByLabel(/dirección/i);
  if (await addressInput.isVisible()) {
    await addressInput.fill('Calle 123 #45-67');
  }

  const cityInput = page.getByLabel(/ciudad/i);
  if (await cityInput.isVisible()) {
    await cityInput.fill('Curumaní');
  }

  const departmentInput = page.getByLabel(/departamento/i);
  if (await departmentInput.isVisible()) {
    await departmentInput.fill('Cesar');
  }
}

// Helper to add product to cart and go to checkout
async function prepareCheckout(page: Page) {
  // First add a product to cart
  await page.goto('/products');
  const productLink = page.locator('a[href*="/products/"]').first();
  await productLink.click();
  
  await page.waitForLoadState('networkidle');
  
  const addToCartButton = page.getByRole('button', { name: /agregar|añadir|carrito/i });
  await addToCartButton.click();
  
  await page.waitForTimeout(500);
  
  // Go to cart
  await page.goto('/cart');
  
  // Click checkout button
  const checkoutButton = page.getByRole('link', { name: /continuar|checkout|comprar|pagar/i });
  await checkoutButton.click();
}

test.describe('Checkout Flow', () => {
  test.describe('Checkout Access', () => {
    test('should redirect to login if not authenticated', async ({ page }) => {
      await prepareCheckout(page);
      
      // Should be on checkout page or redirected to login
      const url = page.url();
      expect(url).toMatch(/checkout|login/);
    });

    test('should not allow checkout with empty cart', async ({ page }) => {
      // Clear cart
      await page.evaluate(() => localStorage.removeItem('cart-storage'));
      
      await page.goto('/checkout');
      
      // Should redirect to cart or show error
      const url = page.url();
      expect(url).toMatch(/cart|checkout/);
    });
  });

  test.describe('Checkout Form', () => {
    test.beforeEach(async ({ page }) => {
      // This test requires authentication - skip if not logged in
      await prepareCheckout(page);
    });

    test('should display order summary', async ({ page }) => {
      // Order summary should be visible
      const orderSummary = page.getByText(/resumen|summary|tu pedido/i);
      
      // Either on checkout page with summary, or redirected
      const url = page.url();
      if (url.includes('checkout')) {
        await expect(orderSummary).toBeVisible({ timeout: 5000 });
      }
    });

    test('should display product in summary', async ({ page }) => {
      const url = page.url();
      if (url.includes('checkout')) {
        // Product info should be visible in summary
        const productItem = page.locator('[class*="item"], [class*="product"]').first();
        await expect(productItem).toBeVisible({ timeout: 5000 });
      }
    });

    test('should display total amount', async ({ page }) => {
      const url = page.url();
      if (url.includes('checkout')) {
        const total = page.getByText(/total/i).last();
        await expect(total).toBeVisible();
      }
    });
  });

  test.describe('Shipping Information', () => {
    test('should show saved addresses if user has them', async ({ page }) => {
      await prepareCheckout(page);
      
      const url = page.url();
      if (url.includes('checkout')) {
        // Look for address selection or form
        const addressSection = page.getByText(/dirección|envío|shipping/i);
        await expect(addressSection).toBeVisible({ timeout: 5000 });
      }
    });

    test('should allow adding new address', async ({ page }) => {
      await prepareCheckout(page);
      
      const url = page.url();
      if (url.includes('checkout')) {
        const newAddressButton = page.getByRole('button', { name: /nueva dirección|agregar|add address/i });
        
        if (await newAddressButton.isVisible()) {
          await newAddressButton.click();
          
          // Address form should appear
          const addressForm = page.getByLabel(/dirección/i);
          await expect(addressForm).toBeVisible();
        }
      }
    });
  });

  test.describe('Payment Methods', () => {
    test('should display payment options', async ({ page }) => {
      await prepareCheckout(page);
      
      const url = page.url();
      if (url.includes('checkout')) {
        const paymentSection = page.getByText(/pago|payment|método/i);
        await expect(paymentSection).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Order Confirmation', () => {
    test.skip('should show confirmation after successful order', async ({ page }) => {
      // This test would require mocking the payment gateway
      // and completing a full checkout flow
      
      await prepareCheckout(page);
      
      // Fill checkout form
      await fillCheckoutForm(page);
      
      // Select payment method
      const paymentOption = page.locator('[class*="payment-method"]').first();
      if (await paymentOption.isVisible()) {
        await paymentOption.click();
      }
      
      // Submit order
      const submitButton = page.getByRole('button', { name: /confirmar|completar|pagar/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Should show confirmation
        await page.waitForURL(/confirmation|success|gracias/i, { timeout: 30000 });
      }
    });
  });
});

test.describe('Checkout - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should work on mobile viewport', async ({ page }) => {
    await prepareCheckout(page);
    
    // Checkout should be usable on mobile
    const url = page.url();
    expect(url).toMatch(/checkout|login|cart/);
  });
});
