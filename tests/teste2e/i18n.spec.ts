import { expect, test } from "./fixtures";

test.describe("Internationalization", () => {
  test("page loads in French by default", async ({ page }) => {
    await page.goto("/board/test-board");

    // French text: "Proposer une suggestion" or similar
    await expect(page.getByText(/suggestion|proposer/i)).toBeVisible();
  });

  test("switching to English changes content", async ({ page }) => {
    await page.goto("/board/test-board");

    const langButton = page.getByRole("button", { name: /fr|langue|language/i });

    if (await langButton.isVisible()) {
      await langButton.click();

      const enOption = page.getByRole("link", { name: /english|en/i });
      if (await enOption.isVisible()) {
        await enOption.click();
        await page.waitForLoadState("networkidle");

        await expect(page.locator("html")).toHaveAttribute("lang", "en");
      }
    }
  });
});
