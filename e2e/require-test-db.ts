import path from "path";
import * as dotenv from "dotenv";

/**
 * Guards every code path that writes to or deletes from a database during testing.
 *
 * Historically both playwright.config.ts and e2e/global-teardown.ts fell back to
 * `POSTGRES_URL` when `POSTGRES_TEST_URL` was unset — which meant a bare
 * `npm run test:e2e` would build against production Neon and then run DELETE
 * statements on it. There is no safe fallback here, so there isn't one anymore.
 *
 * Returns the validated test connection string, or throws with a message that
 * explains how to fix it.
 */
export function requireTestDatabaseUrl(caller: string): string {
  // Test entry points are invoked several different ways (playwright config,
  // global teardown, `npx tsx scripts/seed-test-db.ts`), and not all of them
  // load .env.local first. Load it here so the guard sees the same value
  // regardless of how we got here. No-ops in CI, where the file doesn't exist.
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

  const testUrl = process.env.POSTGRES_TEST_URL;
  const prodUrl = process.env.POSTGRES_URL;

  if (!testUrl) {
    throw new Error(
      `[${caller}] POSTGRES_TEST_URL is not set.\n` +
        "Refusing to run: this process writes to and deletes from the database, " +
        "and there is deliberately no fallback to POSTGRES_URL.\n" +
        "Set POSTGRES_TEST_URL to a dedicated test database (a separate Neon branch) " +
        "in .env.local or your CI environment."
    );
  }

  // The webServer runs the app against the TEST branch, so it is started with
  // POSTGRES_URL deliberately repointed at POSTGRES_TEST_URL — inside those
  // child processes the two are equal by design. playwright.config performs the
  // real test-vs-production comparison at config load, where POSTGRES_URL is
  // still the production value, and only then sets this marker.
  const alreadyVerified = process.env.E2E_DB_VERIFIED === "1";

  if (!alreadyVerified && prodUrl && testUrl === prodUrl) {
    throw new Error(
      `[${caller}] POSTGRES_TEST_URL and POSTGRES_URL point at the same database.\n` +
        "Refusing to run: the E2E suite truncates tables and deletes rows. " +
        "Point POSTGRES_TEST_URL at a separate Neon branch."
    );
  }

  return testUrl;
}
