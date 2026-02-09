"use server";

import { EspaceMembreClientMemberNotFoundError } from "@incubateur-ademe/next-auth-espace-membre-provider/EspaceMembreClient";
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

interface UpdateProfileData {
  email?: string;
  name?: null | string;
  notificationsEnabled?: boolean;
}

export const updateProfile = async (data: UpdateProfileData): Promise<ServerActionResponse> => {
  const session = await assertSession();

  try {
    const useCase = new UpdateUser(userRepo);
    await useCase.execute({ id: session.user.uuid, data });
    revalidatePath("/profile");
    return { ok: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "Cet e-mail est déjà utilisé par un autre compte." };
    }
    return { ok: false, error: (error as Error).message };
  }
};

interface RequestEmLinkData {
  emEmail: string;
}

export const requestEmLink = async (username: string): Promise<ServerActionResponse<RequestEmLinkData>> => {
  const session = await assertSession();

  try {
    // Vérifier si ce username EM est déjà lié à un autre utilisateur
    const existingUser = await userRepo.findByUsername(username);
    if (existingUser && existingUser.id !== session.user.uuid) {
      return { ok: false, error: "Ce login Espace Membre est déjà lié à un autre compte." };
    }

    const member = await espaceMembreClient.member.getByUsername(username);

    if (!member.isActive) {
      return { ok: false, error: "Ce membre n'est plus actif sur l'Espace Membre." };
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
      subject: "Confirmez la liaison de votre compte Espace Membre",
      text: `Bonjour,\n\nVous avez demandé à lier votre compte à l'Espace Membre (${username}).\n\nCliquez sur le lien suivant pour confirmer :\n\n${confirmUrl}\n\nCe lien expire dans 1 heure.\n\nCordialement,`,
      html: `<p>Bonjour,</p><p>Vous avez demandé à lier votre compte à l'Espace Membre (<strong>${username}</strong>).</p><p>Cliquez sur le lien suivant pour confirmer :</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p>Ce lien expire dans 1 heure.</p><p>Cordialement,</p>`,
    });

    // Mask email: show first 3 chars + domain
    const [localPart, domain] = emEmail.split("@");
    const maskedEmail = `${localPart.slice(0, 3)}***@${domain}`;

    return { ok: true, data: { emEmail: maskedEmail } };
  } catch (error) {
    if (error instanceof EspaceMembreClientMemberNotFoundError) {
      return { ok: false, error: "Aucun membre trouvé avec ce login sur l'Espace Membre." };
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

  try {
    if (!session.user.isBetaGouvMember) {
      return { ok: false, error: "Votre compte n'est pas lié à l'Espace Membre." };
    }

    const user = await userRepo.findById(session.user.uuid);
    if (!user?.username) {
      return { ok: false, error: "Aucun username Espace Membre trouvé." };
    }

    const member = await espaceMembreClient.member.getByUsername(user.username);
    const emEmail = getEmUserEmail(member);

    if (emEmail === user.email) {
      return { ok: false, error: "Votre e-mail est déjà identique à celui de l'Espace Membre." };
    }

    // Vérifier si l'email EM est déjà utilisé par un autre compte
    const existingUser = await userRepo.findByEmail(emEmail);
    if (existingUser && existingUser.id !== session.user.uuid) {
      return { ok: false, error: "Cet e-mail est déjà utilisé par un autre compte." };
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
      return { ok: false, error: "Cet e-mail est déjà utilisé par un autre compte." };
    }
    return { ok: false, error: (error as Error).message };
  }
};

export const deleteAccount = async (): Promise<ServerActionResponse> => {
  const session = await assertSession();
  const userId = session.user.uuid;

  try {
    const anonymousEmail = `deleted-${crypto.randomUUID()}@anonymous.local`;

    await prisma.$transaction([
      prisma.user.update({
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
      }),
      prisma.userOnTenant.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.apiKey.deleteMany({ where: { userId } }),
      prisma.follow.deleteMany({ where: { userId } }),
    ]);

    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
