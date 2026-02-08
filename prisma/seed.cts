import { config } from "@/config";
import { prisma } from "@/lib/db/prisma";
import { setSeedTenant } from "@/lib/seedContext";
import { $Enums } from "@/prisma/client";
import { CreateFakePostsWorkflow } from "@/workflows/CreateFakePostsWorkflow";
import { CreateFakeUsersWorkflow } from "@/workflows/CreateFakeUsersWorkflow";
import { CreateWelcomeEntitiesWorkflow } from "@/workflows/CreateWelcomeEntitiesWorkflow";

async function main() {
  console.log("🌱 Seed en cours...");

  const tenant = await prisma.tenant.create({
    data: {},
  });
  console.log("🌱 Tenant créé : ", tenant.id);
  setSeedTenant(tenant);

  const settings = await prisma.tenantSettings.create({
    data: {
      tenantId: tenant.id,
      name: config.seed.tenantName,
      subdomain: config.seed.tenantSubdomain,
      customDomain: null,
    },
  });
  console.log("🌱 TenantSettings créé : ", settings.name);

  const admin = await prisma.user.create({
    data: {
      name: config.seed.adminName,
      email: config.seed.adminEmail,
      emailVerified: new Date(),
      role: $Enums.UserRole.ADMIN,
      status: $Enums.UserStatus.ACTIVE,
      username: config.seed.adminUsername,
      image: config.seed.adminImage || null,
    },
  });
  console.log("🌱 User créé : ", admin.name);

  await prisma.userOnTenant.create({
    data: {
      userId: admin.id,
      tenantId: tenant.id,
      role: $Enums.UserRole.OWNER,
      status: $Enums.UserStatus.ACTIVE,
    },
  });
  console.log("🌱 UserOnTenant créé : ", admin.name);

  console.log("🌱 Création des entités de bienvenue...");
  await new CreateWelcomeEntitiesWorkflow().run();
  console.log("🌱 Entités de bienvenue créées.");
  console.log("🌱 Création des utilisateurs factices...");
  await new CreateFakeUsersWorkflow().run();
  console.log("🌱 Utilisateurs factices créés.");
  await new CreateFakePostsWorkflow().run();
  console.log("🌱 Posts factices créés.");

  console.log(`🌱 Seed terminé. Admin email: ${admin.email} / password: password`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(
    void (async () => {
      await prisma.$disconnect();
    }),
  );
