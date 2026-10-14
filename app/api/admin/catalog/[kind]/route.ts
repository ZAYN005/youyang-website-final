import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { isSafeImagePath } from "@/lib/cms/content";
import { adminSession, catalogSummaries, editorName, parseKind, resolveSlug } from "@/lib/catalog/admin";
import { loadCatalog, nextSortOrder } from "@/lib/catalog/server";
import { pick, validateData } from "@/lib/catalog/schema";


export const dynamic = "force-dynamic";

type Context = { params: Promise<{ kind: string }> };


/** all products / solutions (built-in + added) in display order */
export async function GET(_request: Request, context: Context) {

  const session = await adminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const kind = parseKind((await context.params).kind);
  if (!kind) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    return NextResponse.json({ items: await catalogSummaries(kind) });
  } catch (error) {
    console.error("[catalog] list failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}


/** adds a new product / solution */
export async function POST(request: Request, context: Context) {

  const session = await adminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const kind = parseKind((await context.params).kind);
  if (!kind) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: { slug?: unknown; visible?: unknown; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request", code: "BAD_DATA" }, { status: 400 });
  }

  const checked = validateData(kind, body?.data, isSafeImagePath);
  if ("error" in checked) {
    return NextResponse.json({ error: "Invalid data", ...checked.error }, { status: 400 });
  }

  try {
    const slugResult = await resolveSlug(kind, body.slug, pick(checked.data.name, "en"), null);
    if ("error" in slugResult) {
      return NextResponse.json({ error: "Invalid address", code: slugResult.error, field: "slug" }, { status: 400 });
    }

    const row = await prisma.catalogItem.create({
      data: {
        kind,
        slug: slugResult.slug,
        builtin: false,
        visible: body.visible === false ? false : true,
        sortOrder: await nextSortOrder(kind),
        data: checked.data as Prisma.InputJsonValue,
        updatedBy: editorName(session),
      },
    });

    return NextResponse.json({ ok: true, id: row.id, slug: row.slug }, { status: 201 });
  } catch (error) {
    // two people saving the same address at the same moment
    if ((error as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "Address taken", code: "SLUG_TAKEN", field: "slug" }, { status: 409 });
    }
    console.error("[catalog] create failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}


/**
 * Order and visibility of the list.
 * body: { order?: string[] (every address, in the new order), visible?: { slug, value } }
 */
export async function PUT(request: Request, context: Context) {

  const session = await adminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const kind = parseKind((await context.params).kind);
  if (!kind) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: { order?: unknown; visible?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const entries = await loadCatalog(kind);
    const bySlug = new Map(entries.map((e) => [e.slug, e]));
    const updatedBy = editorName(session);
    const operations: Prisma.PrismaPromise<unknown>[] = [];

    const write = (slug: string, values: { sortOrder?: number; visible?: boolean }) => {
      const entry = bySlug.get(slug)!;
      if (entry.builtin) {
        return prisma.catalogItem.upsert({
          where: { kind_slug: { kind, slug } },
          create: {
            kind,
            slug,
            builtin: true,
            visible: values.visible ?? entry.visible,
            sortOrder: values.sortOrder ?? entry.sortOrder,
            updatedBy,
          },
          update: { ...values, updatedBy },
        });
      }
      return prisma.catalogItem.update({ where: { id: entry.id! }, data: { ...values, updatedBy } });
    };

    if (body.order !== undefined) {
      const order = body.order;
      if (
        !Array.isArray(order) ||
        order.length !== entries.length ||
        new Set(order).size !== order.length ||
        !order.every((slug) => typeof slug === "string" && bySlug.has(slug))
      ) {
        return NextResponse.json({ error: "Invalid order", code: "BAD_ORDER" }, { status: 400 });
      }
      order.forEach((slug: string, index: number) => {
        const sortOrder = index * 10;
        if (bySlug.get(slug)!.sortOrder !== sortOrder) operations.push(write(slug, { sortOrder }));
      });
    }

    if (body.visible !== undefined) {
      const v = body.visible as { slug?: unknown; value?: unknown };
      if (!v || typeof v.slug !== "string" || typeof v.value !== "boolean" || !bySlug.has(v.slug)) {
        return NextResponse.json({ error: "Invalid visibility" }, { status: 400 });
      }
      operations.push(write(v.slug, { visible: v.value }));
    }

    await prisma.$transaction(operations);

    return NextResponse.json({ ok: true, items: await catalogSummaries(kind) });
  } catch (error) {
    console.error("[catalog] reorder failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}
