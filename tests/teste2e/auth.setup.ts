import { expect, test as setup } from "@playwright/test";

const AUTH_DIR = "tests/teste2e/.auth";

for (const { name, email } of [
  { name: "admin", email: "test-admin@test.local" },
  { name: "mod", email: "test-mod@test.local" },
  { name: "user", email: "test-user@test.local" },
]) {
  setup(`authenticate ${name}`, async ({ request }) => {
    const response = await request.post("/api/test-auth", {
      data: { email },
    });

    expect(response.ok()).toBeTruthy();

    await request.storageState({ path: `${AUTH_DIR}/${name}.json` });
  });
}
