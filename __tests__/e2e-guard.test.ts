import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { requireTestDatabaseUrl } from '@/e2e/require-test-db';

/**
 * These guard the guard. e2e/require-test-db.ts is what stops `npm run test:e2e`
 * from building against, seeding, and then DELETE-ing from production Neon —
 * so it needs to stay loud.
 *
 * Note: dotenv does not override keys already present in process.env, so
 * setting a key to '' here reliably shadows whatever is in .env.local.
 */

const ORIGINAL_TEST_URL = process.env.POSTGRES_TEST_URL;
const ORIGINAL_PROD_URL = process.env.POSTGRES_URL;
const ORIGINAL_VERIFIED = process.env.E2E_DB_VERIFIED;

describe('requireTestDatabaseUrl', () => {
  beforeEach(() => {
    process.env.POSTGRES_TEST_URL = '';
    process.env.POSTGRES_URL = '';
    process.env.E2E_DB_VERIFIED = '';
  });

  afterAll(() => {
    process.env.POSTGRES_TEST_URL = ORIGINAL_TEST_URL ?? '';
    process.env.POSTGRES_URL = ORIGINAL_PROD_URL ?? '';
    process.env.E2E_DB_VERIFIED = ORIGINAL_VERIFIED ?? '';
  });

  it('throws when POSTGRES_TEST_URL is not set, rather than falling back', () => {
    process.env.POSTGRES_URL = 'postgres://user@prod-host/neondb';

    expect(() => requireTestDatabaseUrl('unit')).toThrow(/POSTGRES_TEST_URL is not set/);
    // The whole point: it must not hand back the production URL.
    expect(() => requireTestDatabaseUrl('unit')).toThrow(/no fallback to POSTGRES_URL/);
  });

  it('throws when the test and production URLs are identical', () => {
    const shared = 'postgres://user@same-host/neondb';
    process.env.POSTGRES_TEST_URL = shared;
    process.env.POSTGRES_URL = shared;

    expect(() => requireTestDatabaseUrl('unit')).toThrow(/same database/);
  });

  it('returns the test URL when it is set and distinct from production', () => {
    process.env.POSTGRES_TEST_URL = 'postgres://user@test-branch/neondb';
    process.env.POSTGRES_URL = 'postgres://user@prod-branch/neondb';

    expect(requireTestDatabaseUrl('unit')).toBe('postgres://user@test-branch/neondb');
  });

  it('allows a test URL when no production URL is configured at all', () => {
    process.env.POSTGRES_TEST_URL = 'postgres://user@test-branch/neondb';

    expect(requireTestDatabaseUrl('unit')).toBe('postgres://user@test-branch/neondb');
  });

  it('names the caller in the error so the failing entry point is obvious', () => {
    expect(() => requireTestDatabaseUrl('globalTeardown')).toThrow(/\[globalTeardown\]/);
  });

  it('allows the deliberate override inside the webServer, once already verified', () => {
    // playwright.config points POSTGRES_URL at the test branch for the app under
    // test, so the two are equal by design in child processes.
    const shared = 'postgres://user@test-branch/neondb';
    process.env.POSTGRES_TEST_URL = shared;
    process.env.POSTGRES_URL = shared;
    process.env.E2E_DB_VERIFIED = '1';

    expect(requireTestDatabaseUrl('seed-test-db')).toBe(shared);
  });

  it('still requires POSTGRES_TEST_URL even when marked verified', () => {
    process.env.E2E_DB_VERIFIED = '1';

    expect(() => requireTestDatabaseUrl('seed-test-db')).toThrow(/POSTGRES_TEST_URL is not set/);
  });
});
