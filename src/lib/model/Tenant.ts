import { z } from "zod";

import { localeSchema } from "@/utils/zod-schema";

export const Tenant = z.object({
  id: z.number(),
  name: z.string(),
  subdomain: z.string(),
  customDomain: z.string().nullable(),
  locale: localeSchema,
  deletedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Tenant = z.infer<typeof Tenant>;
