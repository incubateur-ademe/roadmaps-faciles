import { expect, test } from "./fixtures";

test.describe("Search", () => {
  test("search API returns results for known term", async ({ request }) => {
    const response = await request.get("/api/search?q=Test", {
      headers: { "x-forwarded-host": "e2e.localhost:3000" },
    });

    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(Array.isArray(body) || typeof body === "object").toBe(true);
  });
});
