import { z } from "zod";

import { UserOnTenant } from "@/lib/model/UserOnTenant";
import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";

import { type UseCase } from "../types";

export const ListUsersForTenantInput = z.object({ tenantId: z.number() });
export type ListUsersForTenantInput = z.infer<typeof ListUsersForTenantInput>;

export class ListUsersForTenant implements UseCase<ListUsersForTenantInput, UserOnTenant[]> {
  constructor(private readonly repo: IUserOnTenantRepo) {}

  public async execute(input: ListUsersForTenantInput): Promise<UserOnTenant[]> {
    const memberships = await this.repo.findByTenantId(input.tenantId);
    return memberships.map(m => UserOnTenant.parse(m));
  }
}
