# E2E Auth Tests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement comprehensive E2E tests for magic link login and auth bridge flows, with Maildev email interception.

**Architecture:** Custom Playwright fixture (`maildev`) wraps the Maildev REST API for email interception. Two new spec files (`auth-magic-link.spec.ts`, `auth-bridge.spec.ts`) cover all auth flows except OAuth. Tests run in existing Playwright projects (`unauthenticated`, `root-auth`).

**Tech Stack:** Playwright, Maildev REST API (`localhost:1080`), NextAuth nodemailer provider, HMAC bridge tokens.

**Key discovery:** Magic link (nodemailer) is **tenant-only** — the root login page uses username (Espace Membre). The signIn callback for nodemailer returns `false` when no tenant context exists (line 250 in `src/lib/next-auth/auth.ts`). All magic link tests must use `E2E_TENANT_URL`.

---

### Task 1: Add Maildev service to CI workflow

**Files:**
- Modify: `.github/workflows/test.yml:84-106` (e2e-tests job services section)

**Step 1: Add maildev service container**

In `.github/workflows/test.yml`, add the `maildev` service alongside `postgres` and `redis` in the `e2e-tests` job:

```yaml
      maildev:
        image: djfarrelly/maildev
        ports:
          - 1025:1025
          - 1080:1080
```

Also add mailer env vars to the `env:` section:

```yaml
      MAILER_SMTP_HOST: localhost
      MAILER_SMTP_PORT: 1025
      MAILER_SMTP_SSL: false
      MAILER_FROM_EMAIL: "Roadmaps Faciles <noreply@test.local>"
```

**Step 2: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "chore(ci): add Maildev service for E2E auth tests"
```

---

### Task 2: Seed OTP user for pre-login blocking test

**Files:**
- Modify: `prisma/test-seed.ts:97-108` (after regular user creation)

**Step 1: Add OTP user to seed**

After the `user` creation block (line 106), add a 4th user with OTP configured. Use `@simplewebauthn/server` or just a raw base32 secret string — the pre-login-check endpoint only checks `otpSecret` is truthy + `otpVerifiedAt` is set:

```typescript
const otpUser = await prisma.user.create({
  data: {
    name: "Test OTP User",
    email: "test-otp@test.local",
    emailVerified: new Date(),
    role: $Enums.UserRole.USER,
    status: $Enums.UserStatus.ACTIVE,
    username: "test-otp",
    otpSecret: "JBSWY3DPEHPK3PXP", // dummy TOTP secret (base32)
    otpVerifiedAt: new Date(),
  },
});
```

Also add membership on the tenant (after existing memberships block, line 133):

```typescript
{
  userId: otpUser.id,
  tenantId: tenant.id,
  role: $Enums.UserRole.USER,
  status: $Enums.UserStatus.ACTIVE,
},
```

Update the console.log on line 108 to include `otpUser.email`.

**Step 2: Commit**

```bash
git add prisma/test-seed.ts
git commit -m "chore(seed): add OTP user for E2E pre-login blocking test"
```

---

### Task 3: Create Maildev Playwright fixture

**Files:**
- Modify: `tests/teste2e/fixtures.ts`

**Step 1: Implement the maildev fixture**

Replace the existing `fixtures.ts` with an extended version that adds the `maildev` fixture via `test.extend`:

```typescript
import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

/** Tenant base URL for E2E tests — used as baseURL in tenant Playwright projects */
export const E2E_TENANT_URL = "http://e2e.localhost:3000";

const MAILDEV_API = process.env.MAILDEV_URL || "http://localhost:1080";

interface MaildevEmail {
  id: string;
  from: Array<{ address: string; name: string }>;
  to: Array<{ address: string; name: string }>;
  subject: string;
  html: string;
  text: string;
}

interface MaildevFixture {
  /** Poll Maildev until an email arrives for the given address (max 15s). */
  getLatestEmail(to: string): Promise<MaildevEmail>;
  /** Extract the magic link (verification URL) from a Maildev email HTML body. */
  extractLink(email: MaildevEmail): string;
  /** Delete all emails in Maildev inbox. */
  clearInbox(): Promise<void>;
}

/**
 * Extended test with tenant-aware helpers and Maildev fixture.
 * All spec files should import { test, expect } from "./fixtures".
 */
