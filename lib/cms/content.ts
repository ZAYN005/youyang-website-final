/**
 * Server-side helpers for 内容管理 (content management).
 *
 * The JSON message files are the defaults. Edits made in the admin panel are
 * stored as ContentOverride rows (locale + message key + value) and applied
 * on top of the defaults for every page request. If the database is not
 * reachable, the website simply shows the defaults.
 */

import { prisma } from "@/lib/prisma";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

import { CmsSection, allImageKeys } from "./registry";
import { labelForKey } from "./labels";

export type Locale = "zh" | "en";
export const LOCALES: Locale[] = ["zh", "en"];

/** locale value used for images, which are shared by both languages */
export const SHARED_LOCALE = "*";

type Messages = Record<string, unknown>;

const DEFAULTS: Record<Locale, Messages> = {
  zh: zh as Messages,
  en: en as Messages,
};

export function getDefaultMessages(locale: Locale): Messages {
  return DEFAULTS[locale];
}

export function getByPath(obj: unknown, key: string): unknown {
  let current: unknown = obj;
  for (const part of key.split(".")) {
    if (current === null || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** sets a value on a copy-on-write basis (only cloned along the path) */
function setByPath(root: Messages, key: string, value: unknown): Messages {
  const parts = key.split(".");
  const next: Messages = { ...root };
  let cursor: Messages = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const child = cursor[part];
    const copy: Messages =
      child && typeof child === "object" && !Array.isArray(child)
        ? { ...(child as Messages) }
        : {};
    cursor[part] = copy;
    cursor = copy;
  }
  cursor[parts[parts.length - 1]] = value;
  return next;
}

/**
 * Text typed in 内容管理 is shown literally. Characters that have a special
 * meaning in message formatting ({ } < > and apostrophes) are escaped, so an
 * editor typing e.g. "{" or "<" can never break a page.
 */
export function escapeMessageText(text: string): string {
  return text.replace(/[{}<>']+/g, (run) =>
    /[{}<>]/.test(run) ? "'" + run.replace(/'/g, "''") + "'" : run.replace(/'/g, "''"),
  );
}

function isValidOverride(defaultValue: unknown, value: unknown): boolean {
  if (typeof defaultValue === "string" || defaultValue === undefined) {
    return typeof value === "string";
  }
  if (Array.isArray(defaultValue)) {
    return Array.isArray(value) && value.every((v) => typeof v === "string");
  }
  return false;
}

/**
 * Messages for the website: defaults + saved edits.
 * Never throws — falls back to the defaults if anything goes wrong.
 */
export async function getSiteMessages(locale: Locale): Promise<Messages> {
  const base = DEFAULTS[locale];
  try {
    const rows = await prisma.contentOverride.findMany({
      where: { locale: { in: [SHARED_LOCALE, locale] } },
      select: { locale: true, key: true, value: true },
    });

    // shared (image) values first, then language-specific texts
    rows.sort((a, b) => (a.locale === SHARED_LOCALE ? -1 : 0) - (b.locale === SHARED_LOCALE ? -1 : 0));

    let merged = base;
    for (const row of rows) {
      const defaultValue = getByPath(base, row.key);
      if (!isValidOverride(defaultValue, row.value)) continue;
      const value = typeof row.value === "string" && row.locale !== SHARED_LOCALE
        ? escapeMessageText(row.value)
        : row.value;
      merged = setByPath(merged, row.key, value);
    }
    return merged;
  } catch (error) {
    console.error("[cms] could not load content overrides, using defaults:", error);
    return base;
  }
}

function matches(key: string, prefixes: string[] | undefined): boolean {
  if (!prefixes) return false;
  return prefixes.some((p) => key === p || key.startsWith(p + "."));
}

function collectStringKeys(obj: unknown, prefix: string, out: Set<string>) {
  if (typeof obj === "string") {
    out.add(prefix);
    return;
  }
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj as Messages)) {
      collectStringKeys(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
}

/** all text keys (strings) that belong to a section, in file order */
export function sectionTextKeys(section: CmsSection): string[] {
  const imageKeys = allImageKeys();
  const ordered: string[] = [];
  const seen = new Set<string>();

  for (const locale of LOCALES) {
    const keys = new Set<string>();
    for (const include of section.include) {
      collectStringKeys(getByPath(DEFAULTS[locale], include), include, keys);
    }
    for (const key of keys) {
      if (seen.has(key)) continue;
      if (imageKeys.has(key)) continue;
      if (matches(key, section.exclude)) continue;
      seen.add(key);
      ordered.push(key);
    }
  }
  return ordered;
}

export function sectionKeys(section: CmsSection): Set<string> {
  const keys = new Set(sectionTextKeys(section));
  for (const image of section.images ?? []) keys.add(image.key);
  return keys;
}

export interface TextField {
  key: string;
  label: { zh: string; en: string };
  zh: string;
  en: string;
  zhDefault: string;
  enDefault: string;
  /** true when the language does not have this text in the default files */
  zhMissing: boolean;
  enMissing: boolean;
}

export interface ImageFieldValue {
  key: string;
  label: { zh: string; en: string };
  kind: "single" | "gallery";
  min: number;
  hint?: { zh: string; en: string };
  value: string[];
  defaultValue: string[];
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string" && value) return [value];
  return [];
}

export async function loadSectionContent(section: CmsSection) {
  const textKeys = sectionTextKeys(section);
  const imageFields = section.images ?? [];

  const rows = await prisma.contentOverride.findMany({
    where: {
      key: { in: [...textKeys, ...imageFields.map((i) => i.key)] },
    },
    select: { locale: true, key: true, value: true, updatedAt: true, updatedBy: true },
  });

  const find = (locale: string, key: string) =>
    rows.find((r) => r.locale === locale && r.key === key);

  const texts: TextField[] = textKeys.map((key) => {
    const zhDefault = getByPath(DEFAULTS.zh, key);
    const enDefault = getByPath(DEFAULTS.en, key);
    const zhRow = find("zh", key);
    const enRow = find("en", key);
    const zhD = typeof zhDefault === "string" ? zhDefault : "";
    const enD = typeof enDefault === "string" ? enDefault : "";
    return {
      key,
      label: labelForKey(key, section.include),
      zh: typeof zhRow?.value === "string" ? zhRow.value : zhD,
      en: typeof enRow?.value === "string" ? enRow.value : enD,
      zhDefault: zhD,
      enDefault: enD,
      zhMissing: typeof zhDefault !== "string",
      enMissing: typeof enDefault !== "string",
    };
  });

  const images: ImageFieldValue[] = imageFields.map((field) => {
    const defaultValue = asList(getByPath(DEFAULTS.zh, field.key));
    const row = find(SHARED_LOCALE, field.key);
    const saved = row ? asList(row.value) : null;
    return {
      key: field.key,
      label: field.label,
      kind: field.kind,
      min: field.kind === "single" ? 1 : field.min ?? 0,
      hint: field.hint,
      value: saved ?? defaultValue,
      defaultValue,
    };
  });

  const last = rows
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

  return {
    texts,
    images,
    lastUpdated: last ? { at: last.updatedAt.toISOString(), by: last.updatedBy } : null,
  };
}

/** allowed image paths: site images ("/...") or uploaded files ("/uploads/...") */
export function isSafeImagePath(value: string): boolean {
  if (typeof value !== "string") return false;
  if (value.length > 300) return false;
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (value.includes("..") || value.includes("\\")) return false;
  return /^\/[A-Za-z0-9/_\-. ()%一-龥]+$/.test(value);
}

export const MAX_TEXT_LENGTH = 20000;
