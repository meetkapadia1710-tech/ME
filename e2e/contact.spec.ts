import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('fills and submits contact form', async ({ page }) => {
    // In the current ReachOut.tsx, it's a mailto link.
    // If the actual form is built in a modal or route, this test would apply:
    await page.goto('/');
    
    // Find the Reach Out section
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');
    const submitBtn = page.locator('button[type="submit"]', { hasText: 'Send Message' });

    // Test empty fields (HTML5 validation should prevent submission)
    // We can just verify the elements exist and are required
    await expect(nameInput).toHaveAttribute('required', '');
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(messageInput).toHaveAttribute('required', '');

    // Test invalid email
    await nameInput.fill('Playwright Tester');
    await emailInput.fill('invalid-email');
    await messageInput.fill('Hello from E2E!');
    // The browser intercepts this before JS due to type="email"
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Test Sentry error simulation
    await emailInput.fill('fail@example.com');
    await submitBtn.click();
    await expect(page.locator('text=Failed to send message')).toBeVisible();

    // Test valid submission
    await emailInput.fill('test@example.com');
    await submitBtn.click();
    await expect(page.locator('text=Message sent successfully!')).toBeVisible();
  });
});
