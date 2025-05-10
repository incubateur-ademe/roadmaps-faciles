import { type Invitation, type Prisma } from "@/prisma/client";

export interface IInvitationRepo {
  create(data: Prisma.InvitationUncheckedCreateInput): Promise<Invitation>;
  findAll(): Promise<Invitation[]>;
  findById(id: number): Promise<Invitation | null>;
}
