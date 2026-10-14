/**
 * Server-side helpers for added products / solutions.
 * Every reader falls back to the built-in items if the database fails,
 * so the public website keeps working.
 */

import { prisma } from "@/lib/prisma";

import { BuiltinEntry, builtinsFor, findBuiltin } from "./builtins";
import type { CatalogData, CatalogKind } from "./schema";

export interface CatalogEntry {
  slug: string;
  kind: CatalogKind;
  /** set for the built-in pages */
  builtin: BuiltinEntry | null;
  /** database id (added items always have one; built-ins only after being hidden / moved) */
  id: string | null;
  visible: boolean;
  sortOrder: number;
  /** content of an added item */
  data: CatalogData | null;
  updatedAt: Date | null;
  updatedBy: string | null;
}

function builtinDefaults(kind: CatalogKind): CatalogEntry[] {
  return builtinsFor(kind).map((b, index) => ({
    slug: b.slug,
    kind,
    builtin: b,
    id: null,
    visible: true,
    sortOrder: index * 10,
    data: null,
    updatedAt: null,
    updatedBy: null,
  }));
}

/** all items of a kind (hidden ones included), in display order. Throws on database errors. */
export async function loadCatalog(kind: CatalogKind): Promise<CatalogEntry[]> {
  const rows = await prisma.catalogItem.findMany({ where: { kind } });
  const entries = builtinDefaults(kind);

  for (const row of rows) {
    const builtin = findBuiltin(kind, row.slug);
    if (builtin) {
      const entry = entries.find((e) => e.slug === row.slug)!;
      entry.id = row.id;
      entry.visible = row.visible;
      entry.sortOrder = row.sortOrder;
      entry.updatedAt = row.updatedAt;
      entry.updatedBy = row.updatedBy;
      continue;
    }
    if (row.builtin) continue; // a built-in that no longer exists in code
    if (!row.data || typeof row.data !== "object" || Array.isArray(row.data)) continue;
    entries.push({
      slug: row.slug,
      kind,
      builtin: null,
      id: row.id,
      visible: row.visible,
      sortOrder: row.sortOrder,
      data: row.data as CatalogData,
      updatedAt: row.updatedAt,
      updatedBy: row.updatedBy,
    });
  }

  // stable order: sortOrder, then built-ins first, then oldest first
  return entries.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    if (!!a.builtin !== !!b.builtin) return a.builtin ? -1 : 1;
    return (a.updatedAt?.getTime() ?? 0) - (b.updatedAt?.getTime() ?? 0);
  });
}

/** visible items for the website; never throws */
export async function getVisibleCatalog(kind: CatalogKind): Promise<CatalogEntry[]> {
  try {
    return (await loadCatalog(kind)).filter((e) => e.visible);
  } catch (error) {
    console.error(`[catalog] could not load ${kind} list, showing built-ins:`, error);
    return builtinDefaults(kind);
  }
}

/** an added item by address, or null; never throws */
export async function getAddedItem(kind: CatalogKind, slug: string) {
  try {
    const row = await prisma.catalogItem.findUnique({ where: { kind_slug: { kind, slug } } });
    if (!row || row.builtin || findBuiltin(kind, slug)) return null;
    if (!row.data || typeof row.data !== "object" || Array.isArray(row.data)) return null;
    return { id: row.id, slug: row.slug, visible: row.visible, data: row.data as CatalogData };
  } catch (error) {
    console.error("[catalog] could not load item:", error);
    return null;
  }
}

/** true when a built-in page was hidden in 内容管理; never throws (shows the page on errors) */
export async function isBuiltinHidden(kind: CatalogKind, slug: string): Promise<boolean> {
  try {
    const row = await prisma.catalogItem.findUnique({
      where: { kind_slug: { kind, slug } },
      select: { visible: true },
    });
    return row ? !row.visible : false;
  } catch (error) {
    console.error("[catalog] could not check visibility:", error);
    return false;
  }
}

/** next sort position (after everything that exists) */
export async function nextSortOrder(kind: CatalogKind): Promise<number> {
  const entries = await loadCatalog(kind);
  return entries.reduce((max, e) => Math.max(max, e.sortOrder), -10) + 10;
}
