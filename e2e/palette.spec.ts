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

    await expect(paletteInput).toBeHidden();

    // Test Caps Lock logic (Command palette should still trigger if we press Cmd+K while Caps Lock is on, though playwright can't explicitly simulate hardware caps lock easily, we can simulate 'K' vs 'k')
    await page.keyboard.press(`${modifier}+K`);
    await expect(paletteInput).toBeVisible();
    await page.keyboard.press('Escape');

    // Tab-cycling inside palette
    await page.keyboard.press(`${modifier}+k`);
    await page.keyboard.press('Tab');
    // Tab should move focus down the list
    await expect(page.locator('button[role="option"]').first()).toBeFocused();
    await page.keyboard.press('Escape');

    // Section-jump from non-home routes
    await page.goto('/approach');
    await page.keyboard.press(`${modifier}+k`);
    await paletteInput.fill('Reach Out');
    await page.keyboard.press('Enter');
    // It should navigate to /#reach-out
    await expect(page).toHaveURL(/.*\/#reach-out/);
  });
});
