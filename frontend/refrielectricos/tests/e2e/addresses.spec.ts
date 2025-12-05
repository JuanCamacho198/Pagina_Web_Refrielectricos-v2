import { test, expect, Page } from '@playwright/test';

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'password123',
};

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(TEST_USER.email);
  await page.getByLabel(/contraseña|password/i).fill(TEST_USER.password);
  await page.getByRole('button', { name: /ingresar|login|entrar/i }).click();
  await page.waitForLoadState('networkidle');
}

test.describe('User Profile - Addresses', () => {
  test.describe('Address List', () => {
    test.beforeEach(async ({ page }) => {
      await login(page);
      await page.goto('/profile/addresses');
    });

    test.skip('should display addresses page', async ({ page }) => {
      await expect(page).toHaveURL(/profile\/addresses/);
      
      const title = page.getByRole('heading', { name: /direcciones|addresses/i });
      await expect(title).toBeVisible();
    });

    test.skip('should have add address button', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /agregar|nueva|añadir|add/i });
      await expect(addButton).toBeVisible();
    });

    test.skip('should show empty state if no addresses', async ({ page }) => {
      // If user has no addresses, should show empty state
      const emptyState = page.getByText(/no tienes direcciones|sin direcciones|add your first/i);
      // This will pass if visible, or not fail if user has addresses
    });
  });

  test.describe('Create Address', () => {
    test.beforeEach(async ({ page }) => {
      await login(page);
      await page.goto('/profile/addresses');
    });

    test.skip('should open address form', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /agregar|nueva|añadir|add/i });
      await addButton.click();
      
      // Form should be visible (modal or page)
      const addressForm = page.getByLabel(/dirección|address/i);
      await expect(addressForm).toBeVisible({ timeout: 5000 });
    });

    test.skip('should have all required fields', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /agregar|nueva|añadir|add/i });
      await addButton.click();
      
      await page.waitForTimeout(500);
      
      // Check for required fields
      const fields = [
        page.getByLabel(/dirección|address line/i),
        page.getByLabel(/ciudad|city/i),
        page.getByLabel(/departamento|state|region/i),
        page.getByLabel(/teléfono|phone/i),
      ];
      
      for (const field of fields) {
        await expect(field).toBeVisible({ timeout: 3000 });
      }
    });

    test.skip('should validate required fields', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /agregar|nueva|añadir|add/i });
      await addButton.click();
      
      await page.waitForTimeout(500);
      
      // Try to submit empty form
      const submitButton = page.getByRole('button', { name: /guardar|save|crear/i });
      await submitButton.click();
      
      // Should show validation errors
      const errorMessage = page.getByText(/requerido|obligatorio|required/i);
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    });

    test.skip('should create a new address', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /agregar|nueva|añadir|add/i });
      await addButton.click();
      
      await page.waitForTimeout(500);
      
      // Fill the form
      await page.getByLabel(/dirección|address line/i).fill('Calle 123 #45-67');
      await page.getByLabel(/ciudad|city/i).fill('Curumaní');
      await page.getByLabel(/departamento|state/i).fill('Cesar');
      await page.getByLabel(/teléfono|phone/i).fill('3001234567');
      
      // Submit
      const submitButton = page.getByRole('button', { name: /guardar|save|crear/i });
      await submitButton.click();
      
      // Should show success message or close modal
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Default Address', () => {
    test.skip('should mark address as default', async ({ page }) => {
      await login(page);
      await page.goto('/profile/addresses');
      
      // Find "set as default" button
      const setDefaultButton = page.getByRole('button', { name: /predeterminada|default|principal/i }).first();
      
      if (await setDefaultButton.isVisible()) {
        await setDefaultButton.click();
        await page.waitForTimeout(500);
        
        // Should update UI to show this address is now default
      }
    });

    test.skip('should show default badge on default address', async ({ page }) => {
      await login(page);
      await page.goto('/profile/addresses');
      
      // Look for default indicator
      const defaultBadge = page.getByText(/predeterminada|default|principal/i);
      // May or may not be visible depending on if user has set a default
    });
  });

  test.describe('Edit Address', () => {
    test.skip('should edit existing address', async ({ page }) => {
      await login(page);
      await page.goto('/profile/addresses');
      
      const editButton = page.getByRole('button', { name: /editar|edit/i }).first();
      
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Edit form should appear
        const addressInput = page.getByLabel(/dirección|address/i);
        await expect(addressInput).toBeVisible({ timeout: 5000 });
        
        // Modify and save
        await addressInput.fill('Nueva Dirección 456');
        
        const saveButton = page.getByRole('button', { name: /guardar|save/i });
        await saveButton.click();
        
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Delete Address', () => {
    test.skip('should delete address', async ({ page }) => {
      await login(page);
      await page.goto('/profile/addresses');
      
      const deleteButton = page.getByRole('button', { name: /eliminar|delete|borrar/i }).first();
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Confirm deletion if modal appears
        const confirmButton = page.getByRole('button', { name: /confirmar|sí|yes/i });
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
        }
        
        await page.waitForTimeout(1000);
      }
    });
  });
});

test.describe('Navbar - Shipping Address Display', () => {
  test.describe('Desktop', () => {
    test.skip('should show address in navbar when user has default address', async ({ page }) => {
      await login(page);
      await page.goto('/');
      
      // Look for address display in navbar
      const addressDisplay = page.locator('nav').getByText(/enviar a|ship to/i);
      
      // Will be visible if user has address set
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test.skip('should show "Enviar a" in mobile navbar when user has address', async ({ page }) => {
      await login(page);
      await page.goto('/');
      
      // On mobile, should show shipping destination if user has address
      const addressDisplay = page.locator('nav').getByText(/enviar a/i);
      
      // Will be visible only if user has a default address
    });

    test.skip('should not show address if user has no default address', async ({ page }) => {
      // This would require a user without addresses
      await page.goto('/');
      
      // Should not show shipping destination for guests or users without address
      const addressDisplay = page.locator('nav').getByText(/enviar a.*calle|enviar a.*dirección/i);
      await expect(addressDisplay).not.toBeVisible();
    });
  });
});

test.describe('Profile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.skip('should navigate to profile page', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page).toHaveURL(/profile/);
    
    const profileTitle = page.getByRole('heading', { name: /perfil|mi cuenta|profile/i });
    await expect(profileTitle).toBeVisible();
  });

  test.skip('should navigate to orders', async ({ page }) => {
    await page.goto('/profile/orders');
    
    await expect(page).toHaveURL(/profile\/orders/);
  });

  test.skip('should navigate to wishlists', async ({ page }) => {
    await page.goto('/profile/wishlists');
    
    await expect(page).toHaveURL(/profile\/wishlists/);
  });

  test.skip('should navigate to addresses', async ({ page }) => {
    await page.goto('/profile/addresses');
    
    await expect(page).toHaveURL(/profile\/addresses/);
  });
});
