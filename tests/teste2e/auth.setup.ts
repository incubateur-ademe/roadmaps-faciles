import { expect, test as setup } from "@playwright/test";

const authFile = "tests/teste2e/.auth/user.json";

setup("authenticate test user", async ({ request }) => {
  const response = await request.post("/api/test-auth", {
    data: { email: "test-admin@test.local" },
  });

  expect(response.ok()).toBeTruthy();

  await request.storageState({ path: authFile });
});
