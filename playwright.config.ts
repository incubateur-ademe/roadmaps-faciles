import { defineConfig, devices } from "@playwright/test";

const AUTH_DIR = "tests/teste2e/.auth";

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
    // --- Setup: creates 3 auth states ---
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },

    // --- Root (no tenant header) ---
    {
      name: "root-auth",
      use: {
        ...devices["Desktop Chrome"],
        storageState: `${AUTH_DIR}/admin.json`,
      },
      dependencies: ["setup"],
      testMatch: /\b(root-admin|profile)\.spec\.ts/,
    },

    // --- Tenant: admin ---
    {
      name: "tenant-admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: `${AUTH_DIR}/admin.json`,
        extraHTTPHeaders: { "x-forwarded-host": "e2e.localhost:3000" },
      },
      dependencies: ["setup"],
      testMatch: /\b(tenant-admin|tenant-admin-extras|board|moderation)\.spec\.ts/,
    },

    // --- Tenant: moderator ---
    {
      name: "tenant-mod",
      use: {
        ...devices["Desktop Chrome"],
        storageState: `${AUTH_DIR}/mod.json`,
        extraHTTPHeaders: { "x-forwarded-host": "e2e.localhost:3000" },
      },
      dependencies: ["setup"],
      testMatch: /\bmoderation\.spec\.ts/,
    },

    // --- Tenant: user ---
    {
      name: "tenant-user",
      use: {
        ...devices["Desktop Chrome"],
        storageState: `${AUTH_DIR}/user.json`,
        extraHTTPHeaders: { "x-forwarded-host": "e2e.localhost:3000" },
      },
      dependencies: ["setup"],
      testMatch: /\b(post|search|i18n)\.spec\.ts/,
    },

    // --- Unauthenticated ---
    {
      name: "unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /\b(health|home|auth|routing|api)\.spec\.ts/,
    },

    // --- Mobile ---
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
        storageState: `${AUTH_DIR}/user.json`,
        extraHTTPHeaders: { "x-forwarded-host": "e2e.localhost:3000" },
      },
      dependencies: ["setup"],
      testMatch: /\b(home|board|post)\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
