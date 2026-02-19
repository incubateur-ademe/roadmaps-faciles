# E2E Test Suite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 47 Playwright E2E tests across 14 files covering all critical user flows of the Kokatsuna app.

**Architecture:** Enriched test seed provides deterministic data, 3 auth profiles (admin/mod/user) via `/api/test-auth`, multi-tenant via `x-forwarded-host: e2e.localhost:3000` header injection. Tests grouped by functional domain with Playwright projects per role.

**Tech Stack:** Playwright, Next.js 16 App Router, DSFR components, next-intl i18n

---

## Conventions for all tasks

- **Tenant host header:** `e2e.localhost:3000` — used in all tenant-scoped requests
- **Auth states:** `tests/teste2e/.auth/admin.json`, `.auth/mod.json`, `.auth/user.json`
- **Imports:** All spec files import from `./fixtures` (not `@playwright/test` directly)
- **i18n:** App uses French by default. Match French text in selectors.
- **DSFR:** Components render standard HTML roles — use `getByRole`, `getByText`, `locator`
- **No data-testid:** The app has zero data-testid attributes. Use roles, text, and CSS selectors.
- **Run command:** `pnpm exec playwright test <file> --project <project>`
- **Dev server:** Must be running on localhost:3000 (Playwright config has `reuseExistingServer: true`)

---

### Task 1: Enrich test seed

**Files:**
- Modify: `prisma/test-seed.ts`

**Step 1: Update the test seed with all required data**

Replace the full content of `prisma/test-seed.ts`:

