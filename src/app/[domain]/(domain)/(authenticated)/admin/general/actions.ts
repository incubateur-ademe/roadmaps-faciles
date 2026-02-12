"use server";

import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import z from "zod";

import { prisma } from "@/lib/db/prisma";
import { type DNSVerificationResult, verifyDNS } from "@/lib/domain-provider/dns";
import { boardRepo, postStatusRepo, tenantRepo, tenantSettingsRepo, userOnTenantRepo } from "@/lib/repo";
import { DeleteTenant } from "@/useCases/tenant/DeleteTenant";
import { SaveTenantWithSettings, SaveTenantWithSettingsInput } from "@/useCases/tenant/SaveTenantWithSettings";
import { UpdateTenantDomain, UpdateTenantDomainInput } from "@/useCases/tenant/UpdateTenantDomain";
import { assertTenantAdmin, assertTenantOwner } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";
import { CreateWelcomeEntitiesWorkflow } from "@/workflows/CreateWelcomeEntitiesWorkflow";

export const saveTenantSettings = async (data: unknown): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  const validated = SaveTenantWithSettingsInput.safeParse(data);
  if (!validated.success) {
    return { ok: false, error: z.prettifyError(validated.error) };
  }

  try {
    const useCase = new SaveTenantWithSettings(tenantSettingsRepo);
    await useCase.execute(validated.data);
    revalidatePath("/admin/general");
    return { ok: true };
  } catch (error) {
    console.error("Error saving tenant settings", error);
    return { ok: false, error: (error as Error).message };
  }
};

export const deleteTenant = async (): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantOwner(domain);
  const tenant = await getTenantFromDomain(domain);

  try {
    const useCase = new DeleteTenant(tenantRepo, userOnTenantRepo);
    await useCase.execute({ tenantId: tenant.id, userId: session.user.uuid });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const updateTenantDomain = async (data: unknown): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantOwner(domain);

  const validated = UpdateTenantDomainInput.safeParse(data);
  if (!validated.success) {
    return { ok: false, error: z.prettifyError(validated.error) };
  }

  try {
    const useCase = new UpdateTenantDomain(tenantSettingsRepo);
    await useCase.execute(validated.data);
    revalidatePath("/admin/general");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const seedDefaultData = async (): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

  const boards = await boardRepo.findAllForTenant(tenant.id);
  const statuses = await postStatusRepo.findAllForTenant(tenant.id);
  const t = await getTranslations("serverErrors");

  if (boards.length > 0 || statuses.length > 0) {
    return { ok: false, error: t("dataAlreadyExists") };
  }

  const owner = await prisma.userOnTenant.findFirst({
    where: { tenantId: tenant.id, status: "ACTIVE", role: "OWNER" },
  });
  if (!owner) {
    return {
      ok: false,
      error: t("noActiveOwnerForSeed"),
    };
  }

  try {
    const workflow = new CreateWelcomeEntitiesWorkflow(tenant.id);
    await workflow.run();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const purgeTenantData = async (): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantOwner(domain);
  const tenant = await getTenantFromDomain(domain);

  try {
    const boardIds = (await boardRepo.findAllForTenant(tenant.id)).map(b => b.id);

    await prisma.$transaction([
      // Pins (no tenantId — delete via boardId)
      prisma.pin.deleteMany({ where: { boardId: { in: boardIds } } }),
      // Entities with tenantId
      prisma.follow.deleteMany({ where: { tenantId: tenant.id } }),
      prisma.like.deleteMany({ where: { tenantId: tenant.id } }),
      prisma.comment.deleteMany({ where: { tenantId: tenant.id } }),
      prisma.postStatusChange.deleteMany({ where: { tenantId: tenant.id } }),
      prisma.post.deleteMany({ where: { tenantId: tenant.id } }),
      prisma.postStatus.deleteMany({ where: { tenantId: tenant.id } }),
      // Reset rootBoardId before deleting boards
      prisma.tenantSettings.update({ where: { tenantId: tenant.id }, data: { rootBoardId: null } }),
      prisma.board.deleteMany({ where: { tenantId: tenant.id } }),
    ]);

    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const checkDNS = async (customDomain: string): Promise<ServerActionResponse<DNSVerificationResult>> => {
  const domain = await getDomainFromHost();
  await assertTenantOwner(domain);

  const t = await getTranslations("serverErrors");

  if (!customDomain) {
    return { ok: false, error: t("noCustomDomain") };
  }

  const result = await verifyDNS(customDomain);
  return { ok: true, data: result };
};
