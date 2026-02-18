import { expect, test } from "@playwright/test";

test.describe("Board Page (authenticated)", () => {
  test("dashboard is accessible after auth", async ({ page }) => {
    await page.goto("/");

    // Authenticated user should see something other than the login page
    await expect(page.getByRole("link", { name: /connexion|login|se connecter/i })).not.toBeVisible();
  });
});
