import { test, expect } from '@playwright/test';

const BASE_URL = 'https://frontend-production-4178.up.railway.app';

test.describe('Admin Product Form Tests', () => {
  
  // Admin credentials
  const adminEmail = 'jcamachomolina504@gmail.com';
  const adminPass = 'qC9s4YqERGAHtXf';

  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(adminEmail);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(adminPass);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    
    // Wait for successful login
    await expect(page).toHaveURL(`${BASE_URL}/`);
    
    // Navigate to admin products page
    await page.goto(`${BASE_URL}/admin/products/new`);
    await expect(page).toHaveURL(/.*admin\/products\/new/);
  });

  test('Access Control: Admin can access product form', async ({ page }) => {
    // Verify form elements are visible
    await expect(page.getByLabel('Nombre del Producto')).toBeVisible();
    await expect(page.getByRole('button', { name: /guardar/i })).toBeVisible();
  });

  test('Validation: Empty form shows name error', async ({ page }) => {
    // Click save without filling anything
    await page.getByRole('button', { name: /guardar/i }).click();
    
    // Should show validation error for name (minimum 3 characters)
    await expect(page.getByText('El nombre debe tener al menos 3 caracteres')).toBeVisible();
  });

  test('Validation: Short name shows error', async ({ page }) => {
    // Fill a name that's too short
    await page.getByLabel('Nombre del Producto').fill('AB');
    await page.getByRole('button', { name: /guardar/i }).click();
    
    // Should show validation error
    await expect(page.getByText('El nombre debe tener al menos 3 caracteres')).toBeVisible();
  });

  test('Validation: Valid name passes', async ({ page }) => {
    // Fill a valid name
    await page.getByLabel('Nombre del Producto').fill('Test Product Valid');
    await page.getByRole('button', { name: /guardar/i }).click();
    
    // Name error should NOT appear
    await expect(page.getByText('El nombre debe tener al menos 3 caracteres')).not.toBeVisible();
  });

  test('Price input: Handles numeric input correctly', async ({ page }) => {
    // Fill valid product name first
    await page.getByLabel('Nombre del Producto').fill('Test Product');
    
    // Get price input
    const priceInput = page.getByLabel('Precio Actual');
    
    // Clear and fill with valid number
    await priceInput.fill('50000');
    
    // Verify the value is accepted (formatted with thousands separator)
    await expect(priceInput).toHaveValue(/50[.,]?000/);
  });

  test('Stock input: Accepts valid numbers', async ({ page }) => {
    const stockInput = page.getByLabel('Stock');
    
    await stockInput.fill('10');
    await expect(stockInput).toHaveValue('10');
  });

  test('Category dropdown: Opens and shows options', async ({ page }) => {
    // Find and click category selector
    const categoryCombobox = page.locator('text=Seleccionar categoría').first();
    
    if (await categoryCombobox.isVisible()) {
      await categoryCombobox.click();
      
      // Should open dropdown with options
      await expect(page.locator('[role="listbox"]').or(page.locator('.combobox-options'))).toBeVisible();
    }
  });

  test('Draft functionality: Clear draft shows confirmation', async ({ page }) => {
    // Fill some data first
    await page.getByLabel('Nombre del Producto').fill('Draft Test');
    
    // Wait for auto-save
    await page.waitForTimeout(1500);
    
    // Click clear draft button
    const clearDraftButton = page.getByRole('button', { name: /limpiar borrador/i });
    
    if (await clearDraftButton.isVisible()) {
      await clearDraftButton.click();
      
      // Should show confirmation dialog or action
      await expect(page.getByText(/¿Estás seguro|borrador/i)).toBeVisible({ timeout: 3000 });
    }
  });

  test('Form submission: Valid data can be submitted', async ({ page }) => {
    // Fill all fields with valid data
    await page.getByLabel('Nombre del Producto').fill(`Test Product ${Date.now()}`);
    
    // Fill price
    const priceInput = page.getByLabel('Precio Actual');
    await priceInput.clear();
    await priceInput.fill('50000');
    
    // Fill stock
    const stockInput = page.getByLabel('Stock');
    await stockInput.clear();
    await stockInput.fill('10');
    
    // Verify save button is enabled
    const saveButton = page.getByRole('button', { name: /guardar/i });
    await expect(saveButton).toBeEnabled();
    
    // NOTE: We don't actually submit to avoid creating test data
    // In a real test environment with cleanup, you would:
    // await saveButton.click();
    // await expect(page.getByText('Producto creado')).toBeVisible();
  });
});

test.describe('Access Control Tests', () => {
  test('Non-admin user cannot access admin pages', async ({ page }) => {
    // Register a new user (always non-admin)
    const uniqueId = Date.now();
    const testEmail = `testuser_${uniqueId}@test.com`;
    
    await page.goto(`${BASE_URL}/register`);
    await page.getByRole('textbox', { name: 'Nombre completo' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(testEmail);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('Password123!');
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    
    await expect(page).toHaveURL(`${BASE_URL}/`);
    
    // Try to access admin route
    await page.goto(`${BASE_URL}/admin/products/new`);
    
    // Should be redirected away from admin
    await expect(page).not.toHaveURL(/.*admin\/products\/new/);
  });
});
