import { PrismaAdapter } from "@auth/prisma-adapter";
import { EspaceMembreProvider } from "@incubateur-ademe/next-auth-espace-membre-provider";
import NextAuth from "next-auth";
import { type AdapterUser } from "next-auth/adapters";
import Nodemailer from "next-auth/providers/nodemailer";

import { config } from "@/config";

import { prisma } from "../db/prisma";
import { userRepo } from "../repo";

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

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  secret: config.security.auth.secret,
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
    async jwt({ token, trigger, espaceMembreMember }) {
      if (trigger !== "update" && espaceMembreMember) {
        const dbUser = await userRepo.findByUsername(espaceMembreMember.username);
        console.log("dbUser", dbUser);
        if (!dbUser) {
          throw new Error("User not found in database");
        }

        const now = new Date();
        await userRepo.update(dbUser.id, {
          signInCount: dbUser.signInCount + 1,
          lastSignInAt: dbUser.currentSignInAt ?? now,
          currentSignInAt: now,
        });

        token = {
          ...token,
          user: {
            id: token.sub || espaceMembreMember.username,
            email: espaceMembreMember.primary_email,
            name: espaceMembreMember.fullname,
            emailVerified: now,
            username: espaceMembreMember.username,
            image: espaceMembreMember.avatar,
            isAdmin: config.admins.includes(espaceMembreMember.username),
            uuid: espaceMembreMember.uuid,
          },
        };
        token.sub = espaceMembreMember.username;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      return session;
    },
  }),
});
