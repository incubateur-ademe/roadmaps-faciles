import { type Prisma, type Webhook } from "@/prisma/client";

export interface IWebhookRepo {
  create(data: Prisma.WebhookUncheckedCreateInput): Promise<Webhook>;
  findAll(): Promise<Webhook[]>;
  findById(id: number): Promise<null | Webhook>;
}
