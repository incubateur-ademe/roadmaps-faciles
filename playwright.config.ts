import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/teste2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/teste2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        storageState: "tests/teste2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /\b(health|home)\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
