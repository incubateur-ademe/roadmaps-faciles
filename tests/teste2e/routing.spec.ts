import { expect, test } from "./fixtures";

test.describe("Routing & Pages", () => {
  test("tenant home is accessible via x-forwarded-host header", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-host": "e2e.localhost:3000" });
    await page.goto("/");

    // Should show tenant content (not root home)
    await expect(page.getByText("E2E Test Tenant")).toBeVisible();
  });

  test("stats page is accessible", async ({ page }) => {
    await page.goto("/stats");

    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("roadmap page is accessible on tenant", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-host": "e2e.localhost:3000" });
    await page.goto("/roadmap");

    await expect(page.locator("main")).toBeVisible();
  });

  test("error page displays content", async ({ page }) => {
    await page.goto("/error");

    await expect(page.locator("main")).toBeVisible();
  });
});
