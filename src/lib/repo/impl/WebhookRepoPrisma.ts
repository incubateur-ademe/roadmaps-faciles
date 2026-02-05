import { prisma } from "@/lib/db/prisma";
import { type Prisma, type Webhook } from "@/prisma/client";

import { type IWebhookRepo } from "../IWebhookRepo";

export class WebhookRepoPrisma implements IWebhookRepo {
  public findAll(): Promise<Webhook[]> {
    return prisma.webhook.findMany();
  }

  public findById(id: number): Promise<null | Webhook> {
    return prisma.webhook.findUnique({ where: { id } });
  }

  public create(data: Prisma.WebhookUncheckedCreateInput): Promise<Webhook> {
    return prisma.webhook.create({ data });
  }
}
