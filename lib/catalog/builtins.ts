/**
 * The products and solutions that were built with the website.
 * Their pages stay exactly as designed; in 内容管理 they can be edited
 * (texts / images), hidden and re-ordered, but not deleted.
 */

import type { Bilingual, CatalogKind } from "./schema";

export interface BuiltinEntry {
  slug: string;
  /** key under products.* or solutions.items.* in the message files */
  key: string;
  /** key under footer.products.* / footer.solutions.* */
  footerKey: string;
  /** fallback image used on the list page */
  image: string;
  /** the 内容管理 section that edits this page */
  sectionId: string;
  title: Bilingual;
}

export const BUILTIN_PRODUCTS: BuiltinEntry[] = [
  {
    slug: "360-sentinel",
    key: "sentinel",
    footerKey: "sentinel",
    image: "/products/360-sentinel.png",
    sectionId: "product-sentinel",
    title: { zh: "360 Sentinel（360哨兵）", en: "360 Sentinel" },
  },
  {
    slug: "dome-watch",
    key: "dome",
    footerKey: "dome",
    image: "/products/dome-watch.png",
    sectionId: "product-dome",
    title: { zh: "Dome Watch（云瞰）", en: "Dome Watch" },
  },
  {
    slug: "wide-area-guardian",
    key: "guardian",
    footerKey: "guardian",
    image: "/products/wide-area-guardian.jpg",
    sectionId: "product-guardian",
    title: { zh: "Wide-area Guardian（广域卫士）", en: "Wide-area Guardian" },
  },
];

export const BUILTIN_SOLUTIONS: BuiltinEntry[] = [
  {
    slug: "urban-public-spaces",
    key: "urban",
    footerKey: "urban",
    image: "/solutions/plaza.png",
    sectionId: "solution-urban",
    title: { zh: "城市公共空间", en: "Urban public spaces" },
  },
  {
    slug: "transportation-hubs-critical-sites",
    key: "transportation",
    footerKey: "transportation",
    image: "/solutions/airport.png",
    sectionId: "solution-transportation",
    title: { zh: "交通枢纽与关键场所", en: "Transportation hubs" },
  },
  {
    slug: "campuses-educational-institutions",
    key: "campus",
    footerKey: "campuses",
    image: "/solutions/campus.jpg",
    sectionId: "solution-campuses",
    title: { zh: "校园与教育机构", en: "Campuses" },
  },
  {
    slug: "healthcare-senior-care",
    key: "healthcare",
    footerKey: "healthcare",
    image: "/solutions/healthcare.jpg",
    sectionId: "solution-healthcare",
    title: { zh: "医疗与养老机构", en: "Healthcare & senior care" },
  },
  {
    slug: "high-security-facilities",
    key: "security",
    footerKey: "security",
    image: "/solutions/high-security.jpg",
    sectionId: "solution-security",
    title: { zh: "高安全场所", en: "High-security facilities" },
  },
  {
    slug: "commercial-industrial-worksites",
    key: "industrial",
    footerKey: "industrial",
    image: "/solutions/industrial-worksite.jpg",
    sectionId: "solution-industrial",
    title: { zh: "商业与工业作业场景", en: "Commercial & industrial" },
  },
];

export function builtinsFor(kind: CatalogKind): BuiltinEntry[] {
  return kind === "product" ? BUILTIN_PRODUCTS : BUILTIN_SOLUTIONS;
}

export function findBuiltin(kind: CatalogKind, slug: string): BuiltinEntry | undefined {
  return builtinsFor(kind).find((b) => b.slug === slug);
}

/** addresses that can never be used by an added item */
export const RESERVED_SLUGS = new Set(["new", "edit", "admin", "api", "index", "page"]);

export function pathFor(kind: CatalogKind, slug: string): string {
  return `/${kind === "product" ? "products" : "solutions"}/${slug}`;
}
