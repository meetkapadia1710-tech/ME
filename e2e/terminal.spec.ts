import { test, expect } from '@playwright/test';

test.describe('Retro Terminal', () => {
  test('opens on sudo, runs commands, ignores input in forms', async ({ page }) => {
    await page.goto('/');
    
    // Typing sudo in input should NOT open terminal
    const nameInput = page.locator('input[name="name"]');
    await nameInput.scrollIntoViewIfNeeded();
    await nameInput.focus();
    await page.keyboard.type('sudo');
    await expect(page.locator('.retro-terminal')).toBeHidden();

    // Clear focus
    await page.keyboard.press('Escape');
    await page.mouse.click(0, 0);

    // Typing sudo on body SHOULD open terminal
    await page.keyboard.type('sudo');
    const terminal = page.locator('.retro-terminal');
    await expect(terminal).toBeVisible();

    // Wait for boot sequence (fast in test ideally, but let's just wait for the input)
    const terminalInput = page.locator('.retro-terminal input');
    await expect(terminalInput).toBeVisible({ timeout: 5000 });

    // Test command
    await terminalInput.fill('whoami');
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Meet Kapadia — Full-Stack Developer')).toBeVisible();

    // Close
    await page.keyboard.press('Escape');
    await expect(terminal).toBeHidden();
  });
});
