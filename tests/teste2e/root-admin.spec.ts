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
      const unpinButton = row.getByRole("button", { name: /désépingler|unpin/i });
      if (await unpinButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await unpinButton.click();
      }
    });

    test("pin button is visible on each tenant row", async ({ page }) => {
      await page.goto("/admin/tenants");

      const pinButton = page.getByRole("button", { name: /épingler|pin/i });
      await expect(pinButton.first()).toBeVisible();
    });

    test("clicking pin button pins the tenant", async ({ page }) => {
      await page.goto("/admin/tenants");

      // Click the pin button for the E2E tenant
      const row = page.getByRole("row").filter({ hasText: "E2E Test Tenant" });
      const pinButton = row.getByRole("button", { name: /épingler|pin/i });
      await pinButton.click();

      // After pin, the button should now show "unpin" (filled icon)
      await expect(row.getByRole("button", { name: /désépingler|unpin/i })).toBeVisible();
    });

    test("pinned tenant is displayed on roadmap page", async ({ page }) => {
      // First, pin the tenant
      await page.goto("/admin/tenants");
      const row = page.getByRole("row").filter({ hasText: "E2E Test Tenant" });
      const pinButton = row.getByRole("button", { name: /épingler|pin/i });
      await pinButton.click();
      await expect(row.getByRole("button", { name: /désépingler|unpin/i })).toBeVisible();

      // Then navigate to roadmap
      await page.goto("/roadmap");

      // Roadmap should show the post statuses (columns) from the pinned tenant
      await expect(page.getByText("En cours")).toBeVisible();
    });

    test("unpinning tenant shows not-configured on roadmap", async ({ page }) => {
      // Pin then unpin
      await page.goto("/admin/tenants");
      const row = page.getByRole("row").filter({ hasText: "E2E Test Tenant" });

      // Pin
      const pinButton = row.getByRole("button", { name: /épingler|pin/i });
      await pinButton.click();
      await expect(row.getByRole("button", { name: /désépingler|unpin/i })).toBeVisible();

      // Unpin
      const unpinButton = row.getByRole("button", { name: /désépingler|unpin/i });
      await unpinButton.click();
      await expect(row.getByRole("button", { name: /épingler|pin/i })).toBeVisible();

      // Roadmap should show "not configured"
      await page.goto("/roadmap");
      await expect(page.locator("main")).toContainText(/feuille de route n'est pas configurée|not configured/i);
    });

    test("roadmap shows not-configured when no tenant is pinned", async ({ page }) => {
      await page.goto("/roadmap");

      await expect(page.locator("main")).toContainText(/feuille de route n'est pas configurée|not configured/i);
    });
  });
});
