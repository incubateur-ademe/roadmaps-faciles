import { expect, test } from "@playwright/test";

test.describe("Board Page", () => {
  // Ce test nécessite un tenant seedé avec au moins un board
  // En CI, le test-seed doit être exécuté avant
  test.skip(({ browserName }) => browserName !== "chromium", "Board tests only run on chromium");

  test("board page is accessible on default tenant", async ({ page }) => {
    // Accède au tenant par défaut via le subdomain
    // En local, utilise la redirection du domaine racine
    const response = await page.goto("/");

    expect(response?.ok()).toBe(true);
  });
});
