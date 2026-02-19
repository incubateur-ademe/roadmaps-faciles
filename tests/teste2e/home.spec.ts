import { expect, test } from "./fixtures";

test.describe("Home Page", () => {
  test("is accessible and has a title", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/.+/);
  });

  test("contains a call-to-action link", async ({ page }) => {
    await page.goto("/");

    const ctaLink = page.getByRole("link", { name: /commencer/i });
    await expect(ctaLink).toBeVisible();
  });

  test("has a DSFR footer", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
});
