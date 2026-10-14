/**
 * Products and solutions added in 内容管理.
 *
 * The form in the admin panel, the server-side checks and the public pages
 * are all driven by the field lists below, so they always stay in sync.
 * This file is shared by the browser and the server (no database imports).
 */

export type CatalogKind = "product" | "solution";
export const CATALOG_KINDS: CatalogKind[] = ["product", "solution"];

export type Lang = "zh" | "en";
export type Bilingual = { zh: string; en: string };

export interface TextFieldDef {
  type: "text";
  key: string;
  label: Bilingual;
  multiline?: boolean;
  required?: boolean;
  /** pre-filled when a new item is created */
  initial?: Bilingual;
  placeholder?: Bilingual;
}

export interface PlainFieldDef {
  type: "plain";
  key: string;
  label: Bilingual;
  required?: boolean;
  placeholder?: Bilingual;
}

export interface ImagesFieldDef {
  type: "images";
  key: string;
  label: Bilingual;
  min: number;
  max: number;
  hint?: Bilingual;
}

export interface ListFieldDef {
  type: "list";
  key: string;
  label: Bilingual;
  /** columns of one row; every column has a 中文 and an English value */
  columns: { key: string; label: Bilingual; multiline?: boolean }[];
  max: number;
  addLabel: Bilingual;
}

export type FieldDef = TextFieldDef | PlainFieldDef | ImagesFieldDef | ListFieldDef;

export interface FormGroup {
  id: string;
  title: Bilingual;
  description?: Bilingual;
  fields: FieldDef[];
}

/* ------------------------------------------------------------------ */

const L = (zh: string, en: string): Bilingual => ({ zh, en });

const productImageHint = L(
  "建议使用正方形（1:1，约 1000×1000 像素）、白色或透明背景的产品图（PNG 最佳），与原有产品图片保持一致。不要使用风景或场景照片。JPG / PNG / WebP，单张不超过 10MB；可上传多张自动轮播，第一张同时用作列表封面。",
  "Use a square (1:1, about 1000×1000 px) product photo on a white or transparent background (PNG is best), like the existing products. Avoid landscape or scene photos. JPG / PNG / WebP, max 10MB each; several images rotate automatically, the first one is also the list cover.",
);

const solutionImageHint = L(
  "建议使用横向场景照片（约 1600×1000 像素以上），图片会自动裁切铺满。JPG / PNG / WebP，单张不超过 10MB；可上传多张自动轮播，第一张同时用作列表封面。",
  "Use a landscape scene photo (about 1600×1000 px or larger); it is cropped to fill the frame. JPG / PNG / WebP, max 10MB each; several images rotate automatically, the first one is also the list cover.",
);

