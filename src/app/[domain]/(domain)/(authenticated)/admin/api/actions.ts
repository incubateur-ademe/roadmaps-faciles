"use server";

import { revalidatePath } from "next/cache";
import crypto from "node:crypto";

import { apiKeyRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { type ApiKey } from "@/prisma/client";
import { CreateApiKey } from "@/useCases/api_keys/CreateApiKey";
import { DeleteApiKey } from "@/useCases/api_keys/DeleteApiKey";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const createApiKey = async (): Promise<ServerActionResponse<{ apiKey: ApiKey; token: string }>> => {
  const session = await assertTenantAdmin();
  const { tenant } = await getServerService("current");

  try {
    const randomBytes = crypto.randomBytes(32);
    const token = randomBytes.toString("hex");
    const commonTokenPrefix = token.slice(0, 8);
    const randomTokenPrefix = token.slice(8, 16);
    const tokenDigest = crypto.createHash("sha256").update(token).digest("hex");

    const useCase = new CreateApiKey(apiKeyRepo);
    const apiKey = await useCase.execute({
      tenantId: tenant.id,
      userId: session.user.uuid,
      commonTokenPrefix,
      randomTokenPrefix,
      tokenDigest,
    });

    revalidatePath("/admin/api");
    return { ok: true, data: { apiKey, token } };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const deleteApiKey = async (data: { id: number }): Promise<ServerActionResponse> => {
  await assertTenantAdmin();

  try {
    const useCase = new DeleteApiKey(apiKeyRepo);
    await useCase.execute({ apiKeyId: data.id });
    revalidatePath("/admin/api");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
