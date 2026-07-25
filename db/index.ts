import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "FATAL DATABASE ERROR: POSTGRES_URL environment variable is missing. " +
    "Provide a valid PostgreSQL connection URL in your environment settings."
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
