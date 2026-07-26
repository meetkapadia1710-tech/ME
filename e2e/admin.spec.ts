import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

test.describe('Admin Flow', () => {
  // Use a sequential execution for this suite since it modifies global state (DB)
  test.describe.configure({ mode: 'serial' });

  test('logs in, enforces the featured limit, and manages projects', async ({ page }) => {
    // 1. Login
    await page.goto('/admin');
    if (page.url().includes('/login')) {
      const pw = process.env.ADMIN_PASSWORD || 'password123';
      await page.fill('input[name="password"]', pw);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/admin');
    }

    const uniqueId = randomBytes(4).toString('hex');
    const projectTitle = `E2E Project ${uniqueId}`;

    await page.goto('/admin/projects/new');

    await page.fill('input[name="name"]', projectTitle);
    await page.fill('input[name="slug"]', `e2e-proj-${uniqueId}`);
    await page.fill('input[name="tagline"]', 'Test tagline');
    await page.fill('input[name="year"]', '2026');
    await page.selectOption('select[name="type"]', 'Personal');
    await page.fill('input[name="tags"]', 'React, Test');
    await page.fill('textarea[name="overview"]', 'Test overview');

    // 2. Featured limit. The test database is seeded with exactly 4 featured
    // projects, so asking for a 5th must be refused rather than saved.
    await page.locator('input[name="featured"]').check({ force: true });
    await page.getByRole('button', { name: 'Save Project' }).click({ force: true });

    await expect(page.getByText(/Maximum of 4 featured projects allowed/i)).toBeVisible({
      timeout: 15000,
    });
    // Still on the form — nothing was written.
    await expect(page).toHaveURL(/\/admin\/projects\/new/);

    // 3. Unfeatured saves fine, and redirects to the dashboard.
    await page.locator('input[name="featured"]').uncheck({ force: true });
    await page.getByRole('button', { name: 'Save Project' }).click({ force: true });
    await page.waitForURL('**/admin');

    // 4. It shows up on the dashboard.
    await expect(page.locator(`tr:has-text("${projectTitle}")`)).toBeVisible({ timeout: 15000 });

    // 5. Delete it again (cleanup).
    // Accept confirm dialogs automatically
    page.on('dialog', (dialog) => dialog.accept());
    await page.locator(`tr:has-text("${projectTitle}") >> text=Delete`).click({ force: true });

    await expect(page.locator(`tr:has-text("${projectTitle}")`)).toBeHidden();
  });
});
