import { prisma } from "@/lib/db/prisma";
import { getServerService } from "@/lib/services";
import { $Enums } from "@/prisma/client";
import { CreateFakePostsWorkflow } from "@/workflows/CreateFakePostsWorkflow";
import { CreateFakeUsersWorkflow } from "@/workflows/CreateFakeUsersWorkflow";
import { CreateWelcomeEntitiesWorkflow } from "@/workflows/CreateWelcomeEntitiesWorkflow";

async function main() {
  console.log("🌱 Seed en cours...");

  const tenant = await prisma.tenant.create({
    data: {
      name: "Default Site Name",
      subdomain: "default",
      customDomain: null,
    },
  });
  console.log("🌱 Tenant créé : ", tenant.name);
  const current = await getServerService("current");
  current.tenant = tenant;

  await prisma.tenantSetting.create({
    data: {
      tenantId: tenant.id,
    },
  });
  console.log("🌱 TenantSetting créé : ", tenant.name);

  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      emailVerified: new Date(),
      role: $Enums.UserRole.ADMIN,
      status: $Enums.UserStatus.ACTIVE,
      username: "admin",
    },
  });
  console.log("🌱 User créé : ", user.name);

  await prisma.userOnTenant.create({
    data: {
      userId: user.id,
      tenantId: tenant.id,
      role: $Enums.UserRole.OWNER,
      status: $Enums.UserStatus.ACTIVE,
    },
  });
  console.log("🌱 UserOnTenant créé : ", user.name);

  console.log("🌱 Création des entités de bienvenue...");
  await new CreateWelcomeEntitiesWorkflow().run();
  console.log("🌱 Entités de bienvenue créées.");
  console.log("🌱 Création des utilisateurs factices...");
  await new CreateFakeUsersWorkflow().run();
  console.log("🌱 Utilisateurs factices créés.");
  await new CreateFakePostsWorkflow().run();
  console.log("🌱 Posts factices créés.");

  console.log("🌱 Seed terminé. Admin email: admin@example.com / password: password");
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
