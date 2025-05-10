import { type NextRequest, type NextResponse } from "next/server";

const ANONYMOUS_ID_KEY = "anon_id";
const ANONYMOUS_ID_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getAnonymousId() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const existing = cookieStore.get(ANONYMOUS_ID_KEY)?.value;

  if (existing) return existing;

  throw new Error("Anonymous ID not found");
}

export function responseWithAnonymousId(request: NextRequest, response: NextResponse) {
  const existing = request.cookies.get(ANONYMOUS_ID_KEY)?.value;

  if (existing) return response;

  const id = crypto.randomUUID();
  response.cookies.set(ANONYMOUS_ID_KEY, id, {
    path: "/",
    maxAge: ANONYMOUS_ID_MAX_AGE,
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}
