import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-auth";
import { findSection } from "@/lib/cms/registry";
import {
  LOCALES,
  MAX_TEXT_LENGTH,
  SHARED_LOCALE,
  getByPath,
  getDefaultMessages,
  isSafeImagePath,
  loadSectionContent,
  sectionKeys,
  sectionTextKeys,
} from "@/lib/cms/content";


export const dynamic = "force-dynamic";

const MAX_IMAGES = 30;

type Context = { params: Promise<{ section: string }> };


async function authorize() {
  try {
    return await requirePermission("content");
  } catch {
    return null;
  }
}


/** one section: texts (中文 + English) and images */
export async function GET(_request: Request, context: Context) {

  const session = await authorize();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { section: sectionId } = await context.params;
  const section = findSection(sectionId);
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const content = await loadSectionContent(section);
    return NextResponse.json({
      section: {
        id: section.id,
        title: section.title,
        description: section.description ?? null,
        previewPath: section.previewPath ?? null,
      },
      ...content,
    });
  } catch (error) {
    console.error("[cms] load section failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}


/** saves the section; values equal to the default are removed from the database */
export async function PUT(request: Request, context: Context) {

  const session = await authorize();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { section: sectionId } = await context.params;
  const section = findSection(sectionId);
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: {
    texts?: Record<string, { zh?: unknown; en?: unknown }>;
    images?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const textKeys = new Set(sectionTextKeys(section));
  const imageFields = new Map((section.images ?? []).map((i) => [i.key, i]));
  const updatedBy = session.user?.email ?? session.user?.name ?? null;

  const operations: Prisma.PrismaPromise<unknown>[] = [];

  const upsert = (locale: string, key: string, value: Prisma.InputJsonValue) =>
    prisma.contentOverride.upsert({
      where: { locale_key: { locale, key } },
      create: { locale, key, value, updatedBy },
      update: { value, updatedBy },
    });

  const remove = (locale: string, key: string) =>
    prisma.contentOverride.deleteMany({ where: { locale, key } });

  // ---- texts ----
  for (const [key, values] of Object.entries(body.texts ?? {})) {
    if (!textKeys.has(key)) {
      return NextResponse.json({ error: `Unknown field: ${key}` }, { status: 400 });
    }
    for (const locale of LOCALES) {
      const value = values?.[locale];
      if (value === undefined) continue;
      if (typeof value !== "string" || value.length > MAX_TEXT_LENGTH) {
        return NextResponse.json({ error: `Invalid value: ${key}` }, { status: 400 });
      }
      const fallback = getByPath(getDefaultMessages(locale), key);
      const defaultValue = typeof fallback === "string" ? fallback : "";
      operations.push(value === defaultValue ? remove(locale, key) : upsert(locale, key, value));
    }
  }

  // ---- images ----
  for (const [key, raw] of Object.entries(body.images ?? {})) {
    const field = imageFields.get(key);
    if (!field) {
      return NextResponse.json({ error: `Unknown image field: ${key}` }, { status: 400 });
    }
    if (!Array.isArray(raw) || !raw.every((v) => typeof v === "string" && isSafeImagePath(v))) {
      return NextResponse.json({ error: `Invalid images: ${key}` }, { status: 400 });
    }
    const list = raw as string[];
    const min = field.kind === "single" ? 1 : field.min ?? 0;
    const max = field.kind === "single" ? 1 : MAX_IMAGES;
    if (list.length < min || list.length > max) {
      return NextResponse.json({ error: `Wrong number of images: ${key}` }, { status: 400 });
    }

    const fallback = getByPath(getDefaultMessages("zh"), key);
    const defaultList = Array.isArray(fallback) ? fallback : typeof fallback === "string" ? [fallback] : [];
    const isDefault =
      defaultList.length === list.length && defaultList.every((v, i) => v === list[i]);

    if (isDefault) {
      operations.push(remove(SHARED_LOCALE, key));
    } else {
      operations.push(upsert(SHARED_LOCALE, key, field.kind === "single" ? list[0] : list));
    }
  }

  try {
    await prisma.$transaction(operations);
    const content = await loadSectionContent(section);
    return NextResponse.json({ ok: true, ...content });
  } catch (error) {
    console.error("[cms] save failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}


/** restores the whole section to the original content */
export async function DELETE(_request: Request, context: Context) {

  const session = await authorize();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { section: sectionId } = await context.params;
  const section = findSection(sectionId);
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await prisma.contentOverride.deleteMany({
      where: { key: { in: [...sectionKeys(section)] } },
    });
    const content = await loadSectionContent(section);
    return NextResponse.json({ ok: true, ...content });
  } catch (error) {
    console.error("[cms] reset failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}