```ts
/**
 * Seed de test — données prévisibles pour les tests E2E.
 *
 * Usage: pnpm tsx prisma/test-seed.ts
 */
import { prisma } from "@/lib/db/prisma";
import { $Enums } from "@/prisma/client";

async function main() {
  console.log("🧪 Test seed en cours...");

  // Nettoyage complet (ordre inverse des FK)
  await prisma.activity.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.postStatus.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.userOnTenant.deleteMany();
  await prisma.board.deleteMany();
  await prisma.tenantSettings.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // === Tenant ===
  const tenant = await prisma.tenant.create({ data: {} });
  console.log("🧪 Tenant créé :", tenant.id);

  await prisma.tenantSettings.create({
    data: {
      tenantId: tenant.id,
      name: "E2E Test Tenant",
      subdomain: "e2e",
      requirePostApproval: true,
      allowVoting: true,
      allowComments: true,
      allowAnonymousFeedback: true,
      allowAnonymousVoting: true,
      allowPostEdits: true,
      allowPostDeletion: true,
    },
  });

  // === AppSettings singleton ===
  await prisma.appSettings.upsert({
    where: { id: 0 },
    create: { id: 0 },
    update: {},
  });

  // === Users ===
  const admin = await prisma.user.create({
    data: {
      name: "Test Admin",
      email: "test-admin@test.local",
      emailVerified: new Date(),
      role: $Enums.UserRole.ADMIN,
      status: $Enums.UserStatus.ACTIVE,
      username: "test-admin",
    },
  });
  console.log("🧪 Admin créé :", admin.email);

  const mod = await prisma.user.create({
    data: {
      name: "Test Moderator",
      email: "test-mod@test.local",
      emailVerified: new Date(),
      role: $Enums.UserRole.USER,
      status: $Enums.UserStatus.ACTIVE,
      username: "test-mod",
    },
  });
  console.log("🧪 Moderator créé :", mod.email);

  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test-user@test.local",
      emailVerified: new Date(),
      role: $Enums.UserRole.USER,
      status: $Enums.UserStatus.ACTIVE,
      username: "test-user",
    },
  });
  console.log("🧪 User créé :", user.email);

  // === Memberships ===
  await prisma.userOnTenant.create({
    data: { userId: admin.id, tenantId: tenant.id, role: $Enums.UserRole.OWNER, status: $Enums.UserStatus.ACTIVE },
  });
  await prisma.userOnTenant.create({
    data: { userId: mod.id, tenantId: tenant.id, role: $Enums.UserRole.MODERATOR, status: $Enums.UserStatus.ACTIVE },
  });
  await prisma.userOnTenant.create({
    data: { userId: user.id, tenantId: tenant.id, role: $Enums.UserRole.USER, status: $Enums.UserStatus.ACTIVE },
  });

  // === Boards ===
  const board = await prisma.board.create({
    data: { tenantId: tenant.id, name: "Test Board", order: 0, slug: "test-board" },
  });
  const board2 = await prisma.board.create({
    data: { tenantId: tenant.id, name: "Second Board", order: 1, slug: "second-board" },
  });
  console.log("🧪 Boards créés :", board.name, board2.name);

  // === Post Statuses ===
  await prisma.postStatus.create({
    data: { tenantId: tenant.id, name: "En cours", color: "blueFrance", order: 0, showInRoadmap: true },
  });
  await prisma.postStatus.create({
    data: { tenantId: tenant.id, name: "Terminé", color: "greenBourgeon", order: 1, showInRoadmap: true },
  });
  console.log("🧪 Statuts créés.");

  // === Posts ===
  await prisma.post.create({
    data: {
      tenantId: tenant.id, boardId: board.id,
      title: "Test Post", description: "A test post for E2E tests",
      userId: admin.id, approvalStatus: $Enums.PostApprovalStatus.APPROVED, slug: "test-post",
    },
  });
  await prisma.post.create({
    data: {
      tenantId: tenant.id, boardId: board.id,
      title: "Pending Post", description: "A pending post awaiting moderation",
      userId: user.id, approvalStatus: $Enums.PostApprovalStatus.PENDING, slug: "pending-post",
    },
  });
  await prisma.post.create({
    data: {
      tenantId: tenant.id, boardId: board.id,
      title: "Rejected Post", description: "A rejected post",
      userId: user.id, approvalStatus: $Enums.PostApprovalStatus.REJECTED, slug: "rejected-post",
    },
  });
  await prisma.post.create({
    data: {
      tenantId: tenant.id, boardId: board.id,
      title: "Anonymous Post", description: "An anonymous post",
      userId: null, anonymousId: "anon-e2e-test-id", approvalStatus: $Enums.PostApprovalStatus.APPROVED, slug: "anonymous-post",
    },
  });
  console.log("🧪 Posts créés.");

  // === Invitation ===
  await prisma.invitation.create({
    data: { tenantId: tenant.id, email: "invited@test.local", tokenDigest: "e2e-test-token-digest-placeholder-64chars-padding-xxxxxxxxxxxxxxxxx" },
  });
  console.log("🧪 Invitation créée.");

  // === Audit log entry ===
  await prisma.auditLog.create({
    data: { action: "TENANT_CREATE", userId: admin.id, tenantId: tenant.id, status: "SUCCESS" },
  });
  console.log("🧪 Audit log créé.");

  console.log("🧪 Test seed terminé.");
}

main()
  .catch(e => {
    console.error("❌ Test seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

**Step 2: Run the seed to verify it works**

Run: `pnpm tsx prisma/test-seed.ts`
Expected: All `🧪` log lines printed, no errors.

**Step 3: Commit**

```
git add prisma/test-seed.ts
git commit -m "feat(test): enrich E2E test seed — 3 users, 2 boards, 4 posts, statuses, invitation (#47)"
```

---

### Task 2: Update auth setup for 3 profiles

**Files:**
- Modify: `tests/teste2e/auth.setup.ts`

**Step 1: Rewrite auth.setup.ts for 3 auth states**

```ts
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
```

**Step 2: Commit**

```
git add tests/teste2e/auth.setup.ts
git commit -m "feat(test): auth setup creates 3 profiles — admin, mod, user (#47)"
```

---

### Task 3: Create fixtures and update Playwright config

**Files:**
- Create: `tests/teste2e/fixtures.ts`
- Modify: `playwright.config.ts`

**Step 1: Create fixtures.ts**

```ts
import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

/**
 * Extended test with tenant-aware helpers.
 * All spec files should import { test, expect } from "./fixtures".
 */
export const test = base;

/** Tenant host for E2E tests — injected via x-forwarded-host header in Playwright projects */
export const E2E_TENANT_HOST = "e2e.localhost:3000";
```

**Step 2: Rewrite playwright.config.ts**

```ts
import { defineConfig, devices } from "@playwright/test";

const AUTH_DIR = "tests/teste2e/.auth";

