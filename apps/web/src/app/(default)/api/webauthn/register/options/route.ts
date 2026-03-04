import { generateRegistrationOptions } from "@simplewebauthn/server";
import { NextResponse } from "next/server";

import { config } from "@/config";
import { prisma } from "@/lib/db/prisma";
import { redis } from "@/lib/db/redis/storage";
import { auth } from "@/lib/next-auth/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.uuid;
  const rpID = config.rootDomain.replace(/:\d+$/, "");

  const existingAuthenticators = await prisma.authenticator.findMany({
    where: { userId },
  });

  const options = await generateRegistrationOptions({
    rpName: config.brand.name,
    rpID,
    userName: session.user.email,
    userDisplayName: session.user.name ?? session.user.email,
    attestationType: "none",
    excludeCredentials: existingAuthenticators.map(auth => ({
      id: auth.credentialID,
      transports: auth.transports?.split(",") as AuthenticatorTransport[] | undefined,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  // Store challenge in Redis with 5 min TTL
  await redis.setItem(`webauthn:challenge:${userId}`, options.challenge, { ttl: 300 });

  return NextResponse.json(options);
}
