import { NextResponse } from "next/server";

import { getStorageProvider } from "@/lib/storage-provider";
import { VALID_STORAGE_KEY_PATTERN } from "@/lib/storage-provider/validation";

export async function GET(_request: Request, props: { params: Promise<{ key: string[] }> }) {
  const { key } = await props.params;
  const keyPath = key.join("/");

  if (!VALID_STORAGE_KEY_PATTERN.test(keyPath)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const storage = getStorageProvider();
  const url = storage.getPublicUrl(keyPath);

  return NextResponse.redirect(url, 302);
}
