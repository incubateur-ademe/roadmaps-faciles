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

    await expect(page.getByText("test-admin@test.local")).toBeVisible();
  });

  test("audit log shows entries", async ({ page }) => {
    await page.goto("/admin/audit-log");

    await expect(page.getByText("ROOT_TENANT_CREATE")).toBeVisible();
  });

  test("security page is accessible", async ({ page }) => {
    await page.goto("/admin/security");

    await expect(page.locator("main")).toContainText(/2FA|double authentification/i);
  });
});
