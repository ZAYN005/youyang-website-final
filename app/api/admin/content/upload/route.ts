import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { requirePermission } from "@/lib/admin-auth";
import {
  IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  UPLOAD_URL_PREFIX,
  detectImageType,
  getUploadDir,
} from "@/lib/cms/uploads";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";


/** uploads one image (JPG / PNG / WebP / GIF, max 10 MB) and returns its URL */
export async function POST(request: Request) {

  try {
    await requirePermission("content");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let file: File | null = null;

  try {
    const form = await request.formData();
    const value = form.get("file");
    if (value && typeof value !== "string") file = value as File;
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large", code: "TOO_LARGE" }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);

  if (!type) {
    return NextResponse.json({ error: "Unsupported file type", code: "BAD_TYPE" }, { status: 415 });
  }

  try {
    const now = new Date();
    const folder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}${IMAGE_TYPES[type].ext}`;

    const dir = path.join(getUploadDir(), folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);

    return NextResponse.json({ url: `${UPLOAD_URL_PREFIX}${folder}/${name}` });
  } catch (error) {
    console.error("[cms] upload failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}