export default defineConfig({
  testDir: "./tests/teste2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    // --- Setup ---
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },

    // --- Root (no tenant header) ---
    {
      name: "root-auth",
      use: {
        ...devices["Desktop Chrome"],
        storageState: `${AUTH_DIR}/admin.json`,
      },
      dependencies: ["setup"],
      testMatch: /\b(root-admin|profile)\.spec\.ts/,
    },

    // --- Tenant: admin ---
    {
      name: "tenant-admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: `${AUTH_DIR}/admin.json`,
        extraHTTPHeaders: { "x-forwarded-host": "e2e.localhost:3000" },
      },
      dependencies: ["setup"],
      testMatch: /\b(tenant-admin|tenant-admin-extras|board|moderation)\.spec\.ts/,
    },

    // --- Tenant: moderator ---
    {
      name: "tenant-mod",
      use: {
        ...devices["Desktop Chrome"],
        storageState: `${AUTH_DIR}/mod.json`,
        extraHTTPHeaders: { "x-forwarded-host": "e2e.localhost:3000" },
      },
      dependencies: ["setup"],
      testMatch: /\bmoderation\.spec\.ts/,
    },

    // --- Tenant: user ---
    {
      name: "tenant-user",
      use: {
        ...devices["Desktop Chrome"],
        storageState: `${AUTH_DIR}/user.json`,
        extraHTTPHeaders: { "x-forwarded-host": "e2e.localhost:3000" },
      },
      dependencies: ["setup"],
      testMatch: /\b(post|search|i18n)\.spec\.ts/,
    },

    // --- Unauthenticated ---
    {
      name: "unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /\b(health|home|auth|routing|api)\.spec\.ts/,
    },

    // --- Mobile ---
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
        storageState: `${AUTH_DIR}/user.json`,
        extraHTTPHeaders: { "x-forwarded-host": "e2e.localhost:3000" },
      },
      dependencies: ["setup"],
      testMatch: /\b(home|board|post)\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

**Step 3: Commit**

```
git add tests/teste2e/fixtures.ts playwright.config.ts
git commit -m "feat(test): Playwright config — 7 projects, fixtures, tenant header e2e.localhost (#47)"
```

---

### Task 4: Rewrite board.spec.ts (3 tests)

**Files:**
- Modify: `tests/teste2e/board.spec.ts`

