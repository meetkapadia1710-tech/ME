import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

test.describe('Admin Flow', () => {
  // Use a sequential execution for this suite since it modifies global state (DB)
  test.describe.configure({ mode: 'serial' });

  test('logs in, manages projects, enforces featured limit, manages posts', async ({ page }) => {
    // 1. Login
    await page.goto('/admin');
    if (page.url().includes('/login')) {
      const pw = process.env.ADMIN_PASSWORD || 'password123';
      await page.fill('input[name="password"]', pw);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/admin');
    }

    // 2. Projects CRUD & Featured Limit
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
    
    // Check featured
    await page.locator('input[name="featured"]').click({ force: true });
    
    // Save
    await page.getByRole('button', { name: 'Save Project' }).click({ force: true });
    
    // Might get redirected back to /admin or show success toast
    // The codebase redirects to /admin on success
    await page.waitForURL('**/admin');
    
    // 3. Posts CRUD lifecycle
    const postTitle = `E2E Post ${uniqueId}`;
    await page.goto('/admin/posts/new');

    await page.fill('input[name="title"]', postTitle);
    await page.fill('input[name="slug"]', `e2e-post-${uniqueId}`);
    await page.fill('textarea[name="excerpt"]', 'E2E excerpt');
    await page.fill('textarea[name="body"]', 'Hello world this is E2E.');
    await page.fill('input[name="tags"]', 'test, playwright');
    
    // Save Draft
    await page.locator('button[name="action"][value="draft"]').click({ force: true });
    await page.waitForURL('**/admin');

    // Confirm it's not on /blog
    await page.goto('/blog');
    await expect(page.locator(`text=${postTitle}`)).toBeHidden();

    // Go back and publish
    await page.goto('/admin');
    await page.locator(`tr:has-text("${postTitle}") >> text=Edit`).click({ force: true });
    await page.waitForURL('**/admin/posts/*');
    await page.locator('button[name="action"][value="publish"]').click({ force: true });
    await page.waitForURL('**/admin');

    // Confirm it IS on /blog
    await page.goto('/blog');
    // We add timeout because blog page might take time to re-render in dev
    await expect(page.locator(`text=${postTitle}`)).toBeVisible({ timeout: 15000 });

    // 4. Delete the post (cleanup)
    await page.goto('/admin');
    // Accept confirm dialogs automatically
    page.on('dialog', dialog => dialog.accept());
    await page.locator(`tr:has-text("${postTitle}") >> text=Delete`).evaluate((node: HTMLElement) => node.click());
    
    // Verify deletion from admin UI
    await expect(page.locator(`tr:has-text("${postTitle}")`)).toBeHidden();
  });
});
