import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { projects } from '../db/schema';
import { like, or } from 'drizzle-orm';
import { requireTestDatabaseUrl } from './require-test-db';

async function globalTeardown() {
  // Throws rather than falling back to POSTGRES_URL — this function issues
  // DELETE statements and must never be aimed at production.
  const connectionString = requireTestDatabaseUrl('globalTeardown');

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

    console.log(`[globalTeardown] Cleaned up ${deletedProjects.length} projects.`);
  } catch (error) {
    console.error('[globalTeardown] Error during teardown database cleanup:', error);
  }
}

export default globalTeardown;