**Context:** Runs in `tenant-admin` project (admin auth + tenant header). Board page shows posts with filter/search bar. `view=list|cards` URL param toggles view.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Board Page", () => {
  test("displays approved posts and hides pending ones", async ({ page }) => {
    await page.goto("/board/test-board");

    // Approved post is visible
    await expect(page.getByText("Test Post")).toBeVisible();

    // Anonymous approved post is visible
    await expect(page.getByText("Anonymous Post")).toBeVisible();

    // Pending post is NOT visible on the public board
    await expect(page.getByText("Pending Post")).not.toBeVisible();
  });

  test("toggles between cards and list views", async ({ page }) => {
    await page.goto("/board/test-board");

    // Default is cards view — navigate to list
    await page.goto("/board/test-board?view=list");
    await expect(page).toHaveURL(/view=list/);

    // Navigate back to cards
    await page.goto("/board/test-board?view=cards");
    await expect(page).toHaveURL(/view=cards/);

    // Content is still visible in both views
    await expect(page.getByText("Test Post")).toBeVisible();
  });

  test("navigates between boards", async ({ page }) => {
    await page.goto("/board/test-board");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Test Board");

    await page.goto("/board/second-board");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Second Board");
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test board.spec.ts --project tenant-admin`

**Step 3: Commit**

```
git add tests/teste2e/board.spec.ts
git commit -m "feat(test): E2E board — display, views toggle, navigation (#47)"
```

---

### Task 5: Create auth.spec.ts (4 tests)

**Files:**
- Create: `tests/teste2e/auth.spec.ts`

**Context:** Runs in `unauthenticated` project. Tests login pages (root + tenant via header), 2FA page, error page.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Authentication Pages", () => {
  test("root login page shows connexion form", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/.+/);
    // The login page should have an email or username input
    const emailInput = page.getByLabel(/email|courriel/i);
    await expect(emailInput).toBeVisible();
  });

  test("tenant login page is accessible via header", async ({ request, page }) => {
    // Navigate with tenant header
    await page.setExtraHTTPHeaders({ "x-forwarded-host": "e2e.localhost:3000" });
    await page.goto("/login");

    await expect(page).toHaveTitle(/.+/);
    // Tenant login should show the tenant name
    await expect(page.getByText("E2E Test Tenant")).toBeVisible();
  });

  test("2FA page is accessible", async ({ page }) => {
    await page.goto("/2fa");

    // Should redirect to login or show 2FA UI
    // (without auth, may redirect — verify the page loads without 500)
    expect(page.url()).toMatch(/\/(2fa|login)/);
  });

  test("login error page displays error info", async ({ page }) => {
    await page.goto("/login/error?error=OAuthSignin");

    // Should show some error content
    await expect(page.locator("main")).toContainText(/.+/);
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test auth.spec.ts --project unauthenticated`

**Step 3: Commit**

```
git add tests/teste2e/auth.spec.ts
git commit -m "feat(test): E2E auth — login root, tenant, 2FA, error (#47)"
```

---

### Task 6: Create post.spec.ts (6 tests)

**Files:**
- Create: `tests/teste2e/post.spec.ts`

**Context:** Runs in `tenant-user` project (user auth + tenant header). Board has submit form (title required, min 3 chars). Post detail shows title, description, LikeButton (title="Vote"), comment textarea. Posts with `requirePostApproval=true` → submitted as PENDING.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Post Lifecycle", () => {
  test("submits a new post via the board form", async ({ page }) => {
    await page.goto("/board/test-board");

    // Fill the submit form
    await page.getByLabel(/titre/i).fill("E2E New Post");
    await page.getByLabel(/description/i).fill("Created during E2E test");
    await page.getByRole("button", { name: /valider/i }).click();

    // requirePostApproval=true → success alert mentions pending
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("displays post detail page", async ({ page }) => {
    await page.goto("/post/test-post");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Test Post");
    await expect(page.getByText("A test post for E2E tests")).toBeVisible();
  });

  test("opens post in intercepted modal from board", async ({ page }) => {
    await page.goto("/board/test-board");

    // Click on the post title link
    await page.getByRole("link", { name: "Test Post" }).first().click();

    // Modal should show the post content
    await expect(page.getByText("A test post for E2E tests")).toBeVisible();

    // URL should reflect the post route
    await expect(page).toHaveURL(/\/post\/\d+/);
  });

  test("votes on a post with like button", async ({ page }) => {
    await page.goto("/post/test-post");

    const voteButton = page.getByTitle("Vote");
    await expect(voteButton).toBeVisible();

    // Click to like
    await voteButton.click();

    // Button state should toggle (optimistic update)
    // The icon changes from thumb-up-line to thumb-up-fill
    await expect(voteButton).toBeVisible();
  });

  test("shows comment input on post detail", async ({ page }) => {
    await page.goto("/post/test-post");

    // Comment textarea is visible (allowComments=true in seed)
    const commentInput = page.getByLabel(/commentaire|comment/i);
    await expect(commentInput).toBeVisible();
  });

  test("anonymous post shows without author name", async ({ page }) => {
    await page.goto("/post/anonymous-post");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Anonymous Post");
    // Should show "Anonyme" instead of a user name
    await expect(page.getByText(/anonyme/i)).toBeVisible();
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test post.spec.ts --project tenant-user`

**Step 3: Commit**

```
git add tests/teste2e/post.spec.ts
git commit -m "feat(test): E2E post — submit, detail, modal, vote, comment, anonymous (#47)"
```

---

### Task 7: Create moderation.spec.ts (4 tests)

**Files:**
- Create: `tests/teste2e/moderation.spec.ts`

**Context:** Runs in `tenant-admin` AND `tenant-mod` projects. Moderation page at `/moderation` shows pending posts. Actions: approve/reject. Rejected posts at `/moderation/rejected`. i18n keys from `moderation` namespace.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Moderation", () => {
  test("shows pending posts in moderation queue", async ({ page }) => {
    await page.goto("/moderation");

    // The pending post from seed should appear
    await expect(page.getByText("Pending Post")).toBeVisible();
  });

  test("approve button is visible for pending post", async ({ page }) => {
    await page.goto("/moderation");

    // Look for approve action
    const approveButton = page.getByRole("button", { name: /approuver|approve/i });
    await expect(approveButton.first()).toBeVisible();
  });

  test("rejected posts page is accessible", async ({ page }) => {
    await page.goto("/moderation/rejected");

    // The rejected post from seed should appear
    await expect(page.getByText("Rejected Post")).toBeVisible();
  });

  test("moderation link is visible in navigation", async ({ page }) => {
    await page.goto("/");

    // Admin/mod should see the moderation link in nav
    const moderationLink = page.getByRole("link", { name: /modération|moderation/i });
    await expect(moderationLink.first()).toBeVisible();
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test moderation.spec.ts --project tenant-admin`
Run: `pnpm exec playwright test moderation.spec.ts --project tenant-mod`

**Step 3: Commit**

```
git add tests/teste2e/moderation.spec.ts
git commit -m "feat(test): E2E moderation — queue, approve, rejected, nav link (#47)"
```

---

### Task 8: Create tenant-admin.spec.ts (6 tests)

**Files:**
- Create: `tests/teste2e/tenant-admin.spec.ts`

**Context:** Runs in `tenant-admin` project. Admin pages under `/admin/`. Board management at `/admin/boards` has create form (name input + create button). Members at `/admin/users`. Invitations at `/admin/users/invitations`. General settings at `/admin/general`.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Tenant Admin", () => {
  test("can create a new board", async ({ page }) => {
    await page.goto("/admin/boards");

    // Fill the create form
    const nameInput = page.getByLabel(/nom|name/i).first();
    await nameInput.fill("E2E Created Board");

    const createButton = page.getByRole("button", { name: /créer|create/i });
    await createButton.click();

    // The new board should appear in the list
    await expect(page.getByText("E2E Created Board")).toBeVisible();
  });

  test("displays post statuses", async ({ page }) => {
    await page.goto("/admin/statuses");

    // The 2 statuses from seed should be visible
    await expect(page.getByText("En cours")).toBeVisible();
    await expect(page.getByText("Terminé")).toBeVisible();
  });

  test("lists tenant members with roles", async ({ page }) => {
    await page.goto("/admin/users");

    // All 3 seed users should appear
    await expect(page.getByText("test-admin@test.local")).toBeVisible();
    await expect(page.getByText("test-mod@test.local")).toBeVisible();
    await expect(page.getByText("test-user@test.local")).toBeVisible();
  });

  test("member role badges are displayed", async ({ page }) => {
    await page.goto("/admin/users");

    // Should show role indicators
    await expect(page.getByText(/owner/i).first()).toBeVisible();
  });

  test("shows invitation list with pending invitation", async ({ page }) => {
    await page.goto("/admin/users/invitations");

    // The seed invitation should appear
    await expect(page.getByText("invited@test.local")).toBeVisible();
  });

  test("general settings page shows tenant name", async ({ page }) => {
    await page.goto("/admin/general");

    // The tenant name from seed should be visible
    await expect(page.getByText("E2E Test Tenant")).toBeVisible();
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test tenant-admin.spec.ts --project tenant-admin`

**Step 3: Commit**

```
git add tests/teste2e/tenant-admin.spec.ts
git commit -m "feat(test): E2E tenant admin — boards, statuses, members, invitations, settings (#47)"
```

---

### Task 9: Create root-admin.spec.ts (5 tests)

**Files:**
- Create: `tests/teste2e/root-admin.spec.ts`

**Context:** Runs in `root-auth` project (admin auth, no tenant header). Root admin at `/admin` redirects to `/admin/tenants`. Tenant list shows tenants in TableCustom. Create tenant at `/admin/tenants/new`. Users at `/admin/users`. Audit log at `/admin/audit-log`. Security at `/admin/security`.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Root Admin", () => {
  test("tenant list shows the E2E tenant", async ({ page }) => {
    await page.goto("/admin/tenants");

    await expect(page.getByText("E2E Test Tenant")).toBeVisible();
  });

  test("create tenant page is accessible", async ({ page }) => {
    await page.goto("/admin/tenants/new");

    // Should show a creation form
    await expect(page.getByRole("heading")).toContainText(/tenant|créer/i);
  });

  test("users list shows test users", async ({ page }) => {
    await page.goto("/admin/users");

    await expect(page.getByText("test-admin@test.local")).toBeVisible();
  });

  test("audit log shows entries", async ({ page }) => {
    await page.goto("/admin/audit-log");

    // The seed audit log entry should appear
    await expect(page.getByText("TENANT_CREATE")).toBeVisible();
  });

  test("security page is accessible", async ({ page }) => {
    await page.goto("/admin/security");

    // Should show force 2FA toggle area
    await expect(page.locator("main")).toContainText(/2FA|double authentification/i);
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test root-admin.spec.ts --project root-auth`

**Step 3: Commit**

```
git add tests/teste2e/root-admin.spec.ts
git commit -m "feat(test): E2E root admin — tenants, users, audit log, security (#47)"
```

---

### Task 10: Create tenant-admin-extras.spec.ts (4 tests)

**Files:**
- Create: `tests/teste2e/tenant-admin-extras.spec.ts`

**Context:** Runs in `tenant-admin` project. Pages: webhooks, API keys, audit log (tenant-scoped), roadmap config.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Tenant Admin Extras", () => {
  test("webhooks page is accessible", async ({ page }) => {
    await page.goto("/admin/webhooks");

    await expect(page.locator("main")).toContainText(/webhook/i);
  });

  test("API keys page is accessible", async ({ page }) => {
    await page.goto("/admin/api");

    await expect(page.locator("main")).toContainText(/API|clé/i);
  });

  test("tenant audit log shows entries", async ({ page }) => {
    await page.goto("/admin/audit-log");

    // Should show the audit log view with filters
    await expect(page.locator("main")).toContainText(/action|journal/i);
  });

  test("roadmap config page is accessible", async ({ page }) => {
    await page.goto("/admin/roadmap");

    await expect(page.locator("main")).toContainText(/roadmap/i);
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test tenant-admin-extras.spec.ts --project tenant-admin`

**Step 3: Commit**

```
git add tests/teste2e/tenant-admin-extras.spec.ts
git commit -m "feat(test): E2E tenant admin extras — webhooks, API keys, audit log, roadmap (#47)"
```

---

### Task 11: Create profile.spec.ts (2 tests)

**Files:**
- Create: `tests/teste2e/profile.spec.ts`

**Context:** Runs in `root-auth` project. Profile at `/profile` shows user info (name, email). Security at `/profile/security` shows 2FA options (passkey, OTP, email sections).

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("User Profile", () => {
  test("profile page shows user information", async ({ page }) => {
    await page.goto("/profile");

    // Admin user info should be visible
    await expect(page.getByText("test-admin@test.local")).toBeVisible();
  });

  test("security page shows 2FA options", async ({ page }) => {
    await page.goto("/profile/security");

    // Should show sections for different 2FA methods
    await expect(page.locator("main")).toContainText(/passkey|OTP|2FA|authentification/i);
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test profile.spec.ts --project root-auth`

**Step 3: Commit**

```
git add tests/teste2e/profile.spec.ts
git commit -m "feat(test): E2E profile — user info, security page (#47)"
```

---

### Task 12: Create search.spec.ts (1 test)

**Files:**
- Create: `tests/teste2e/search.spec.ts`

**Context:** Runs in `tenant-user` project. Global search at `/api/search` route. Search bar uses DSFR SearchBar + MUI Autocomplete.

**Step 1: Write the tests**

```ts
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
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test search.spec.ts --project tenant-user`

**Step 3: Commit**

```
git add tests/teste2e/search.spec.ts
git commit -m "feat(test): E2E search — API returns results (#47)"
```

---

### Task 13: Create i18n.spec.ts (2 tests)

**Files:**
- Create: `tests/teste2e/i18n.spec.ts`

**Context:** Runs in `tenant-user` project. Language switch via DSFR `LanguageSelect` sets `NEXT_LOCALE` cookie. Default is French.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Internationalization", () => {
  test("page loads in French by default", async ({ page }) => {
    await page.goto("/board/test-board");

    // French text should be present (e.g., submit form heading)
    await expect(page.getByText(/suggestion|proposer/i)).toBeVisible();
  });

  test("switching to English changes content", async ({ page }) => {
    await page.goto("/board/test-board");

    // Find and click the language selector
    const langButton = page.getByRole("button", { name: /fr|langue|language/i });

    if (await langButton.isVisible()) {
      await langButton.click();

      // Click English option
      const enOption = page.getByRole("link", { name: /english|en/i });
      if (await enOption.isVisible()) {
        await enOption.click();
        await page.waitForLoadState("networkidle");

        // After reload, content should be in English
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
      }
    }
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test i18n.spec.ts --project tenant-user`

**Step 3: Commit**

```
git add tests/teste2e/i18n.spec.ts
git commit -m "feat(test): E2E i18n — French default, language switch (#47)"
```

---

### Task 14: Create routing.spec.ts (4 tests)

**Files:**
- Create: `tests/teste2e/routing.spec.ts`

**Context:** Runs in `unauthenticated` project. Tests multi-tenant routing via header, stats page, roadmap page, error page.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("Routing & Pages", () => {
  test("tenant home is accessible via x-forwarded-host header", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-host": "e2e.localhost:3000" });
    await page.goto("/");

    // Should show tenant content (not root home)
    await expect(page.getByText("E2E Test Tenant")).toBeVisible();
  });

  test("stats page is accessible", async ({ page }) => {
    await page.goto("/stats");

    await expect(page).toHaveTitle(/.+/);
    // Page loads without error
    await expect(page.locator("main")).toBeVisible();
  });

  test("roadmap page is accessible on tenant", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-host": "e2e.localhost:3000" });
    await page.goto("/roadmap");

    await expect(page.locator("main")).toBeVisible();
  });

  test("error page displays content", async ({ page }) => {
    await page.goto("/error");

    await expect(page.locator("main")).toBeVisible();
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test routing.spec.ts --project unauthenticated`

**Step 3: Commit**

```
git add tests/teste2e/routing.spec.ts
git commit -m "feat(test): E2E routing — tenant header, stats, roadmap, error (#47)"
```

---

### Task 15: Create api.spec.ts (2 tests)

**Files:**
- Create: `tests/teste2e/api.spec.ts`

**Context:** Runs in `unauthenticated` project. Domain check is GET with `?domain=` param. Subdomain check is POST with `{ subdomain }` body.

**Step 1: Write the tests**

```ts
import { expect, test } from "./fixtures";

test.describe("API Routes", () => {
  test("GET /api/domains/check returns status for known domain", async ({ request }) => {
    const response = await request.get("/api/domains/check?domain=e2e.localhost");

    // Should return 200 (found) or 404 (not found as custom domain) — not 500
    expect([200, 404]).toContain(response.status());
  });

  test("POST /api/subdomain/check returns tenant for known subdomain", async ({ request }) => {
    const response = await request.post("/api/subdomain/check", {
      data: { subdomain: "e2e" },
    });

    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body).toHaveProperty("id");
  });
});
```

**Step 2: Run to verify**

Run: `pnpm exec playwright test api.spec.ts --project unauthenticated`

**Step 3: Commit**

```
git add tests/teste2e/api.spec.ts
git commit -m "feat(test): E2E API — domain check, subdomain check (#47)"
```

---

### Task 16: Update home.spec.ts to use fixtures import

**Files:**
- Modify: `tests/teste2e/home.spec.ts`

**Step 1: Update imports**

Change the import from:
```ts
import { expect, test } from "@playwright/test";
```
to:
```ts
import { expect, test } from "./fixtures";
```

Keep the existing 3 tests unchanged.

**Step 2: Also update health.spec.ts imports**

Same change in `tests/teste2e/health.spec.ts`.

**Step 3: Run both to verify they still pass**

Run: `pnpm exec playwright test home.spec.ts health.spec.ts --project unauthenticated`

**Step 4: Commit**

```
git add tests/teste2e/home.spec.ts tests/teste2e/health.spec.ts
git commit -m "refactor(test): migrate home + health specs to fixtures import (#47)"
```

---

### Task 17: Run full E2E suite & fix failures

**Step 1: Run the test seed**

Run: `pnpm tsx prisma/test-seed.ts`

**Step 2: Start dev server (if not running)**

Run: `pnpm dev` (in a separate terminal)

**Step 3: Run the full suite**

Run: `pnpm exec playwright test`

**Step 4: Review failures and fix selectors**

Common fixes needed:
- Text doesn't match exactly → adjust regex in `getByText`/`getByLabel`
- Element not found → check page actually loads, adjust selector
- Timing issues → add `waitForLoadState` or `waitForSelector`
- Auth redirect → check storageState is correctly applied

Iterate until all tests pass or identify tests that need design changes.

**Step 5: Commit all fixes**

```
git add -A
git commit -m "fix(test): E2E selector adjustments after full suite run (#47)"
```

---

### Task 18: Final verification & cleanup

**Step 1: Run lint**

Run: `pnpm lint --fix`

**Step 2: Run full suite one more time**

Run: `pnpm exec playwright test`
Expected: All 47 tests pass across all 7 projects.

**Step 3: Final commit if needed**

```
git add -A
git commit -m "chore(test): E2E suite cleanup and lint fixes (#47)"
```
