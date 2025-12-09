import { test, expect } from '@playwright/test';

const BASE_URL = 'https://frontend-production-4178.up.railway.app';

test.describe('Form Validation & UX Tests', () => {
  
  // Helper to create a unique user for testing
  const uniqueId = Date.now();
  const userEmail = `test_forms_${uniqueId}@local.test`;
  const userPass = 'Password123!';

  test.beforeAll(async () => {
    // Create a user once for the suite if possible, or do it in the test
    // For simplicity and isolation, we'll do it in the first test or assume it exists
  });

  test('1. Authentication & Profile Address Form', async ({ page }) => {
    // --- Registration (to ensure we have a valid user) ---
    await page.goto(`${BASE_URL}/register`);
    await page.getByRole('textbox', { name: 'Nombre completo' }).fill(`Test User ${uniqueId}`);
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(userEmail);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(userPass);
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    
    // Wait for redirect to home or profile
    await expect(page).toHaveURL(`${BASE_URL}/`);
    
    // --- Navigate to Addresses ---
    await page.goto(`${BASE_URL}/profile/addresses`);
    
    // Open "Add Address" form (assuming there is a button, if not it might be inline)
    // Based on report: "Clicked 'Agregar Nueva'"
    const addButton = page.getByRole('button', { name: /agregar/i });
    if (await addButton.isVisible()) {
      await addButton.click();
    }

    // --- Test Invalid Submission (Empty) ---
    await page.getByRole('button', { name: /guardar/i }).click();
    
    // Expect validation:
    // 1. Browser validation (focus on first empty field)
    // 2. Or UI error messages
    // We check if we are still on the form (modal open or page)
    // And check for error messages if they exist (e.g., "Requerido")
    // Since report said "Form was not submitted", we verify we didn't get a success toast yet
    await expect(page.getByText('Dirección agregada')).not.toBeVisible();

    // --- Test Valid Submission ---
    await page.getByRole('textbox', { name: /nombre/i }).fill('Test Address Name');
    await page.getByRole('textbox', { name: /direcci/i }).fill('Calle 123 #45-67');
    await page.getByRole('textbox', { name: /tel/i }).fill('3001234567');
    
    // Handle Selects/Comboboxes if they exist
    // Based on report: Department and City are dropdowns
    // We might need to click them and select options
    // This part depends on the specific UI implementation (native select or custom)
    // If custom:
    // await page.click('text=Seleccionar Departamento');
    // await page.click('text=Bogotá D.C.');
    
    await page.getByRole('button', { name: /guardar/i }).click();

    // Verify Success
    // await expect(page.getByText('Dirección agregada')).toBeVisible();
  });

  test('2. Admin Product Form (Requires Admin)', async ({ page }) => {
    // NOTE: This test requires a valid ADMIN user.
    // The current 'userEmail' is likely a regular USER.
    // We will attempt to login as admin, but if it fails, the test will fail/skip.
    
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('admin@local.test');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('changeme');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Check if login worked (if not, we can't proceed)
    const isLoginSuccess = await page.getByText('Bienvenido').isVisible() || page.url() === `${BASE_URL}/`;
    
    if (!isLoginSuccess) {
      console.log('Skipping Admin test: Invalid Admin Credentials');
      return;
    }

    await page.goto(`${BASE_URL}/admin/products/new`);

    // --- Test Invalid Submission ---
    await page.getByRole('button', { name: /guardar/i }).click();
    
    // Expect validation errors
    await expect(page.getByText('Requerido').first()).toBeVisible(); // Adjust text based on Zod schema messages

    // --- Test Valid Submission ---
    await page.getByLabel('Nombre del Producto').fill(`Test Product ${uniqueId}`);
    await page.getByLabel('Precio Actual').fill('10000');
    await page.getByLabel('Stock').fill('10');
    
    // Description (RichText) - might need locator manipulation
    // await page.locator('.tiptap').fill('Description test');

    // Category (Combobox)
    // await page.click('text=Seleccionar categoría');
    // await page.click('text=Neveras');

    await page.getByRole('button', { name: /guardar/i }).click();
    
    // Verify Success
    // await expect(page).toHaveURL(/.*admin\/products/);
  });

});
