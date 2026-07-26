import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import { requireTestDatabaseUrl } from './e2e/require-test-db';

// Load env files for testing
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Fail at config load — before the webServer builds or seeds anything — if we
// don't have a dedicated test database to point at.
const TEST_DATABASE_URL = requireTestDatabaseUrl('playwright.config');

export default defineConfig({
  testDir: './e2e',
  globalTeardown: require.resolve('./e2e/global-teardown.ts'),
  // These specs share one test database — the admin flow creates and deletes
  // rows the other specs read. Running them in parallel produced failures that
  // vanished when run individually. CI was already serial; local was not, so
  // local runs looked broken when they weren't.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npx tsx scripts/seed-test-db.ts && npm run build && npm run start -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: false,
    // The command seeds, runs a full production build, then starts the server.
    // 120s wasn't enough for that on a cold cache, so the suite failed with
    // "Timed out waiting from config.webServer" before a single test ran.
    timeout: 300 * 1000,
    env: {
      NEXT_PUBLIC_TEST_MODE: 'true',
      AUTH_TRUST_HOST: 'true',
      // The app under test reads POSTGRES_URL; point it at the test branch only.
      // No fallback to the real POSTGRES_URL — see e2e/require-test-db.ts.
      POSTGRES_URL: TEST_DATABASE_URL,
      POSTGRES_TEST_URL: TEST_DATABASE_URL,
      // Signals that the test-vs-production check above already passed, so the
      // child processes don't flag their own intentional override as a clash.
      E2E_DB_VERIFIED: '1',
    }
  },
});
