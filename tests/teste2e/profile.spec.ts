import { expect, test } from "./fixtures";

test.describe("User Profile", () => {
  test("profile page shows user information", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.getByText("test-admin@test.local")).toBeVisible();
  });

  test("security page shows 2FA options", async ({ page }) => {
    await page.goto("/profile/security");

    await expect(page.locator("main")).toContainText(/passkey|OTP|2FA|authentification/i);
  });
});
