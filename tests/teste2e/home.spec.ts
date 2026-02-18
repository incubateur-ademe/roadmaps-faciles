import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("is accessible and has a title", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/.+/);
  });

  test("contains a login link", async ({ page }) => {
    await page.goto("/");

    const loginLink = page.getByRole("link", { name: /connexion|login|se connecter/i });
    await expect(loginLink).toBeVisible();
  });
});
