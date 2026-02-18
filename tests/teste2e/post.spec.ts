import { expect, test } from "./fixtures";

test.describe("Post Lifecycle", () => {
  test("submits a new post via the board form", async ({ page }) => {
    await page.goto("/board/test-board");

    await page.getByLabel(/titre/i).fill("E2E New Post");
    await page.getByLabel(/description/i).fill("Created during E2E test");
    await page.getByRole("button", { name: /valider/i }).click();

    // requirePostApproval=true → success alert shown
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("displays post detail page", async ({ page }) => {
    await page.goto("/post/test-post");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Test Post");
    await expect(page.getByText("A test post for E2E tests")).toBeVisible();
  });

  test("opens post in intercepted modal from board", async ({ page }) => {
    await page.goto("/board/test-board");

    await page.getByRole("link", { name: "Test Post" }).first().click();

    await expect(page.getByText("A test post for E2E tests")).toBeVisible();
    await expect(page).toHaveURL(/\/post\/\d+/);
  });

  test("votes on a post with like button", async ({ page }) => {
    await page.goto("/post/test-post");

    const voteButton = page.getByTitle("Vote");
    await expect(voteButton).toBeVisible();

    await voteButton.click();

    // Button should still be visible after optimistic toggle
    await expect(voteButton).toBeVisible();
  });

  test("shows comment input on post detail", async ({ page }) => {
    await page.goto("/post/test-post");

    const commentInput = page.getByLabel(/commentaire|comment/i);
    await expect(commentInput).toBeVisible();
  });

  test("anonymous post shows without author name", async ({ page }) => {
    await page.goto("/post/anonymous-post");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Anonymous Post");
    await expect(page.getByText(/anonyme/i)).toBeVisible();
  });
});