export const PRODUCT_FORM: FormGroup[] = [
  {
    id: "basic",
    title: L("基本信息（产品列表与页面顶部）", "Basic information (product list and page top)"),
    description: L(
      "名称、型号和简介会显示在“产品中心”列表和页脚菜单中。",
      "Name, model and summary appear in the product list and the footer menu.",
    ),
    fields: [
      { type: "text", key: "name", label: L("产品名称", "Product name"), required: true },
      { type: "plain", key: "model", label: L("产品型号", "Model"), placeholder: L("例如 YYZK-XXXX-V1.0", "e.g. YYZK-XXXX-V1.0") },
      { type: "text", key: "summary", label: L("列表简介", "List summary"), multiline: true, required: true },
      { type: "images", key: "images", label: L("产品图片", "Product images"), min: 1, max: 12, hint: productImageHint },
    ],
  },
  {
    id: "hero",
    title: L("页面顶部", "Page top"),
    fields: [
      { type: "text", key: "heroLabel", label: L("顶部小标题", "Small heading") },
      { type: "text", key: "heroDescription", label: L("顶部介绍", "Introduction"), multiline: true },
      { type: "text", key: "heroButton", label: L("按钮文字（链接到联系我们）", "Button text (links to Contact)"), initial: L("申请演示", "Request Demo") },
    ],
  },
  {
    id: "overview",
    title: L("产品概述", "Overview"),
    description: L("留空则不显示此部分。", "Leave empty to hide this part."),
    fields: [
      { type: "text", key: "overviewTitle", label: L("标题", "Title"), initial: L("产品概述", "Product Overview") },
      { type: "text", key: "overviewDescription", label: L("内容", "Content"), multiline: true },
    ],
  },
  {
    id: "advantages",
    title: L("核心优势", "Advantages"),
    description: L("没有条目则不显示此部分。", "Hidden when there are no rows."),
    fields: [
      { type: "text", key: "advantagesTitle", label: L("标题", "Title"), initial: L("核心技术能力", "Core Technology Capabilities") },
      {
        type: "list",
        key: "advantages",
        label: L("优势条目", "Advantage rows"),
        columns: [
          { key: "title", label: L("标题", "Title") },
          { key: "description", label: L("说明", "Description"), multiline: true },
        ],
        max: 20,
        addLabel: L("添加优势", "Add advantage"),
      },
    ],
  },
  {
    id: "specs",
    title: L("技术参数", "Specifications"),
    description: L("没有条目则不显示此部分。", "Hidden when there are no rows."),
    fields: [
      { type: "text", key: "specsTitle", label: L("标题", "Title"), initial: L("技术参数", "Technical Specifications") },
      { type: "text", key: "specsParameter", label: L("表头：参数", "Column: parameter"), initial: L("参数", "Parameter") },
      { type: "text", key: "specsValue", label: L("表头：详情", "Column: value"), initial: L("详情", "Value") },
      {
        type: "list",
        key: "specs",
        label: L("参数条目", "Specification rows"),
        columns: [
          { key: "label", label: L("参数名称", "Parameter") },
          { key: "value", label: L("参数值", "Value") },
        ],
        max: 40,
        addLabel: L("添加参数", "Add specification"),
      },
    ],
  },
  {
    id: "comparison",
    title: L("对比", "Comparison"),
    description: L("没有条目则不显示此部分。", "Hidden when there are no rows."),
    fields: [
      { type: "text", key: "comparisonTitle", label: L("标题", "Title"), initial: L("传统监控与本产品对比", "Traditional Monitoring vs This Product") },
      { type: "text", key: "comparisonTraditional", label: L("左列表头", "Left column"), initial: L("传统监控", "Traditional Monitoring") },
      { type: "text", key: "comparisonProduct", label: L("右列表头（留空 = 产品名称）", "Right column (empty = product name)") },
      {
        type: "list",
        key: "comparison",
        label: L("对比条目", "Comparison rows"),
        columns: [
          { key: "traditional", label: L("传统方式", "Traditional") },
          { key: "product", label: L("本产品", "This product") },
        ],
        max: 20,
        addLabel: L("添加对比", "Add comparison"),
      },
    ],
  },
];

