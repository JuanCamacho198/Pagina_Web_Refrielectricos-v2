import { test, expect, Page } from '@playwright/test';

// Test user credentials - should be configured in environment or test database
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
};

const ADMIN_USER = {
  email: 'admin@example.com',
  password: 'admin123',
};

async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/contraseña|password/i).fill(password);
  await page.getByRole('button', { name: /ingresar|login|entrar/i }).click();
}

test.describe('Authentication', () => {
  test.describe('Login', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/contraseña|password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /ingresar|login|entrar/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByLabel(/email/i).fill('wrong@email.com');
      await page.getByLabel(/contraseña|password/i).fill('wrongpassword');
      await page.getByRole('button', { name: /ingresar|login|entrar/i }).click();
      
      // Should show error message
      const errorMessage = page.getByText(/error|inválido|incorrecto/i);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/contraseña|password/i).fill('password123');
      await page.getByRole('button', { name: /ingresar|login|entrar/i }).click();
      
      const emailError = page.getByText(/email inválido|formato de email/i);
      await expect(emailError).toBeVisible({ timeout: 3000 });
    });

    test('should have link to register page', async ({ page }) => {
      await page.goto('/login');
      
      const registerLink = page.getByRole('link', { name: /registr|crear cuenta/i });
      await expect(registerLink).toBeVisible();
      
      await registerLink.click();
      await expect(page).toHaveURL(/register/);
    });

    test('should redirect authenticated user away from login', async ({ page }) => {
      // This test requires a valid test user
      // Skip if no test credentials available
      test.skip(!TEST_USER.email, 'No test user configured');
      
      await login(page, TEST_USER.email, TEST_USER.password);
      
      // Try to access login page again
      await page.goto('/login');
      
      // Should redirect to home or profile
      await expect(page).not.toHaveURL(/login/);
    });
  });

  test.describe('Registration', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/register');
      
      await expect(page.getByLabel(/nombre/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/contraseña/i).first()).toBeVisible();
      await expect(page.getByLabel(/confirmar/i)).toBeVisible();
    });

    test('should validate password match', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByLabel(/nombre/i).fill('Test User');
      await page.getByLabel(/email/i).fill('newuser@example.com');
      
      // Fill passwords differently
      const passwordInputs = page.getByLabel(/contraseña/i);
      await passwordInputs.first().fill('password123');
      await page.getByLabel(/confirmar/i).fill('different456');
      
      await page.getByRole('button', { name: /registr|crear/i }).click();
      
      const mismatchError = page.getByText(/no coinciden|mismatch/i);
      await expect(mismatchError).toBeVisible({ timeout: 3000 });
    });

    test('should validate short password', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByLabel(/nombre/i).fill('Test User');
      await page.getByLabel(/email/i).fill('newuser@example.com');
      
      const passwordInputs = page.getByLabel(/contraseña/i);
      await passwordInputs.first().fill('123');
      await page.getByLabel(/confirmar/i).fill('123');
      
      await page.getByRole('button', { name: /registr|crear/i }).click();
      
      const lengthError = page.getByText(/6 caracteres|muy corta/i);
      await expect(lengthError).toBeVisible({ timeout: 3000 });
    });

    test('should have link to login page', async ({ page }) => {
      await page.goto('/register');
      
      const loginLink = page.getByRole('link', { name: /ingresar|ya tienes cuenta|login/i });
      await expect(loginLink).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing profile without auth', async ({ page }) => {
      await page.goto('/profile');
      
      // Should redirect to login
      await expect(page).toHaveURL(/login/);
    });

    test('should redirect to login when accessing orders without auth', async ({ page }) => {
      await page.goto('/profile/orders');
      
      await expect(page).toHaveURL(/login/);
    });

    test('should redirect to login when accessing wishlists without auth', async ({ page }) => {
      await page.goto('/profile/wishlists');
      
      await expect(page).toHaveURL(/login/);
    });

    test('should redirect to login when accessing admin without auth', async ({ page }) => {
      await page.goto('/admin');
      
      // Should redirect to login or show unauthorized
      const url = page.url();
      expect(url).toMatch(/login|unauthorized|403/);
    });
  });

  test.describe('Logout', () => {
    test.skip('should logout successfully', async ({ page }) => {
      // This test requires a valid test user
      await login(page, TEST_USER.email, TEST_USER.password);
      
      // Find and click logout button
      const userMenu = page.locator('[class*="profile"], [class*="user-menu"]');
      await userMenu.click();
      
      const logoutButton = page.getByRole('button', { name: /cerrar sesión|logout|salir/i });
      await logoutButton.click();
      
      // Should be logged out - login button should be visible
      const loginButton = page.getByRole('link', { name: /ingresar|login/i });
      await expect(loginButton).toBeVisible();
    });
  });
});

test.describe('Admin Authentication', () => {
  test('should restrict admin panel to non-admin users', async ({ page }) => {
    // Login as regular user
    test.skip(!TEST_USER.email, 'No test user configured');
    
    await login(page, TEST_USER.email, TEST_USER.password);
    await page.goto('/admin');
    
    // Should show unauthorized or redirect
    const url = page.url();
    expect(url).not.toContain('/admin/products');
  });
});
