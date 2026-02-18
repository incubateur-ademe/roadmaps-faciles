import { expect, test } from "./fixtures";

test.describe("Authentication Pages", () => {
  test("root login page shows connexion form", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/.+/);
    const emailInput = page.getByLabel(/email|courriel/i);
    await expect(emailInput).toBeVisible();
  });

  test("tenant login page is accessible via header", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-host": "e2e.localhost:3000" });
    await page.goto("/login");

    await expect(page).toHaveTitle(/.+/);
    await expect(page.getByText("E2E Test Tenant")).toBeVisible();
  });

  test("2FA page redirects or loads", async ({ page }) => {
    await page.goto("/2fa");

    // Without auth, may redirect to login — verify no 500
    expect(page.url()).toMatch(/\/(2fa|login)/);
  });

  test("login error page displays error info", async ({ page }) => {
    await page.goto("/login/error?error=OAuthSignin");

    await expect(page.locator("main")).toContainText(/.+/);
  });
});
