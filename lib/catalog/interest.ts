/**
 * Values of the "选择解决方案 / 选择产品" dropdowns on the contact form.
 *
 * Built-in products / solutions keep their original short values
 * (e.g. "sentinel", "urban") so older inquiries and statistics stay the same.
 * Items added in 内容管理 are stored by their Chinese name, "other" means 其他.
 * This file is used in the browser too (no database imports).
 */

export const OTHER_INTEREST = "other";

const NAMES: Record<string, { zh: string; en: string }> = {
  sentinel: { zh: "360哨兵", en: "360 Sentinel" },
  dome: { zh: "云瞰", en: "Dome Watch" },
  guardian: { zh: "广域卫士", en: "Wide-area Guardian" },
  urban: { zh: "城市公共空间", en: "Urban Public Spaces" },
  transportation: { zh: "交通枢纽与关键场所", en: "Transportation Hubs & Critical Sites" },
  campuses: { zh: "校园与教育机构", en: "Campuses & Educational Institutions" },
  healthcare: { zh: "医疗与养老设施", en: "Healthcare & Senior Care" },
  security: { zh: "高安全场所", en: "High-Security Facilities" },
  industrial: { zh: "商业与工业场景", en: "Commercial & Industrial Worksites" },
  [OTHER_INTEREST]: { zh: "其他", en: "Other" },
};

/** readable name of a stored dropdown value (unknown values are shown as they are) */
export function interestLabel(value: string | null | undefined, lang: string): string {
  if (!value) return "";
  const known = NAMES[value];
  if (!known) return value;
  return lang === "zh" ? known.zh : known.en;
}

export interface InterestOption {
  value: string;
  label: string;
}
