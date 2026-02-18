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
});
