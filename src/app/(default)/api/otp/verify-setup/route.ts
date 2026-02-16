import { type NextRequest, NextResponse } from "next/server";
import { verifySync } from "otplib";

import { prisma } from "@/lib/db/prisma";
import { redis } from "@/lib/db/redis/storage";
import { auth } from "@/lib/next-auth/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.uuid;
  const { code } = (await req.json()) as { code: string };

  if (!code) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  const secret = await redis.getItem<string>(`otp:setup:${userId}`);
  if (!secret) {
    return NextResponse.json({ error: "Setup expired" }, { status: 400 });
  }

  const result = verifySync({ token: code, secret });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  // Store secret in DB, mark OTP as verified, and clear grace period deadline
  await prisma.user.update({
    where: { id: userId },
    data: {
      otpSecret: secret,
      otpVerifiedAt: new Date(),
      twoFactorEnabled: true,
      twoFactorDeadline: null,
    },
  });

  // Clean up temporary secret
  await redis.removeItem(`otp:setup:${userId}`);

  return NextResponse.json({ verified: true });
}
