import { z } from "zod";

export const EMAIL_REGISTRATION_POLICY = {
  ANYONE: "ANYONE",
  NOONE: "NOONE",
  DOMAINS: "DOMAINS",
} as const;

export const emailRegistrationPolicyEnum = z.enum(EMAIL_REGISTRATION_POLICY);

export const TenantSetting = z.object({
  id: z.number(),
  tenantId: z.number(),
  isPrivate: z.boolean(),
  allowVoting: z.boolean(),
  allowComments: z.boolean(),
  allowAnonymousVoting: z.boolean(),
  allowPostEdits: z.boolean(),
  showRoadmapInHeader: z.boolean(),
  collapsedBoards: z.boolean(),
  allowAnonymousFeedback: z.boolean(),
  showVoteCount: z.boolean(),
  showVoteButton: z.boolean(),
  emailRegistrationPolicy: emailRegistrationPolicyEnum,
  allowedEmailDomains: z.string().array(),
  logoUrl: z.url().nullable(),
  logoWidth: z.number(),
  logoHeight: z.number(),
  logoLink: z.url().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  customCSS: z.string().nullable(),
  useBrowserLocale: z.boolean(),
  rootBoardId: z.number().nullable(),
});

export type TenantSetting = z.infer<typeof TenantSetting>;
