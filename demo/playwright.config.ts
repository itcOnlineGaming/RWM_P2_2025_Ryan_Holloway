import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E test configuration for emotion-tracker demo app.
 * Tests the demo app running at http://localhost:5173 (default Vite dev port).
 *
 * Run tests with:
 *   npm run test:e2e          - run in headed mode
 *   npm run test:e2e:headed   - run in headed mode with browser visible
 *   npm run test:e2e:ui       - run in UI mode (interactive)
 */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
