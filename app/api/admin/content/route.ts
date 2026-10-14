import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { CMS_GROUPS } from "@/lib/cms/registry";
import { sectionKeys } from "@/lib/cms/content";
import { builtinsFor } from "@/lib/catalog/builtins";
import { loadCatalog } from "@/lib/catalog/server";
import { pick, type CatalogKind } from "@/lib/catalog/schema";


export const dynamic = "force-dynamic";


/** content tree for the 内容管理 sidebar, with the number of edited fields per section */
export async function GET() {

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {

    const rows = await prisma.contentOverride.findMany({
      select: { key: true },
    });

    const editedKeys = new Set(rows.map((r) => r.key));

    const catalogs: Record<CatalogKind, Awaited<ReturnType<typeof loadCatalog>>> = {
      product: await loadCatalog("product"),
      solution: await loadCatalog("solution"),
    };

    const hiddenSections = new Set<string>();
    for (const kind of ["product", "solution"] as CatalogKind[]) {
      for (const entry of catalogs[kind]) {
        if (entry.builtin && !entry.visible) hiddenSections.add(entry.builtin.sectionId);
      }
    }

    const groups = CMS_GROUPS.map((group) => {
      const kind: CatalogKind | null =
        group.id === "products" ? "product" : group.id === "solutions" ? "solution" : null;

      const sections = group.sections.map((section) => {
        const keys = sectionKeys(section);
        let edited = 0;
        for (const key of keys) if (editedKeys.has(key)) edited++;
        return {
          id: section.id,
          type: "section" as const,
          title: section.title,
          edited,
          hidden: hiddenSections.has(section.id),
        };
      });

      if (!kind) return { id: group.id, title: group.title, sections };

      // 产品管理 / 方案管理 first, then the existing pages, then the added items
      const manager = {
        id: `catalog:${kind}`,
        type: "manager" as const,
        title:
          kind === "product"
            ? { zh: "产品管理（新增 / 排序 / 隐藏）", en: "Manage products (add / order / hide)" }
            : { zh: "方案管理（新增 / 排序 / 隐藏）", en: "Manage solutions (add / order / hide)" },
        edited: 0,
        hidden: false,
      };

      const builtinSectionIds = new Set(builtinsFor(kind).map((b) => b.sectionId));
      const pageSections = sections.filter((s) => !builtinSectionIds.has(s.id));
      const builtinSections = catalogs[kind]
        .filter((e) => e.builtin)
        .map((e) => sections.find((s) => s.id === e.builtin!.sectionId))
        .filter((s): s is (typeof sections)[number] => !!s);

      const added = catalogs[kind]
        .filter((e) => !e.builtin && e.id)
        .map((e) => ({
          id: `item:${kind}:${e.id}`,
          type: "added" as const,
          title: {
            zh: pick(e.data?.name, "zh") || e.slug,
            en: pick(e.data?.name, "en") || e.slug,
          },
          edited: 0,
          hidden: !e.visible,
        }));

      // keep the page order chosen in 产品管理 for both built-in and added items
      const order = catalogs[kind].map((e) =>
        e.builtin ? e.builtin.sectionId : `item:${kind}:${e.id}`,
      );
      const itemSections = [...builtinSections, ...added].sort(
        (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
      );

      return {
        id: group.id,
        title: group.title,
        sections: [manager, ...pageSections, ...itemSections],
      };
    });

    return NextResponse.json({ groups });

  } catch (error) {
    console.error("[cms] tree failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}
