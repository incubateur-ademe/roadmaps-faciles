import { expect, test } from "./fixtures";

test.describe("Moderation", () => {
  test("shows pending posts in moderation queue", async ({ page }) => {
    await page.goto("/moderation");

    await expect(page.getByText("Pending Post")).toBeVisible();
  });

  test("approve button is visible for pending post", async ({ page }) => {
    await page.goto("/moderation");

    const approveButton = page.getByRole("button", { name: /approuver|approve/i });
    await expect(approveButton.first()).toBeVisible();
  });

  test("rejected posts page is accessible", async ({ page }) => {
    await page.goto("/moderation/rejected");

    await expect(page.getByText("Rejected Post")).toBeVisible();
  });

  test("moderation link is visible in navigation", async ({ page }) => {
    await page.goto("/");

    const moderationLink = page.getByRole("link", { name: /modération|moderation/i });
    await expect(moderationLink.first()).toBeVisible();
  });
});
