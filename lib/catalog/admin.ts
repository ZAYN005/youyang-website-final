/**
 * Helpers used by the 内容管理 API routes for products / solutions.
 */

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-auth";
import { getSiteMessages, getByPath } from "@/lib/cms/content";
import { imageList } from "@/lib/cms/images";

import { RESERVED_SLUGS, findBuiltin, pathFor } from "./builtins";
import { loadCatalog, CatalogEntry } from "./server";
import {
  CATALOG_KINDS,
  CatalogKind,
  MAX_SLUG_LENGTH,
  SLUG_PATTERN,
  images,
  pick,
  slugify,
} from "./schema";

export function parseKind(value: string): CatalogKind | null {
  return (CATALOG_KINDS as string[]).includes(value) ? (value as CatalogKind) : null;
}

export async function adminSession() {
  try {
    return await requirePermission("content");
  } catch {
    return null;
  }
}

export function editorName(session: Awaited<ReturnType<typeof requirePermission>>) {
  return session.user?.email ?? session.user?.name ?? null;
}

export interface CatalogSummary {
  id: string | null;
  slug: string;
  builtin: boolean;
  /** 内容管理 section that edits a built-in page */
  sectionId: string | null;
  title: { zh: string; en: string };
  visible: boolean;
  image: string | null;
  path: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

/** the list shown in 内容管理 (built-ins + added items, in display order) */
export async function catalogSummaries(kind: CatalogKind): Promise<CatalogSummary[]> {
  const [entries, zh, en] = await Promise.all([loadCatalog(kind), getSiteMessages("zh"), getSiteMessages("en")]);

  return entries.map((entry: CatalogEntry) => {
    if (entry.builtin) {
      const b = entry.builtin;
      const nameKey = kind === "product" ? `products.${b.key}.name` : `solutions.items.${b.key}.title`;
      const imageKey = kind === "product" ? `products.${b.key}.images` : `solutions.items.${b.key}.image`;
      const zhName = getByPath(zh, nameKey);
      const enName = getByPath(en, nameKey);
      return {
        id: entry.id,
        slug: entry.slug,
        builtin: true,
        sectionId: b.sectionId,
        title: {
          zh: typeof zhName === "string" ? zhName : b.title.zh,
          en: typeof enName === "string" ? enName : b.title.en,
        },
        visible: entry.visible,
        image: imageList(getByPath(zh, imageKey), [b.image])[0] ?? b.image,
        path: pathFor(kind, entry.slug),
        updatedAt: entry.updatedAt?.toISOString() ?? null,
        updatedBy: entry.updatedBy,
      };
    }
    const data = entry.data ?? {};
    return {
      id: entry.id,
      slug: entry.slug,
      builtin: false,
      sectionId: null,
      title: { zh: pick(data.name, "zh"), en: pick(data.name, "en") },
      visible: entry.visible,
      image: images(data.images)[0] ?? null,
      path: pathFor(kind, entry.slug),
      updatedAt: entry.updatedAt?.toISOString() ?? null,
      updatedBy: entry.updatedBy,
    };
  });
}

export type SlugResult = { slug: string } | { error: "BAD_SLUG" | "SLUG_TAKEN" };

/**
 * Decides the page address of an added item.
 * - an address typed by the user must be valid and free
 * - otherwise one is made from the English name (adding -2, -3 … when taken)
 */
export async function resolveSlug(
  kind: CatalogKind,
  requested: unknown,
  englishName: string,
  ownId: string | null,
): Promise<SlugResult> {
  const taken = async (slug: string) => {
    if (RESERVED_SLUGS.has(slug) || findBuiltin(kind, slug)) return true;
    const row = await prisma.catalogItem.findUnique({ where: { kind_slug: { kind, slug } }, select: { id: true } });
    return !!row && row.id !== ownId;
  };

  if (typeof requested === "string" && requested.trim()) {
    const slug = requested.trim().toLowerCase();
    if (slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) return { error: "BAD_SLUG" };
    if (await taken(slug)) return { error: "SLUG_TAKEN" };
    return { slug };
  }

  const base = slugify(englishName) || (kind === "product" ? "product" : "solution");
  for (let n = 1; n < 500; n++) {
    const suffix = n === 1 ? "" : `-${n}`;
    const candidate = base.slice(0, MAX_SLUG_LENGTH - suffix.length).replace(/-+$/g, "") + suffix;
    if (!(await taken(candidate))) return { slug: candidate };
  }
  return { error: "SLUG_TAKEN" };
}
