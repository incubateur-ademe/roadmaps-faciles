"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";
import { postRepo } from "@/lib/repo";
import { UserRole } from "@/prisma/enums";
import { UpdatePostContent, UpdatePostContentInput } from "@/useCases/posts/UpdatePostContent";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

export const updatePost = async (data: unknown): Promise<ServerActionResponse> => {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Non authentifié." };
  }

  const validated = UpdatePostContentInput.safeParse(data);
  if (!validated.success) {
    return { ok: false, error: z.prettifyError(validated.error) };
  }

  const domain = await getDomainFromHost();
  const tenant = await getTenantFromDomain(domain);

  const [post, settings, membership] = await Promise.all([
    prisma.post.findUnique({ where: { id: validated.data.postId }, select: { userId: true, tenantId: true } }),
    prisma.tenantSettings.findUnique({ where: { tenantId: tenant.id }, select: { allowPostEdits: true } }),
    prisma.userOnTenant.findUnique({
      where: { userId_tenantId: { userId: session.user.uuid, tenantId: tenant.id } },
      select: { role: true },
    }),
  ]);

  if (!post || post.tenantId !== tenant.id) {
    return { ok: false, error: "Post introuvable." };
  }

  const isAdmin =
    session.user.isSuperAdmin ||
    (membership &&
      (membership.role === UserRole.ADMIN ||
        membership.role === UserRole.OWNER ||
        membership.role === UserRole.MODERATOR));
  const isAuthor = post.userId === session.user.uuid;

  if (!isAdmin && !(isAuthor && settings?.allowPostEdits)) {
    return { ok: false, error: "Vous n'avez pas la permission de modifier ce post." };
  }

  try {
    const useCase = new UpdatePostContent(postRepo);
    await useCase.execute(validated.data);
    revalidatePath(`/${domain}/post/${validated.data.postId}`);
    return { ok: true };
  } catch (error) {
    console.error("Error updating post", error);
    return { ok: false, error: (error as Error).message };
  }
};
