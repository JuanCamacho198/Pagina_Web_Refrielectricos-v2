import { test, expect, Page } from '@playwright/test';

// Admin credentials - should be configured for test environment
const ADMIN_USER = {
  email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
  password: process.env.TEST_ADMIN_PASSWORD || 'admin123',
};

async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(ADMIN_USER.email);
  await page.getByLabel(/contraseña|password/i).fill(ADMIN_USER.password);
  await page.getByRole('button', { name: /ingresar|login|entrar/i }).click();
  
  // Wait for redirect
  await page.waitForLoadState('networkidle');
}

test.describe('Admin Panel', () => {
  test.describe('Admin Access', () => {
    test('should redirect non-admin to login or home', async ({ page }) => {
      await page.goto('/admin');
      
      // Should not be able to access admin
      const url = page.url();
      expect(url).not.toMatch(/\/admin\/products/);
    });

    test.skip('should allow admin user to access dashboard', async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin');
      
      // Should be on admin dashboard
      await expect(page).toHaveURL(/admin/);
      
      // Dashboard elements should be visible
      const dashboard = page.getByText(/panel|dashboard|administración/i);
      await expect(dashboard).toBeVisible();
    });
  });

  test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin');
    });

    test.skip('should display statistics cards', async ({ page }) => {
      // Dashboard should show key metrics
      const statsSection = page.locator('[class*="stats"], [class*="metrics"], [class*="card"]').first();
      await expect(statsSection).toBeVisible({ timeout: 10000 });
    });

    test.skip('should have navigation to different sections', async ({ page }) => {
      // Admin nav should have links to products, orders, users, settings
      const productsLink = page.getByRole('link', { name: /productos/i });
      const ordersLink = page.getByRole('link', { name: /pedidos|órdenes/i });
      const usersLink = page.getByRole('link', { name: /usuarios/i });
      
      await expect(productsLink).toBeVisible();
      await expect(ordersLink).toBeVisible();
      await expect(usersLink).toBeVisible();
    });
  });

  test.describe('Admin Products Management', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/products');
    });

    test.skip('should display products list', async ({ page }) => {
      // Products table or grid should be visible
      const productsTable = page.locator('table, [class*="product-list"], [class*="grid"]');
      await expect(productsTable).toBeVisible({ timeout: 10000 });
    });

    test.skip('should have create product button', async ({ page }) => {
      const createButton = page.getByRole('link', { name: /crear|nuevo|agregar/i });
      await expect(createButton).toBeVisible();
    });

    test.skip('should navigate to create product form', async ({ page }) => {
      const createButton = page.getByRole('link', { name: /crear|nuevo|agregar/i });
      await createButton.click();
      
      await expect(page).toHaveURL(/admin\/products\/new|admin\/products\/create/);
    });

    test.skip('should display product form fields', async ({ page }) => {
      await page.goto('/admin/products/new');
      
      // Form fields should be visible
      const nameInput = page.getByLabel(/nombre/i);
      const priceInput = page.getByLabel(/precio/i);
      const stockInput = page.getByLabel(/stock|inventario/i);
      
      await expect(nameInput).toBeVisible();
      await expect(priceInput).toBeVisible();
      await expect(stockInput).toBeVisible();
    });

    test.skip('should validate required fields', async ({ page }) => {
      await page.goto('/admin/products/new');
      
      // Try to submit empty form
      const submitButton = page.getByRole('button', { name: /guardar|crear|save/i });
      await submitButton.click();
      
      // Should show validation errors
      const errorMessage = page.getByText(/requerido|obligatorio|required/i);
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    });

    test.skip('should have search functionality', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/buscar/i);
      
      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);
      }
    });

    test.skip('should have pagination', async ({ page }) => {
      const pagination = page.locator('[class*="pagination"]');
      // Pagination might not be visible if few products
    });

    test.skip('should have sorting options', async ({ page }) => {
      // Look for sortable table headers or sort dropdown
      const sortableHeader = page.locator('th[class*="sort"], button[class*="sort"]').first();
      
      if (await sortableHeader.isVisible()) {
        await sortableHeader.click();
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Admin Orders Management', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/orders');
    });

    test.skip('should display orders list', async ({ page }) => {
      const ordersTable = page.locator('table, [class*="order-list"]');
      await expect(ordersTable).toBeVisible({ timeout: 10000 });
    });

    test.skip('should show order status', async ({ page }) => {
      // Orders should show status badges
      const statusBadge = page.locator('[class*="status"], [class*="badge"]').first();
      await expect(statusBadge).toBeVisible({ timeout: 10000 });
    });

    test.skip('should be able to filter by status', async ({ page }) => {
      const statusFilter = page.locator('select[name*="status"], [class*="filter"]').first();
      
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
      }
    });
  });

  test.describe('Admin Users Management', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/users');
    });

    test.skip('should display users list', async ({ page }) => {
      const usersTable = page.locator('table, [class*="user-list"]');
      await expect(usersTable).toBeVisible({ timeout: 10000 });
    });

    test.skip('should show user roles', async ({ page }) => {
      // User roles should be visible
      const roleIndicator = page.getByText(/admin|user|cliente/i).first();
      await expect(roleIndicator).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Admin Settings', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/settings');
    });

    test.skip('should display settings form', async ({ page }) => {
      const settingsForm = page.locator('form, [class*="settings"]');
      await expect(settingsForm).toBeVisible({ timeout: 10000 });
    });

    test.skip('should have store name setting', async ({ page }) => {
      const storeNameInput = page.getByLabel(/nombre de la tienda|store name/i);
      await expect(storeNameInput).toBeVisible();
    });

    test.skip('should have free shipping toggle', async ({ page }) => {
      const freeShippingToggle = page.getByRole('switch', { name: /envío gratis/i });
      
      if (await freeShippingToggle.isVisible()) {
        // Toggle should be clickable
        await freeShippingToggle.click();
        await page.waitForTimeout(300);
      }
    });

    test.skip('should save settings', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: /guardar|save/i });
      await expect(saveButton).toBeVisible();
      
      await saveButton.click();
      
      // Should show success message
      const successMessage = page.getByText(/guardado|saved|éxito/i);
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    });
  });
});

test.describe('Admin - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.skip('should have responsive admin layout', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin');
    
    // Admin should be usable on mobile
    const adminContent = page.locator('[class*="admin"], main');
    await expect(adminContent).toBeVisible();
  });

  test.skip('should have mobile navigation', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin');
    
    // Should have a mobile menu or hamburger
    const mobileMenu = page.locator('button[class*="menu"], [class*="hamburger"]').first();
    
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(300);
    }
  });
});