export const SOLUTION_FORM: FormGroup[] = [
  {
    id: "basic",
    title: L("基本信息（解决方案列表）", "Basic information (solution list)"),
    description: L(
      "名称、简介和图片会显示在“解决方案”列表和页脚菜单中。",
      "Name, summary and images appear in the solution list and the footer menu.",
    ),
    fields: [
      { type: "text", key: "name", label: L("方案名称", "Solution name"), required: true },
      { type: "text", key: "summary", label: L("列表简介", "List summary"), multiline: true, required: true },
      { type: "images", key: "images", label: L("方案图片", "Solution images"), min: 1, max: 12, hint: solutionImageHint },
    ],
  },
  {
    id: "hero",
    title: L("页面顶部", "Page top"),
    fields: [
      { type: "text", key: "heroLabel", label: L("顶部小标题", "Small heading") },
      { type: "text", key: "heroTitle", label: L("大标题（留空 = 方案名称）", "Main title (empty = solution name)"), multiline: true },
      { type: "text", key: "heroDescription", label: L("顶部介绍", "Introduction"), multiline: true },
      { type: "text", key: "heroButton", label: L("按钮文字（链接到联系我们）", "Button text (links to Contact)"), initial: L("联系我们", "Contact Us") },
    ],
  },
  {
    id: "overview",
    title: L("方案概述", "Overview"),
    description: L("留空则不显示此部分。", "Leave empty to hide this part."),
    fields: [
      { type: "text", key: "overviewLabel", label: L("小标题", "Small heading"), initial: L("方案概述", "Solution Overview") },
      { type: "text", key: "overviewTitle", label: L("标题", "Title") },
      { type: "text", key: "overviewDescription", label: L("内容", "Content"), multiline: true },
      { type: "text", key: "highlightTitle", label: L("右侧亮点标题", "Highlight title") },
      { type: "text", key: "highlight", label: L("右侧亮点内容", "Highlight text"), multiline: true },
    ],
  },
  {
    id: "coverage",
    title: L("应用范围", "Coverage"),
    description: L("没有条目则不显示此部分。", "Hidden when there are no rows."),
    fields: [
      { type: "text", key: "coverageLabel", label: L("小标题", "Small heading"), initial: L("应用范围", "Application Coverage") },
      { type: "text", key: "coverageTitle", label: L("标题", "Title") },
      {
        type: "list",
        key: "coverage",
        label: L("应用场景", "Application scenes"),
        columns: [{ key: "title", label: L("场景名称", "Scene") }],
        max: 16,
        addLabel: L("添加场景", "Add scene"),
      },
    ],
  },
  {
    id: "capabilities",
    title: L("核心能力", "Capabilities"),
    description: L("没有条目则不显示此部分。", "Hidden when there are no rows."),
    fields: [
      { type: "text", key: "capabilitiesLabel", label: L("小标题", "Small heading"), initial: L("核心能力", "Core Capabilities") },
      { type: "text", key: "capabilitiesTitle", label: L("标题", "Title") },
      {
        type: "list",
        key: "capabilities",
        label: L("能力条目", "Capability rows"),
        columns: [
          { key: "title", label: L("标题", "Title") },
          { key: "description", label: L("说明", "Description"), multiline: true },
        ],
        max: 12,
        addLabel: L("添加能力", "Add capability"),
      },
    ],
  },
  {
    id: "values",
    title: L("核心价值", "Value"),
    description: L("没有条目则不显示此部分。", "Hidden when there are no rows."),
    fields: [
      { type: "text", key: "valuesLabel", label: L("小标题", "Small heading"), initial: L("方案核心价值", "Core Value") },
      { type: "text", key: "valuesTitle", label: L("标题", "Title") },
      {
        type: "list",
        key: "values",
        label: L("价值条目", "Value rows"),
        columns: [
          { key: "title", label: L("标题", "Title") },
          { key: "description", label: L("说明", "Description"), multiline: true },
        ],
        max: 12,
        addLabel: L("添加价值", "Add value"),
      },
    ],
  },
  {
    id: "cta",
    title: L("底部联系区域", "Bottom call to action"),
    description: L("标题留空则不显示此部分。", "Hidden when the title is empty."),
    fields: [
      { type: "text", key: "ctaTitle", label: L("标题", "Title") },
      { type: "text", key: "ctaDescription", label: L("说明", "Description"), multiline: true },
      { type: "text", key: "ctaButton", label: L("按钮文字", "Button text"), initial: L("申请演示", "Request Demo") },
    ],
  },
];

export function formFor(kind: CatalogKind): FormGroup[] {
  return kind === "product" ? PRODUCT_FORM : SOLUTION_FORM;
}

export function fieldsFor(kind: CatalogKind): FieldDef[] {
  return formFor(kind).flatMap((group) => group.fields);
}

/* ------------------------------------------------------------------ */
/* stored data                                                         */

export type ListRow = Record<string, Bilingual>;

/** everything about one added product / solution */
export type CatalogData = Record<string, Bilingual | string | string[] | ListRow[]>;

export const MAX_FIELD_LENGTH = 5000;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_SLUG_LENGTH = 80;

export function emptyData(kind: CatalogKind): CatalogData {
  const data: CatalogData = {};
  for (const field of fieldsFor(kind)) {
    if (field.type === "text") data[field.key] = field.initial ? { ...field.initial } : { zh: "", en: "" };
    else if (field.type === "plain") data[field.key] = "";
    else data[field.key] = [];
  }
  return data;
}

function isBilingual(value: unknown): value is Bilingual {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Bilingual).zh === "string" &&
    typeof (value as Bilingual).en === "string"
  );
}

