import { prisma } from "@/lib/db/prisma";
import { type Invitation, type Prisma } from "@/prisma/client";

import { type IInvitationRepo } from "../IInvitationRepo";

export class InvitationRepoPrisma implements IInvitationRepo {
  public findAll(): Promise<Invitation[]> {
    return prisma.invitation.findMany();
  }

  public findById(id: number): Promise<Invitation | null> {
    return prisma.invitation.findUnique({ where: { id } });
  }

  public create(data: Prisma.InvitationUncheckedCreateInput): Promise<Invitation> {
    return prisma.invitation.create({ data });
  }
}
