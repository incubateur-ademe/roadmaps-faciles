import { expect, test as setup } from "@playwright/test";
import { writeFileSync } from "node:fs";

const AUTH_DIR = "tests/teste2e/.auth";
const ROOT_URL = "http://localhost:3000";

for (const { name, email } of [
  { name: "admin", email: "test-admin@test.local" },
  { name: "mod", email: "test-mod@test.local" },
  { name: "user", email: "test-user@test.local" },
]) {
  setup(`authenticate ${name}`, async ({ request }) => {
    // Authenticate on root domain (localhost)
    const response = await request.post(`${ROOT_URL}/api/test-auth`, {
      data: { email },
    });
    expect(response.ok()).toBeTruthy();

    // Get storage state with cookies for localhost
    const state = await request.storageState();

    // Duplicate cookies for e2e.localhost so tenant pages get auth cookies
    // This avoids requiring e2e.localhost DNS resolution for the API context
    const tenantCookies = state.cookies
      .filter(c => c.domain === "localhost")
      .map(c => ({ ...c, domain: "e2e.localhost" }));
    state.cookies.push(...tenantCookies);

    // Save storage state with both domain cookies
    writeFileSync(`${AUTH_DIR}/${name}.json`, JSON.stringify(state));
  });
}