export const test = base.extend<{ maildev: MaildevFixture }>({
  maildev: async ({}, use) => {
    const helper: MaildevFixture = {
      async getLatestEmail(to: string): Promise<MaildevEmail> {
        const deadline = Date.now() + 15_000;
        while (Date.now() < deadline) {
          const res = await fetch(`${MAILDEV_API}/api/emails`);
          const emails = (await res.json()) as MaildevEmail[];
          const match = emails
            .reverse() // newest first
            .find(e => e.to.some(r => r.address === to));
          if (match) return match;
          await new Promise(r => setTimeout(r, 500));
        }
        throw new Error(`No email received for ${to} within 15s`);
      },

      extractLink(email: MaildevEmail): string {
        // NextAuth verification link is the primary CTA href in the email
        const match = email.html.match(/href="([^"]*\/api\/auth\/callback\/[^"]*)"/);
        if (!match?.[1]) {
          throw new Error("No magic link found in email HTML");
        }
        // Decode HTML entities (&amp; → &)
        return match[1].replace(/&amp;/g, "&");
      },

      async clearInbox(): Promise<void> {
        await fetch(`${MAILDEV_API}/api/emails`, { method: "DELETE" });
      },
    };

    await use(helper);
  },
});
```

**Step 2: Verify existing tests still pass**

Run: `pnpm test:e2e --project=unauthenticated health.spec.ts`
Expected: PASS — the `maildev` fixture is opt-in (only used when destructured).

**Step 3: Commit**

```bash
git add tests/teste2e/fixtures.ts
git commit -m "feat(e2e): add Maildev Playwright fixture for email interception"
```

---

### Task 4: Update Playwright config to include new spec files

**Files:**
- Modify: `playwright.config.ts:89` (unauthenticated testMatch)
- Modify: `playwright.config.ts:40` (root-auth testMatch)

**Step 1: Add auth-magic-link and auth-bridge to testMatch patterns**

In the `unauthenticated` project (line 89), update the testMatch regex to include both new specs:

```typescript
testMatch: /\b(health|home|auth|auth-magic-link|auth-bridge|routing|api)\.spec\.ts/,
```

In the `root-auth` project (line 40), add `auth-bridge`:

```typescript
testMatch: /\b(root-admin|profile|auth-bridge)\.spec\.ts/,
```

**Why both projects for auth-bridge?** The bridge happy path needs admin auth (root-auth project), while error cases (no auth, invalid token) need unauthenticated. Playwright will match the spec in both projects and run the appropriate `test.describe` blocks. We'll use `test.describe` with descriptive names so the test runner shows which tests belong to which project context.

**Step 2: Commit**

```bash
git add playwright.config.ts
git commit -m "chore(e2e): add auth-magic-link and auth-bridge specs to Playwright projects"
```

---

### Task 5: Implement auth-magic-link.spec.ts

**Files:**
- Create: `tests/teste2e/auth-magic-link.spec.ts`

**Step 1: Write the spec file**

```typescript
import { E2E_TENANT_URL, expect, test } from "./fixtures";

test.describe("Magic Link Authentication", () => {
  test.describe("Happy path", () => {
    test("completes full magic link login flow on tenant", async ({ page, maildev }) => {
      await maildev.clearInbox();

      // Navigate to tenant login
      await page.goto(`${E2E_TENANT_URL}/login`);

      // Fill email and submit
      const emailInput = page.getByRole("textbox", { name: /email/i });
      await expect(emailInput).toBeVisible();
      await emailInput.fill("test-user@test.local");

      const submitButton = page.getByRole("button", { name: /se connecter/i });
      await submitButton.click();

      // Should redirect to verify-request page
      await page.waitForURL("**/login/verify-request");
      await expect(page.locator("main")).toContainText(/email envoyé/i);

      // Fetch magic link from Maildev
      const email = await maildev.getLatestEmail("test-user@test.local");
      expect(email.subject).toBeTruthy();

      const magicLink = maildev.extractLink(email);
      expect(magicLink).toContain("/api/auth/callback/nodemailer");

      // Click the magic link
      await page.goto(magicLink);

      // Should be authenticated and redirected to tenant home
      await page.waitForURL(`${E2E_TENANT_URL}/**`);
      // Verify we're logged in by checking for authenticated UI elements
      await expect(page.locator("body")).not.toContainText(/se connecter/i);
    });
  });

  test.describe("Error cases", () => {
    test("shows error page for invalid callback token", async ({ page }) => {
      // Visit the NextAuth callback with a garbage token
      await page.goto(
        `${E2E_TENANT_URL}/api/auth/callback/nodemailer?token=invalid-garbage-token&email=test-user@test.local`,
      );

      // Should end up on an error page (NextAuth redirects to /error or /login/error)
      await page.waitForURL("**/error**");
      await expect(page.locator("main")).toBeVisible();
    });
  });

  test.describe("Pre-login OTP blocking", () => {
    test("shows OTP step when user has TOTP configured", async ({ page }) => {
      // Navigate to tenant login
      await page.goto(`${E2E_TENANT_URL}/login`);

      // Fill OTP user email and submit
      const emailInput = page.getByRole("textbox", { name: /email/i });
      await emailInput.fill("test-otp@test.local");

      const submitButton = page.getByRole("button", { name: /se connecter/i });
      await submitButton.click();

      // Should show OTP step instead of sending magic link
      await expect(page.getByRole("textbox", { name: /code/i })).toBeVisible({ timeout: 10_000 });
    });
  });
});
```

**Step 2: Run the tests (they will fail — TDD: verify test structure is correct)**

Run: `pnpm test:e2e --project=unauthenticated auth-magic-link.spec.ts`
Expected: Tests attempt to run. Happy path may fail if Maildev isn't running locally — that's OK for now. The OTP test should pass if seed data is correct and dev server is running.

**Step 3: Commit**

```bash
git add tests/teste2e/auth-magic-link.spec.ts
git commit -m "feat(e2e): add magic link authentication tests"
```

---

### Task 6: Implement auth-bridge.spec.ts

**Files:**
- Create: `tests/teste2e/auth-bridge.spec.ts`

**Step 1: Write the spec file**

The spec uses two describe blocks:
- "Authenticated bridge" — runs in `root-auth` project (admin storage state)
- "Unauthenticated bridge errors" — runs in `unauthenticated` project (no storage state)

```typescript
import { E2E_TENANT_URL, expect, test } from "./fixtures";

