import { type NextRequest, NextResponse } from "next/server";

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

  const storedCode = await redis.getItem<string>(`2fa:email:${userId}`);
  if (!storedCode) {
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }

  if (storedCode !== code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  // Clean up code
  await redis.removeItem(`2fa:email:${userId}`);

  return NextResponse.json({ verified: true });
}
