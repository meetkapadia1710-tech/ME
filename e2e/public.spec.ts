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

  test('cinematic sequence handles fast scroll and resize without breaking layout', async ({ page }) => {
    await page.goto('/');

    // Ensure cinematic container exists
    const cinematicTrigger = page.locator('.cinematic-trigger-area');
    await expect(cinematicTrigger).toBeVisible();

    // Scroll rapidly through the sequence
    await page.evaluate(() => window.scrollTo(0, 3000));
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 8000));
    
    // Resize window mid-sequence to verify pin doesn't break
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(200);

    // Scroll to very end
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check that we can see the footer (meaning layout isn't stuck/pinned forever)
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
