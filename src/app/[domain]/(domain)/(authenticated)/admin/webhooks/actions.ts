"use server";

import { revalidatePath } from "next/cache";

import { webhookRepo } from "@/lib/repo";
import { type Webhook } from "@/prisma/client";
import { CreateWebhook } from "@/useCases/webhooks/CreateWebhook";
import { DeleteWebhook } from "@/useCases/webhooks/DeleteWebhook";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

export const createWebhook = async (data: { event: string; url: string }): Promise<ServerActionResponse<Webhook>> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

  try {
    const useCase = new CreateWebhook(webhookRepo);
    const webhook = await useCase.execute({ tenantId: tenant.id, ...data } as Parameters<typeof useCase.execute>[0]);
    revalidatePath("/admin/webhooks");
    return { ok: true, data: webhook };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const deleteWebhook = async (data: { id: number }): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  try {
    const useCase = new DeleteWebhook(webhookRepo);
    await useCase.execute(data);
    revalidatePath("/admin/webhooks");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
