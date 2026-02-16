import { type NextRequest, NextResponse } from "next/server";
import { verifySync } from "otplib";

import { prisma } from "@/lib/db/prisma";
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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { otpSecret: true, otpVerifiedAt: true },
  });

  if (!user?.otpSecret || !user.otpVerifiedAt) {
    return NextResponse.json({ error: "OTP not configured" }, { status: 400 });
  }

  const result = verifySync({ token: code, secret: user.otpSecret });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  return NextResponse.json({ verified: true });
}
