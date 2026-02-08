"use server";

import { revalidatePath } from "next/cache";

import { postStatusRepo } from "@/lib/repo";
import { type PostStatus } from "@/prisma/client";
import { type PostStatusColor } from "@/prisma/enums";
import { CreatePostStatus } from "@/useCases/post_statuses/CreatePostStatus";
import { DeletePostStatus } from "@/useCases/post_statuses/DeletePostStatus";
import { ReorderPostStatuses } from "@/useCases/post_statuses/ReorderPostStatuses";
import { UpdatePostStatus } from "@/useCases/post_statuses/UpdatePostStatus";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

export const createPostStatus = async (data: {
  color: PostStatusColor;
  name: string;
  showInRoadmap: boolean;
}): Promise<ServerActionResponse<PostStatus>> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

  try {
    const useCase = new CreatePostStatus(postStatusRepo);
    const status = await useCase.execute({ tenantId: tenant.id, ...data });
    revalidatePath("/admin/statuses");
    return { ok: true, data: status };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const updatePostStatus = async (data: {
  color: PostStatusColor;
  id: number;
  name: string;
  showInRoadmap: boolean;
}): Promise<ServerActionResponse<PostStatus>> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  try {
    const useCase = new UpdatePostStatus(postStatusRepo);
    const status = await useCase.execute(data);
    revalidatePath("/admin/statuses");
    return { ok: true, data: status };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const deletePostStatus = async (data: { id: number }): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  try {
    const useCase = new DeletePostStatus(postStatusRepo);
    await useCase.execute(data);
    revalidatePath("/admin/statuses");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const reorderPostStatuses = async (data: {
  items: Array<{ id: number; order: number }>;
}): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  try {
    const useCase = new ReorderPostStatuses(postStatusRepo);
    await useCase.execute(data);
    revalidatePath("/admin/statuses");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
