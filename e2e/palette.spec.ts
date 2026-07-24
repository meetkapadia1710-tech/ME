import { test, expect } from '@playwright/test';

test.describe('Command Palette', () => {
  test('opens, searches, navigates, and closes', async ({ page }) => {
    await page.goto('/');

    // Open via Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+k`);

    // Verify palette is visible
    const paletteInput = page.locator('input[placeholder="Jump to..."]');
    await expect(paletteInput).toBeVisible();

    // Search
    await paletteInput.fill('Reach Out');
    
    // Navigate via keyboard
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');

    // Close via Esc
    await page.keyboard.press('Escape');
    await expect(paletteInput).toBeHidden();
  });
});
