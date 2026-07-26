import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('validates input and never reports success without a configured provider', async ({ page }) => {
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

    // The action used to be a stub that returned success unconditionally, so the
    // page claimed "Message sent successfully!" while nothing was ever sent.
    // Test runs have no RESEND_API_KEY, so a submit must surface the error state
    // and must NOT claim success. That's the regression this guards.
    await emailInput.fill('test@example.com');
    await submitBtn.click();

    await expect(page.locator('text=Failed to send message')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Message sent successfully!')).toHaveCount(0);

    // Note: the happy path needs a live Resend key and would send real mail, so
    // it is deliberately not asserted here — verify it manually against staging.
  });
});
