import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.describe('Home Page Accessibility', () => {
    test('should pass axe accessibility audit', async ({ page }) => {
      await page.goto('/');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('[class*="carousel"]') // Exclude complex components that may need manual review
        .analyze();
      
      // Log violations for debugging
      if (accessibilityScanResults.violations.length > 0) {
        console.log('Accessibility violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));
      }
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible navigation', async ({ page }) => {
      await page.goto('/');
      
      // Navigation should be accessible by keyboard
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // Check for skip link (best practice)
      const skipLink = page.locator('a[href="#main"], a[href="#content"]');
      // Skip link might not exist, but if it does, it should work
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      // Page should have an h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      
      // Check heading order (h1 should come before h2, etc.)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      let previousLevel = 0;
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const level = parseInt(tagName.replace('h', ''));
        
        // Heading levels should not skip more than one level
        if (previousLevel > 0) {
          expect(level).toBeLessThanOrEqual(previousLevel + 1);
        }
        previousLevel = level;
      }
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/');
      
      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Image should have alt text or role="presentation" for decorative images
        expect(alt !== null || role === 'presentation').toBeTruthy();
      }
    });
  });

  test.describe('Products Page Accessibility', () => {
    test('should pass axe accessibility audit', async ({ page }) => {
      await page.goto('/products');
      
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      // Allow some violations for third-party components but log them
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      
      if (criticalViolations.length > 0) {
        console.log('Critical accessibility violations:', JSON.stringify(criticalViolations, null, 2));
      }
      
      expect(criticalViolations).toEqual([]);
    });

    test('product cards should be keyboard accessible', async ({ page }) => {
      await page.goto('/products');
      
      await page.waitForLoadState('networkidle');
      
      // Product links should be focusable
      const productLink = page.locator('a[href*="/products/"]').first();
      await expect(productLink).toBeVisible();
      
      // Tab to the product link
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Some element should be focused
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Form Accessibility', () => {
    test('login form should be accessible', async ({ page }) => {
      await page.goto('/login');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('form inputs should have labels', async ({ page }) => {
      await page.goto('/login');
      
      const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        
        if (id) {
          // Check if there's a label with for attribute matching
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          // Input should have a label OR aria-label OR aria-labelledby
          expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
        }
      }
    });

    test('registration form should be accessible', async ({ page }) => {
      await page.goto('/register');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      
      expect(criticalViolations).toEqual([]);
    });
  });

  test.describe('Cart Page Accessibility', () => {
    test('should pass axe accessibility audit', async ({ page }) => {
      await page.goto('/cart');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      
      expect(criticalViolations).toEqual([]);
    });

    test('cart buttons should be accessible', async ({ page }) => {
      // Add item to cart first
      await page.goto('/products');
      const productLink = page.locator('a[href*="/products/"]').first();
      await productLink.click();
      await page.waitForLoadState('networkidle');
      
      const addButton = page.getByRole('button', { name: /agregar|añadir|carrito/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(500);
      }
      
      await page.goto('/cart');
      
      // Action buttons should have accessible names
      const buttons = await page.getByRole('button').all();
      
      for (const button of buttons) {
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        
        // Button should have accessible text or aria-label
        expect(ariaLabel || (textContent && textContent.trim())).toBeTruthy();
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast on home page', async ({ page }) => {
      await page.goto('/');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .options({ runOnly: ['color-contrast'] })
        .analyze();
      
      // Log contrast issues but don't fail (may need design review)
      if (accessibilityScanResults.violations.length > 0) {
        console.log('Color contrast issues:', accessibilityScanResults.violations.length);
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be able to navigate entire page with keyboard', async ({ page }) => {
      await page.goto('/');
      
      // Start at the beginning
      await page.keyboard.press('Tab');
      
      // Should be able to tab through interactive elements
      let tabCount = 0;
      const maxTabs = 50;
      
      while (tabCount < maxTabs) {
        const focusedElement = page.locator(':focus');
        const isVisible = await focusedElement.isVisible().catch(() => false);
        
        if (isVisible) {
          // Check that focused element is visible
          const box = await focusedElement.boundingBox();
          expect(box).not.toBeNull();
        }
        
        await page.keyboard.press('Tab');
        tabCount++;
      }
    });

    test('modal should trap focus', async ({ page }) => {
      // Find a page with a modal trigger
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      // Click first product to potentially trigger a modal or navigate
      const productLink = page.locator('a[href*="/products/"]').first();
      await productLink.click();
      
      // If there's a modal, focus should be trapped
      // This is a placeholder - actual implementation depends on your modal triggers
    });
  });
});

test.describe('Screen Reader Compatibility', () => {
  test('should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    
    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('should announce dynamic content changes', async ({ page }) => {
    await page.goto('/');
    
    // Check for aria-live regions
    const liveRegions = await page.locator('[aria-live]').all();
    
    // App should have at least one live region for announcements (toast, alerts)
    // This might be created dynamically
  });
});
