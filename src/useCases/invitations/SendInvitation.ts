import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { z } from "zod";

import { config } from "@/config";
import { prisma } from "@/lib/db/prisma";
import { type IInvitationRepo } from "@/lib/repo/IInvitationRepo";
import { type Invitation } from "@/prisma/client";

import { type UseCase } from "../types";

export const SendInvitationInput = z.object({
  tenantId: z.number(),
  email: z.string().email(),
  tenantUrl: z.string().url(),
});

export type SendInvitationInput = z.infer<typeof SendInvitationInput>;
export type SendInvitationOutput = Invitation;

export class SendInvitation implements UseCase<SendInvitationInput, SendInvitationOutput> {
  constructor(private readonly invitationRepo: IInvitationRepo) {}

  public async execute(input: SendInvitationInput): Promise<SendInvitationOutput> {
    // Check if user with this email already exists and is a member of this tenant
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      select: {
        id: true,
        status: true,
        tenants: {
          where: { tenantId: input.tenantId },
          select: { status: true },
        },
      },
    });

    if (existingUser) {
      if (existingUser.status === "BLOCKED" || existingUser.status === "DELETED") {
        throw new Error("Cet utilisateur est bloqué ou supprimé.");
      }

      const membership = existingUser.tenants[0];
      if (membership) {
        if (membership.status === "BLOCKED") {
          throw new Error("Cet utilisateur est bloqué sur ce tenant.");
        }
        throw new Error("Cet utilisateur est déjà membre de ce tenant.");
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findUnique({
      where: { email_tenantId: { email: input.email, tenantId: input.tenantId } },
    });
    if (existingInvitation && !existingInvitation.acceptedAt) {
      throw new Error("Une invitation est déjà en attente pour cet utilisateur.");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenDigest = crypto.createHash("sha256").update(token).digest("hex");

    // If a previous invitation was accepted, delete it and create a new one
    if (existingInvitation) {
      await prisma.invitation.delete({ where: { id: existingInvitation.id } });
    }

    const invitation = await this.invitationRepo.create({
      tenantId: input.tenantId,
      email: input.email,
      tokenDigest,
    });

    const invitationLink = `${input.tenantUrl}/login?invitation=${token}`;

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
      to: input.email,
      subject: "Vous êtes invité à rejoindre un espace",
      text: `Bonjour,\n\nVous avez été invité à rejoindre un espace. Cliquez sur le lien suivant pour accepter l'invitation :\n\n${invitationLink}\n\nCordialement,`,
      html: `<p>Bonjour,</p><p>Vous avez été invité à rejoindre un espace. Cliquez sur le lien suivant pour accepter l'invitation :</p><p><a href="${invitationLink}">${invitationLink}</a></p><p>Cordialement,</p>`,
    });

    return invitation;
  }
}
