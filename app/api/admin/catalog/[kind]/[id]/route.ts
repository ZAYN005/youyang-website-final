import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { isSafeImagePath } from "@/lib/cms/content";
import { adminSession, editorName, parseKind, resolveSlug } from "@/lib/catalog/admin";
import { pathFor } from "@/lib/catalog/builtins";
import { pick, validateData } from "@/lib/catalog/schema";


export const dynamic = "force-dynamic";

type Context = { params: Promise<{ kind: string; id: string }> };


async function findAdded(kindValue: string, id: string) {
  const kind = parseKind(kindValue);
  if (!kind) return { kind: null, row: null };
  const row = await prisma.catalogItem.findUnique({ where: { id } });
  if (!row || row.kind !== kind || row.builtin) return { kind, row: null };
  return { kind, row };
}

function present(row: NonNullable<Awaited<ReturnType<typeof findAdded>>["row"]>) {
  return {
    id: row.id,
    kind: row.kind,
    slug: row.slug,
    visible: row.visible,
    data: row.data,
    path: pathFor(row.kind === "product" ? "product" : "solution", row.slug),
    updatedAt: row.updatedAt.toISOString(),
    updatedBy: row.updatedBy,
  };
}


/** one added product / solution, for editing */
export async function GET(_request: Request, context: Context) {

  const session = await adminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await context.params;
  try {
    const { row } = await findAdded(params.kind, params.id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: present(row) });
  } catch (error) {
    console.error("[catalog] load failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}


/** saves an added product / solution. body: { slug, visible, data } */
export async function PUT(request: Request, context: Context) {

  const session = await adminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await context.params;

  let body: { slug?: unknown; visible?: unknown; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request", code: "BAD_DATA" }, { status: 400 });
  }

  try {
    const { kind, row } = await findAdded(params.kind, params.id);
    if (!kind || !row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const checked = validateData(kind, body?.data, isSafeImagePath);
    if ("error" in checked) {
      return NextResponse.json({ error: "Invalid data", ...checked.error }, { status: 400 });
    }

    // keep the current address unless a different one was typed
    const requestedSlug = typeof body.slug === "string" && body.slug.trim() ? body.slug : row.slug;
    const slugResult = await resolveSlug(kind, requestedSlug, pick(checked.data.name, "en"), row.id);
    if ("error" in slugResult) {
      return NextResponse.json({ error: "Invalid address", code: slugResult.error, field: "slug" }, { status: 400 });
    }

    const updated = await prisma.catalogItem.update({
      where: { id: row.id },
      data: {
        slug: slugResult.slug,
        visible: typeof body.visible === "boolean" ? body.visible : row.visible,
        data: checked.data as Prisma.InputJsonValue,
        updatedBy: editorName(session),
      },
    });

    return NextResponse.json({ ok: true, item: present(updated) });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "Address taken", code: "SLUG_TAKEN", field: "slug" }, { status: 409 });
    }
    console.error("[catalog] save failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}


/** deletes an added product / solution (built-in pages can only be hidden) */
export async function DELETE(_request: Request, context: Context) {

  const session = await adminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await context.params;
  try {
    const { row } = await findAdded(params.kind, params.id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.catalogItem.delete({ where: { id: row.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[catalog] delete failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}
