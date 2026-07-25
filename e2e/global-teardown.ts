import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { projects, posts } from '../db/schema';
import { like, or } from 'drizzle-orm';

async function globalTeardown() {
  const connectionString = process.env.POSTGRES_TEST_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    console.log('[globalTeardown] No connection string available, skipping database cleanup.');
    return;
  }

  try {
    const sql = neon(connectionString);
    const db = drizzle(sql);

    console.log('[globalTeardown] Cleaning up E2E test rows from test database...');

    const deletedProjects = await db.delete(projects).where(
      or(
        like(projects.slug, 'e2e-%'),
        like(projects.name, 'E2E %')
      )
    ).returning();

    const deletedPosts = await db.delete(posts).where(
      or(
        like(posts.slug, 'e2e-%'),
        like(posts.title, 'E2E %')
      )
    ).returning();

    console.log(`[globalTeardown] Cleaned up ${deletedProjects.length} projects and ${deletedPosts.length} posts.`);
  } catch (error) {
    console.error('[globalTeardown] Error during teardown database cleanup:', error);
  }
}

export default globalTeardown;
