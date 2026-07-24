import { test, expect } from '@playwright/test';

test.describe('Public Flow', () => {
  test('navigates through sections and case studies', async ({ page }) => {
    // Land on index
    await page.goto('/');
    await expect(page).toHaveTitle(/Portfolio/); // Or whatever the actual title is

    // Scroll through sections (triggering animations)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 4));
    await page.waitForTimeout(500); // Wait for scroll/reveal
    
    // Click into a case study - assuming a link exists in Selected Works
    // In actual E2E we'd look for a specific locator, e.g. first case study link
    const caseStudyLink = page.locator('a[href^="/work/"]').first();
    await expect(caseStudyLink).toBeVisible();
    await caseStudyLink.click();

    // Verify case study loaded
    await expect(page.locator('h1').first()).toBeVisible();

    // Prev/next nav works (assuming links exist)
    const nextLink = page.locator('a', { hasText: /Next|Previous/i }).first();
    if (await nextLink.isVisible()) {
      await nextLink.click();
      await page.waitForLoadState('networkidle');
    }

    // Back to index
    await page.goto('/');
    await expect(page.locator('section#hero')).toBeVisible(); // Just checking if we are back
  });
});
