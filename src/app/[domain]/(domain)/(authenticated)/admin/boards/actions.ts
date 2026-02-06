"use server";

import { revalidatePath } from "next/cache";

import { boardRepo, tenantSettingsRepo } from "@/lib/repo";
import { type Board } from "@/prisma/client";
import { CreateBoard } from "@/useCases/boards/CreateBoard";
import { DeleteBoard } from "@/useCases/boards/DeleteBoard";
import { ReorderBoards } from "@/useCases/boards/ReorderBoards";
import { UpdateBoard } from "@/useCases/boards/UpdateBoard";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

import { getTenantFromDomain } from "../../../getTenantFromDomainParam";

export const createBoard = async (
  data: {
    description?: string;
    name: string;
  },
  domain: string,
): Promise<ServerActionResponse<Board>> => {
  await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

  try {
    const useCase = new CreateBoard(boardRepo);
    const board = await useCase.execute({ tenantId: tenant.id, name: data.name, description: data.description });
    revalidatePath("/admin/boards");
    return { ok: true, data: board };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const updateBoard = async (
  data: {
    description?: string;
    id: number;
    name: string;
  },
  domain: string,
): Promise<ServerActionResponse<Board>> => {
  await assertTenantAdmin(domain);

  try {
    const useCase = new UpdateBoard(boardRepo);
    const board = await useCase.execute(data);
    revalidatePath("/admin/boards");
    return { ok: true, data: board };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const deleteBoard = async (data: { id: number }, domain: string): Promise<ServerActionResponse> => {
  await assertTenantAdmin(domain);

  try {
    const useCase = new DeleteBoard(boardRepo, tenantSettingsRepo);
    await useCase.execute(data);
    revalidatePath("/admin/boards");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const reorderBoards = async (
  data: {
    items: Array<{ id: number; order: number }>;
  },
  domain: string,
): Promise<ServerActionResponse> => {
  await assertTenantAdmin(domain);

  try {
    const useCase = new ReorderBoards(boardRepo);
    await useCase.execute(data);
    revalidatePath("/admin/boards");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
