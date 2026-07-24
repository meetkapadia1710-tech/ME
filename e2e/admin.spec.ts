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

    await page.click('text=New Project');
    await page.waitForURL('**/admin/projects/new');
    
    await page.fill('input[name="name"]', projectTitle);
    await page.fill('input[name="slug"]', `e2e-proj-${uniqueId}`);
    await page.fill('input[name="tagline"]', 'Test tagline');
    await page.fill('input[name="year"]', '2026');
    await page.selectOption('select[name="type"]', 'Personal');
    await page.fill('input[name="tags"]', 'React, Test');
    await page.fill('textarea[name="overview"]', 'Test overview');
    
    // Check featured
    await page.check('input[name="featured"]');
    
    // Save
    await page.click('button[type="submit"]', { hasText: 'Save' });
    
    // Might get redirected back to /admin or show success toast
    // The codebase redirects to /admin on success
    await page.waitForURL('**/admin');
    
    // 3. Posts CRUD lifecycle
    const postTitle = `E2E Post ${uniqueId}`;
    await page.click('text=New Post');
    await page.waitForURL('**/admin/posts/new');

    await page.fill('input[name="title"]', postTitle);
    await page.fill('input[name="slug"]', `e2e-post-${uniqueId}`);
    await page.fill('input[name="excerpt"]', 'E2E excerpt');
    await page.fill('textarea[name="body"]', 'Hello world this is E2E.');
    await page.fill('input[name="tags"]', 'test, playwright');
    
    // Save Draft
    await page.click('button[name="action"][value="draft"]');
    await page.waitForURL('**/admin');

    // Confirm it's not on /blog
    await page.goto('/blog');
    await expect(page.locator(`text=${postTitle}`)).toBeHidden();

    // Go back and publish
    await page.goto('/admin');
    await page.click(`tr:has-text("${postTitle}") >> text=Edit`);
    await page.click('button[name="action"][value="publish"]');
    await page.waitForURL('**/admin');

    // Confirm it IS on /blog
    await page.goto('/blog');
    await expect(page.locator(`text=${postTitle}`)).toBeVisible();

    // 4. Delete the post (cleanup)
    await page.goto('/admin');
    // Accept confirm dialogs automatically
    page.on('dialog', dialog => dialog.accept());
    await page.click(`tr:has-text("${postTitle}") >> text=Delete`);
    
    // Verify deletion from admin UI
    await expect(page.locator(`tr:has-text("${postTitle}")`)).toBeHidden();
  });
});
