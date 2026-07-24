import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Provide a test DB connection
export function getTestDb() {
  if (!process.env.POSTGRES_TEST_URL) {
    throw new Error("POSTGRES_TEST_URL is not set");
  }
  const sql = neon(process.env.POSTGRES_TEST_URL);
  return drizzle(sql, { schema });
}
