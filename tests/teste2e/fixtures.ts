import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

/**
 * Extended test with tenant-aware helpers.
 * All spec files should import { test, expect } from "./fixtures".
 */
export const test = base;

/** Tenant host for E2E tests — injected via x-forwarded-host header in Playwright projects */
export const E2E_TENANT_HOST = "e2e.localhost:3000";
