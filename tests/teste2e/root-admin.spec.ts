import { expect, test } from "./fixtures";

test.describe("Root Admin", () => {
  test("tenant list shows the E2E tenant", async ({ page }) => {
    await page.goto("/admin/tenants");

    await expect(page.getByText("E2E Test Tenant")).toBeVisible();
  });

  test("create tenant page is accessible", async ({ page }) => {
    await page.goto("/admin/tenants/new");

    await expect(page.getByRole("heading")).toContainText(/tenant|créer/i);
  });

  test("users list shows test users", async ({ page }) => {
    await page.goto("/admin/users");

    await expect(page.getByRole("cell", { name: "test-admin@test.local" }).first()).toBeVisible();
  });

  test("audit log shows entries", async ({ page }) => {
    await page.goto("/admin/audit-log");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(/audit/i);
    await expect(page.locator("table")).toBeVisible();
    await expect(page.getByRole("cell", { name: "ROOT_TENANT_CREATE" })).toBeVisible();
  });

  test("security page is accessible", async ({ page }) => {
    await page.goto("/admin/security");

    await expect(page.locator("main")).toContainText(/2FA|double authentification/i);
  });

  test.describe("Pin tenant", () => {
    test.afterEach(async ({ page }) => {
      // Reset: ensure no tenant is pinned after each test
      await page.goto("/admin/tenants");
      const row = page.getByRole("row").filter({ hasText: "E2E Test Tenant" });
      const unpinButton = row.getByRole("button", { name: /^désépingler$/i });
      if ((await unpinButton.count()) > 0) {
        await unpinButton.click();
        await row.getByRole("button", { name: /^épingler$/i }).waitFor();
      }
    });

    test("pin button is visible on each tenant row", async ({ page }) => {
      await page.goto("/admin/tenants");

      const pinButton = page.getByRole("button", { name: /^épingler$/i });
      await expect(pinButton.first()).toBeVisible();
    });

    test("clicking pin button pins the tenant", async ({ page }) => {
      await page.goto("/admin/tenants");

      const row = page.getByRole("row").filter({ hasText: "E2E Test Tenant" });
      await row.getByRole("button", { name: /^épingler$/i }).click();

      await expect(row.getByRole("button", { name: /^désépingler$/i })).toBeVisible();
    });

    test("pinned tenant is displayed on roadmap page", async ({ page }) => {
      await page.goto("/admin/tenants");
      const row = page.getByRole("row").filter({ hasText: "E2E Test Tenant" });
      await row.getByRole("button", { name: /^épingler$/i }).click();
      await expect(row.getByRole("button", { name: /^désépingler$/i })).toBeVisible();

      // Retry navigation until revalidatePath takes effect
      await expect(async () => {
        await page.goto("/roadmap");
        await expect(page.getByText("Test Post")).toBeVisible({ timeout: 3000 });
      }).toPass({ intervals: [1_000, 2_000], timeout: 15_000 });
    });

    test("unpinning tenant shows not-configured on roadmap", async ({ page }) => {
      await page.goto("/admin/tenants");
      const row = page.getByRole("row").filter({ hasText: "E2E Test Tenant" });

      // Pin
      await row.getByRole("button", { name: /^épingler$/i }).click();
      await expect(row.getByRole("button", { name: /^désépingler$/i })).toBeVisible();

      // Unpin
      await row.getByRole("button", { name: /^désépingler$/i }).click();
      await expect(row.getByRole("button", { name: /^épingler$/i })).toBeVisible();

      // Retry navigation until revalidatePath takes effect
      await expect(async () => {
        await page.goto("/roadmap");
        await expect(page.locator("main")).toContainText(/n'est pas configurée|not configured/i, { timeout: 3000 });
      }).toPass({ intervals: [1_000, 2_000], timeout: 15_000 });
    });

    test("roadmap shows not-configured when no tenant is pinned", async ({ page }) => {
      await page.goto("/roadmap");

      await expect(page.locator("main")).toContainText(/n'est pas configurée|not configured/i);
    });
  });
});
