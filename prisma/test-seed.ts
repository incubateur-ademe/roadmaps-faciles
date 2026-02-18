/**
 * Seed de test minimal — données prévisibles pour les tests E2E.
 *
 * Usage: pnpm run-script prisma/test-seed.ts
 */
import { config } from "@/config";
import { prisma } from "@/lib/db/prisma";
import { $Enums } from "@/prisma/client";

async function main() {
  console.log("🧪 Test seed en cours...");

  // Nettoyage
  await prisma.userOnTenant.deleteMany();
  await prisma.post.deleteMany();
  await prisma.board.deleteMany();
  await prisma.tenantSettings.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  // Tenant
  const tenant = await prisma.tenant.create({ data: {} });
  console.log("🧪 Tenant créé :", tenant.id);

  await prisma.tenantSettings.create({
    data: {
      tenantId: tenant.id,
      name: config.seed.tenantName,
      subdomain: config.seed.tenantSubdomain,
    },
  });

  // User admin
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

  await prisma.userOnTenant.create({
    data: {
      userId: admin.id,
      tenantId: tenant.id,
      role: $Enums.UserRole.OWNER,
      status: $Enums.UserStatus.ACTIVE,
    },
  });

  // Board
  const board = await prisma.board.create({
    data: {
      tenantId: tenant.id,
      name: "Test Board",
      order: 0,
      slug: "test-board",
    },
  });
  console.log("🧪 Board créé :", board.name);

  // Post
  const post = await prisma.post.create({
    data: {
      tenantId: tenant.id,
      boardId: board.id,
      title: "Test Post",
      description: "A test post for E2E tests",
      userId: admin.id,
      approvalStatus: $Enums.PostApprovalStatus.APPROVED,
      slug: "test-post",
    },
  });
  console.log("🧪 Post créé :", post.title);

  console.log("🧪 Test seed terminé.");
}

main()
  .catch(e => {
    console.error("❌ Test seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
