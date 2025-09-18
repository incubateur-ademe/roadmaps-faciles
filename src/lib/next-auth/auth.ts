import { PrismaAdapter } from "@auth/prisma-adapter";
import { EspaceMembreProvider } from "@incubateur-ademe/next-auth-espace-membre-provider";
import { EspaceMembreClientMemberNotFoundError } from "@incubateur-ademe/next-auth-espace-membre-provider/EspaceMembreClient";
import { headers } from "next/headers";
import NextAuth from "next-auth";
import { type AdapterUser } from "next-auth/adapters";
import Nodemailer from "next-auth/providers/nodemailer";

import { config } from "@/config";
import { GetTenantForDomain } from "@/useCases/tenant/GetTenantForDomain";
import { GetTenantSettings } from "@/useCases/tenant_settings/GetTenantSettings";

import { prisma } from "../db/prisma";
import { tenantRepo, tenantSettingRepo, userOnTenantRepo, userRepo } from "../repo";

declare module "next-auth" {
  interface Session {
    user: AdapterUser & { isAdmin?: boolean; uuid: string };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    user: AdapterUser & { isAdmin?: boolean; uuid: string };
  }
}

const espaceMembreProvider = EspaceMembreProvider({
  fetch,
  fetchOptions: {
    next: {
      revalidate: 300, // 5 minutes
    },
    cache: "default",
  },
});

const nodemailerProvider = Nodemailer({
  server: {
    host: config.mailer.host,
    port: config.mailer.smtp.port,
    auth: {
      user: config.mailer.smtp.login,
      pass: config.mailer.smtp.password,
    },
  },
  from: config.mailer.from,
});

export interface GetAuthMethodsProps {
  domain?: string;
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(async () => {
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto");
  const host = headersList.get("host");
  const url = protocol && host ? `${protocol}://${host}/api/auth` : null;

  const domain = protocol && host && `${protocol}://${host}` === config.host ? null : host || null;
  const getTenantForDomain = new GetTenantForDomain(tenantRepo);
  const getTenantSettings = new GetTenantSettings(tenantSettingRepo);

  const tenant = domain ? await getTenantForDomain.execute({ domain }) : null;
  const tenantSetting = tenant ? await getTenantSettings.execute({ tenantId: tenant.id }) : null;

  if (!url) {
    console.error("Invalid request url");
    return { providers: [] };
  }

  return {
    secret: config.security.auth.secret,
    redirectProxyUrl: url,
    trustHost: true,
    pages: {
      signIn: "/login",
      signOut: "/logout",
      error: "/login/error",
      verifyRequest: "/login/verify-request",
    },
    session: {
      strategy: "jwt",
    },
    adapter: espaceMembreProvider.AdapterWrapper(PrismaAdapter(prisma)),
    // experimental: {
    //   enableWebAuthn: true,
    // },
    providers: [
      nodemailerProvider,
      espaceMembreProvider.ProviderWrapper(nodemailerProvider),
      // TODO
      // WebAuthn,
      // Passkey({
      //   registrationOptions: {},
      // }),
    ],
    callbacks: espaceMembreProvider.CallbacksWrapper({
      redirect() {
        return `${protocol}://${host}/`;
      },
      async signIn(params) {
        if (params.account?.provider === "nodemailer" && params.email?.verificationRequest) {
          // should not missing email or tenantSetting here
          if (!params.user.email || !tenantSetting || !tenant) {
            return false;
          }
          const [possibleUsername, emailDomain] = params.user.email.split("@");
          // check if domain is allowed for this tenant
          if (!emailDomain) {
            return false;
          }

          const isAllowedDomain =
            tenantSetting.allowedEmailDomains.includes(emailDomain) ||
            tenantSetting.allowedEmailDomains.includes("*") ||
            tenantSetting.allowedEmailDomains.length === 0;

          if (!isAllowedDomain) {
            return false;
          }

          if (params.user.email?.endsWith("@beta.gouv.fr") || params.user.email?.endsWith("@ext.beta.gouv.fr")) {
            // check if user is found in espace membre
            try {
              const betaUser = await espaceMembreProvider.client.member.getByUsername(possibleUsername);
              if (!betaUser.isActive) {
                return false;
              }

              const dbUser = await userRepo.findByEmail(params.user.email);
              if (!dbUser) {
                params.user = await userRepo.create({
                  email: params.user.email,
                  name: betaUser.fullname,
                  username: betaUser.username,
                  image: betaUser.avatar,
                  isBetaGouvMember: true,
                });
              } else {
                let userInTenant = await userOnTenantRepo.findMembership(dbUser.id, tenant.id);
                if (!userInTenant) {
                  userInTenant = await userOnTenantRepo.create({
                    userId: dbUser.id,
                    tenantId: tenant.id,
                    role: "USER",
                    status: "ACTIVE",
                  });
                }

                if (dbUser.status !== "ACTIVE" || userInTenant?.status !== "ACTIVE") {
                  return false;
                }
                params.user = dbUser;
              }
            } catch (error: unknown) {
              if (error instanceof EspaceMembreClientMemberNotFoundError) {
                return true;
              }
              return false;
            }
          }
        }
        return true;
      },
      async jwt({ token, trigger, espaceMembreMember }) {
        if (trigger === "signIn") {
          const now = new Date();
          const dbUser = espaceMembreMember
            ? await userRepo.findByUsername(espaceMembreMember.username)
            : await userRepo.findByEmail(token.email!);

          if (!dbUser) {
            throw new Error("User not found in database");
          }

          token = {
            ...token,
            user: {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              emailVerified: now,
              username: dbUser.username!,
              image: dbUser.image,
              isAdmin: dbUser.username ? config.admins.includes(dbUser.username) : false,
              uuid: dbUser.id,
              isBetaGouvMember: dbUser.isBetaGouvMember,
            },
          };
          token.sub = dbUser.username || dbUser.id;

          await userRepo.update(dbUser.id, {
            signInCount: dbUser.signInCount + 1,
            lastSignInAt: dbUser.currentSignInAt ?? now,
            currentSignInAt: now,
          });
        }
        return token;
      },
      session({ session, token }) {
        session.user = token.user;
        return session;
      },
    }),
  };
});