test.describe("Auth Bridge — Authenticated", () => {
  // These tests need admin session on root domain → run in root-auth project

  test("completes bridge login from root to tenant", async ({ page }) => {
    // Verify we're authenticated on root
    await page.goto("/admin");
    await expect(page.locator("main")).toBeVisible();

    // Navigate to bridge endpoint
    const bridgeUrl = `/api/auth-bridge?redirect=${encodeURIComponent(`${E2E_TENANT_URL}/login`)}`;
    await page.goto(bridgeUrl);

    // BridgeAutoLogin should process the token and redirect to tenant home
    await page.waitForURL(`${E2E_TENANT_URL}/**`, { timeout: 15_000 });

    // Verify we're authenticated on tenant by accessing a protected page
    await page.goto(`${E2E_TENANT_URL}/admin`);
    await expect(page.locator("main")).toBeVisible();
    // Admin user should see tenant admin content
    await expect(page.locator("body")).not.toContainText(/se connecter/i);
  });

  test("redirects to root home when no redirect param is provided", async ({ page }) => {
    await page.goto("/api/auth-bridge");

    // Should redirect to root home /
    await page.waitForURL(/^http:\/\/localhost:3000\/?$/);
  });

  test("blocks open redirect to external domain", async ({ page }) => {
    await page.goto("/api/auth-bridge?redirect=https://evil.example.com/steal");

    // Should redirect to root home / (not to evil.example.com)
    await page.waitForURL(/^http:\/\/localhost:3000\/?$/);
  });
});

test.describe("Auth Bridge — Unauthenticated", () => {
  // These tests need no session → run in unauthenticated project

  test("redirects to root login when not authenticated", async ({ page }) => {
    const bridgeUrl = `/api/auth-bridge?redirect=${encodeURIComponent(`${E2E_TENANT_URL}/login`)}`;
    await page.goto(bridgeUrl);

    // Should redirect to /login on root domain
    await page.waitForURL("**/login");
    expect(page.url()).not.toContain(E2E_TENANT_URL);
  });

  test("shows error for invalid bridge token on tenant login", async ({ page }) => {
    // Visit tenant login with a garbage bridge token
    await page.goto(`${E2E_TENANT_URL}/login?bridge_token=invalid-garbage-token`);

    // BridgeAutoLogin will try to authenticate and fail
    // Then redirect to /login?error=... on the tenant
    await page.waitForURL(`${E2E_TENANT_URL}/login?error=**`, { timeout: 15_000 });
  });
});
```

**Step 2: Run the tests**

Run: `pnpm test:e2e auth-bridge.spec.ts`
Expected: Authenticated tests run in `root-auth` project, unauthenticated in `unauthenticated` project.

**Step 3: Commit**

```bash
git add tests/teste2e/auth-bridge.spec.ts
git commit -m "feat(e2e): add auth bridge E2E tests"
```

---

### Task 7: Run full E2E suite and fix failures

**Step 1: Start Maildev locally**

Run: `docker compose up -d maildev` (or `docker-compose up -d maildev`)

**Step 2: Run full E2E suite**

Run: `pnpm test:e2e`

Expected: All existing tests + new auth tests should pass.

**Step 3: Debug and fix any failures**

Common issues to watch for:
- **Maildev not running** → ensure `docker compose up -d maildev`
- **Magic link URL mismatch** → the link in the email may use `localhost:3000` instead of `e2e.localhost:3000`. Check `extractLink` regex.
- **Bridge redirect timing** → `BridgeAutoLogin` does client-side `window.location.href`. May need longer timeout in `waitForURL`.
- **OTP user not found** → verify seed ran correctly (`pnpm run run-script -- prisma/test-seed.ts`)
- **testMatch overlap** → both `unauthenticated` and `root-auth` may try to run all tests in the auth-bridge spec. Use `test.skip()` or Playwright tags to filter.

**Step 4: Commit fixes**

```bash
git add -A
git commit -m "fix(e2e): address test failures in auth E2E suite"
```

---

### Task 8: Verification & lint

**Step 1: Run lint**

Run: `pnpm lint --fix`

**Step 2: Run full E2E suite one more time**

Run: `pnpm test:e2e`
Expected: All tests pass, no lint errors.

**Step 3: Final commit if needed**

```bash
git add -A
git commit -m "chore(e2e): lint fixes for auth E2E tests"
```