function cleanText(value: string) {
  // normalise line endings and trim spaces at the ends
  return value.replace(/\r\n?/g, "\n").trim();
}

export type ValidationError = { field: string; code: string };

/**
 * Checks and cleans data coming from the admin form.
 * `isImageAllowed` is passed in by the server (path safety check).
 */
export function validateData(
  kind: CatalogKind,
  input: unknown,
  isImageAllowed: (path: string) => boolean,
): { data: CatalogData } | { error: ValidationError } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: { field: "", code: "BAD_DATA" } };
  }
  const source = input as Record<string, unknown>;
  const data: CatalogData = {};

  for (const field of fieldsFor(kind)) {
    const raw = source[field.key];

    if (field.type === "text") {
      const value = raw === undefined ? { zh: "", en: "" } : raw;
      if (!isBilingual(value)) return { error: { field: field.key, code: "BAD_TEXT" } };
      const zh = cleanText(value.zh);
      const en = cleanText(value.en);
      if (zh.length > MAX_FIELD_LENGTH || en.length > MAX_FIELD_LENGTH) {
        return { error: { field: field.key, code: "TOO_LONG" } };
      }
      if (field.required && (!zh || !en)) return { error: { field: field.key, code: "REQUIRED" } };
      data[field.key] = { zh, en };
      continue;
    }

    if (field.type === "plain") {
      const value = raw === undefined ? "" : raw;
      if (typeof value !== "string") return { error: { field: field.key, code: "BAD_TEXT" } };
      const clean = cleanText(value);
      if (clean.length > 300) return { error: { field: field.key, code: "TOO_LONG" } };
      if (field.required && !clean) return { error: { field: field.key, code: "REQUIRED" } };
      data[field.key] = clean;
      continue;
    }

    if (field.type === "images") {
      const value = raw === undefined ? [] : raw;
      if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
        return { error: { field: field.key, code: "BAD_IMAGES" } };
      }
      if (!value.every((v) => isImageAllowed(v))) return { error: { field: field.key, code: "BAD_IMAGE_PATH" } };
      if (value.length < field.min) return { error: { field: field.key, code: "MIN_IMAGES" } };
      if (value.length > field.max) return { error: { field: field.key, code: "MAX_IMAGES" } };
      data[field.key] = [...value];
      continue;
    }

    // list
    const value = raw === undefined ? [] : raw;
    if (!Array.isArray(value)) return { error: { field: field.key, code: "BAD_LIST" } };
    if (value.length > field.max) return { error: { field: field.key, code: "MAX_ROWS" } };
    const rows: ListRow[] = [];
    for (const row of value) {
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        return { error: { field: field.key, code: "BAD_LIST" } };
      }
      const clean: ListRow = {};
      let filled = false;
      for (const column of field.columns) {
        const cell = (row as Record<string, unknown>)[column.key] ?? { zh: "", en: "" };
        if (!isBilingual(cell)) return { error: { field: field.key, code: "BAD_LIST" } };
        const zh = cleanText(cell.zh);
        const en = cleanText(cell.en);
        if (zh.length > MAX_FIELD_LENGTH || en.length > MAX_FIELD_LENGTH) {
          return { error: { field: field.key, code: "TOO_LONG" } };
        }
        if (zh || en) filled = true;
        clean[column.key] = { zh, en };
      }
      // completely empty rows are dropped silently
      if (filled) rows.push(clean);
    }
    data[field.key] = rows;
  }

  return { data };
}

/* ------------------------------------------------------------------ */
/* reading data on the website                                         */

/** text in the requested language, falling back to the other language */
export function pick(value: unknown, lang: Lang): string {
  if (!isBilingual(value)) return "";
  const own = value[lang].trim();
  if (own) return own;
  return value[lang === "zh" ? "en" : "zh"].trim();
}

export function plain(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function images(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.length > 0) : [];
}

export function rows(value: unknown): ListRow[] {
  return Array.isArray(value)
    ? value.filter((r): r is ListRow => !!r && typeof r === "object" && !Array.isArray(r))
    : [];
}

/** turns a name into an address part, e.g. "Smart Gate X1" → "smart-gate-x1" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, "");
}
