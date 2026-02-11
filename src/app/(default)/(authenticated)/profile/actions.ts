"use server";

import { EspaceMembreClientMemberNotFoundError } from "@incubateur-ademe/next-auth-espace-membre-provider/EspaceMembreClient";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "node:crypto";
import nodemailer from "nodemailer";

import { config } from "@/config";
import { prisma } from "@/lib/db/prisma";
import { createEmLinkToken, espaceMembreClient, getEmUserEmail } from "@/lib/espaceMembre";
import { userRepo } from "@/lib/repo";
import { PrismaClientKnownRequestError } from "@/prisma/internal/prismaNamespace";
import { UpdateUser } from "@/useCases/users/UpdateUser";
import { assertSession } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

const isUniqueConstraintError = (error: unknown): boolean =>
  error instanceof PrismaClientKnownRequestError && error.code === "P2002";

const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

interface UpdateProfileData {
  email?: string;
  name?: null | string;
  notificationsEnabled?: boolean;
}

export const updateProfile = async (data: UpdateProfileData): Promise<ServerActionResponse> => {
  const session = await assertSession();
  const t = await getTranslations("serverErrors");

  try {
    const useCase = new UpdateUser(userRepo);
    await useCase.execute({ id: session.user.uuid, data });
    revalidatePath("/profile");
    return { ok: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: t("emailAlreadyUsed") };
    }
    return { ok: false, error: (error as Error).message };
  }
};

interface RequestEmLinkData {
  emEmail: string;
}

export const requestEmLink = async (username: string): Promise<ServerActionResponse<RequestEmLinkData>> => {
  const session = await assertSession();
  const t = await getTranslations("serverErrors");
  const tEmail = await getTranslations("emails.emLinkConfirm");

  try {
    // Vérifier si ce username EM est déjà lié à un autre utilisateur
    const existingUser = await userRepo.findByUsername(username);
    if (existingUser && existingUser.id !== session.user.uuid) {
      return { ok: false, error: t("emLoginAlreadyLinked") };
    }

    const member = await espaceMembreClient.member.getByUsername(username);

    if (!member.isActive) {
      return { ok: false, error: t("emMemberNotActive") };
    }

    const emEmail = getEmUserEmail(member);

    const headersList = await headers();
    const proto = headersList.get("x-forwarded-proto") || "http";
    const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
    const redirectUrl = `${proto}://${host}/profile`;

    const token = createEmLinkToken(session.user.uuid, username, redirectUrl);
    const confirmUrl = `${config.host}/api/confirm-em-link?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: config.mailer.host,
      port: config.mailer.smtp.port,
      secure: config.mailer.smtp.ssl,
      auth:
        config.mailer.smtp.login && config.mailer.smtp.password
          ? {
              user: config.mailer.smtp.login,
              pass: config.mailer.smtp.password,
            }
          : undefined,
    });

    await transporter.sendMail({
      from: config.mailer.from,
      to: emEmail,
      subject: tEmail("subject"),
      text: `${tEmail("greeting")}\n\n${tEmail("body", { username })}\n\n${tEmail("clickToConfirm")}\n\n${confirmUrl}\n\n${tEmail("expiry")}\n\n${tEmail("closing")}`,
      html: `<p>${tEmail("greeting")}</p><p>${tEmail("body", { username: `<strong>${escapeHtml(username)}</strong>` })}</p><p>${tEmail("clickToConfirm")}</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p>${tEmail("expiry")}</p><p>${tEmail("closing")}</p>`,
    });

    // Mask email: show first 3 chars + domain
    const [localPart, domain] = emEmail.split("@");
    const maskedEmail = `${localPart.slice(0, 3)}***@${domain}`;

    return { ok: true, data: { emEmail: maskedEmail } };
  } catch (error) {
    if (error instanceof EspaceMembreClientMemberNotFoundError) {
      return { ok: false, error: t("emMemberNotFound") };
    }
    return { ok: false, error: (error as Error).message };
  }
};

export const unlinkEspaceMembre = async (): Promise<ServerActionResponse> => {
  const session = await assertSession();

  try {
    const useCase = new UpdateUser(userRepo);
    await useCase.execute({
      id: session.user.uuid,
      data: {
        isBetaGouvMember: false,
        username: null,
        image: null,
      },
    });
    revalidatePath("/profile");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const switchToEmEmail = async (): Promise<ServerActionResponse> => {
  const session = await assertSession();
  const t = await getTranslations("serverErrors");

  try {
    if (!session.user.isBetaGouvMember) {
      return { ok: false, error: t("accountNotLinkedToEm") };
    }

    const user = await userRepo.findById(session.user.uuid);
    if (!user?.username) {
      return { ok: false, error: t("noEmUsername") };
    }

    const member = await espaceMembreClient.member.getByUsername(user.username);
    const emEmail = getEmUserEmail(member);

    if (emEmail === user.email) {
      return { ok: false, error: t("emailAlreadySameAsEm") };
    }

    // Vérifier si l'email EM est déjà utilisé par un autre compte
    const existingUser = await userRepo.findByEmail(emEmail);
    if (existingUser && existingUser.id !== session.user.uuid) {
      return { ok: false, error: t("emailAlreadyUsed") };
    }

    const useCase = new UpdateUser(userRepo);
    await useCase.execute({
      id: session.user.uuid,
      data: { email: emEmail },
    });

    revalidatePath("/profile");
    return { ok: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: t("emailAlreadyUsed") };
    }
    return { ok: false, error: (error as Error).message };
  }
};

export const deleteAccount = async (): Promise<ServerActionResponse> => {
  const session = await assertSession();
  const userId = session.user.uuid;
  const t = await getTranslations("serverErrors");

  try {
    const anonymousEmail = `deleted-${crypto.randomUUID()}@anonymous.local`;

    // Transaction interactive pour vérifier atomiquement le last-owner + supprimer
    await prisma.$transaction(async tx => {
      const ownerships = await tx.userOnTenant.findMany({
        where: { userId, role: "OWNER" },
        select: { tenantId: true },
      });
      for (const { tenantId } of ownerships) {
        const ownerCount = await tx.userOnTenant.count({
          where: { tenantId, role: "OWNER", status: "ACTIVE" },
        });
        if (ownerCount <= 1) {
          throw new Error(t("lastOwnerCannotDelete"));
        }
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          email: anonymousEmail,
          name: null,
          username: null,
          image: null,
          isBetaGouvMember: false,
          status: "DELETED",
          notificationsEnabled: false,
        },
      });
      await tx.userOnTenant.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });
      await tx.session.deleteMany({ where: { userId } });
      await tx.apiKey.deleteMany({ where: { userId } });
      await tx.follow.deleteMany({ where: { userId } });
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
