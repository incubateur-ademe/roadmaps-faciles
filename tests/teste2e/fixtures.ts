import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

/**
 * Extended test with tenant-aware helpers.
 * All spec files should import { test, expect } from "./fixtures".
 */
export const test = base;

/** Tenant base URL for E2E tests — used as baseURL in tenant Playwright projects */
export const E2E_TENANT_URL = "http://e2e.localhost:3000";
