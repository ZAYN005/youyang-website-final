"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import CatalogManager from "./CatalogManager";
import CatalogEditor from "./CatalogEditor";
import type { CatalogKind } from "@/lib/catalog/schema";


type Bilingual = { zh: string; en: string };

interface TreeSection {
  id: string;
  /** section = existing page texts/images, manager = 产品/方案管理, added = item added in 内容管理 */
  type?: "section" | "manager" | "added";
  title: Bilingual;
  edited: number;
  hidden?: boolean;
}

interface TreeGroup {
  id: string;
  title: Bilingual;
  sections: TreeSection[];
}

interface TextField {
  key: string;
  label: Bilingual;
  zh: string;
  en: string;
  zhDefault: string;
  enDefault: string;
  zhMissing: boolean;
  enMissing: boolean;
}

interface ImageField {
  key: string;
  label: Bilingual;
  kind: "single" | "gallery";
  min: number;
  hint?: Bilingual;
  value: string[];
  defaultValue: string[];
}

interface SectionData {
  section: {
    id: string;
    title: Bilingual;
    description: Bilingual | null;
    previewPath: string | null;
  };
  texts: TextField[];
  images: ImageField[];
  lastUpdated: { at: string; by: string | null } | null;
}

type Toast = { type: "success" | "error"; message: string } | null;

type TextDraft = Record<string, { zh: string; en: string }>;
type ImageDraft = Record<string, string[]>;


type Selection =
  | { mode: "section"; id: string }
  | { mode: "manager"; kind: CatalogKind }
  | { mode: "item"; kind: CatalogKind; itemId: string }
  | { mode: "new"; kind: CatalogKind };

function isKind(value: string): value is CatalogKind {
  return value === "product" || value === "solution";
}

/** catalog:product · item:product:<id> · new:product · or a normal section id */
function parseSelection(id: string): Selection {
  const [prefix, kind, itemId] = id.split(":");
  if (prefix === "catalog" && isKind(kind)) return { mode: "manager", kind };
  if (prefix === "new" && isKind(kind)) return { mode: "new", kind };
  if (prefix === "item" && isKind(kind) && itemId) return { mode: "item", kind, itemId };
  return { mode: "section", id };
}


function sameList(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function rowsFor(text: string) {
  const lines = text.split("\n").length;
  const wrapped = Math.ceil(text.length / 48);
  return Math.min(14, Math.max(2, lines, wrapped));
}


export default function ContentManager() {

  const t = useTranslations("contentAdmin");
  const locale = useLocale() === "zh" ? "zh" : "en";

  const [tree, setTree] = useState<TreeGroup[] | null>(null);
  const [treeError, setTreeError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [data, setData] = useState<SectionData | null>(null);
  const [loadingSection, setLoadingSection] = useState(false);
  const [sectionError, setSectionError] = useState(false);

  const [texts, setTexts] = useState<TextDraft>({});
  const [images, setImages] = useState<ImageDraft>({});

  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const [childDirty, setChildDirty] = useState(false);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);


  // ---------- dirty state ----------

  const changedTextKeys = useMemo(() => {
    if (!data) return [] as string[];
    return data.texts
      .filter((f) => texts[f.key] && (texts[f.key].zh !== f.zh || texts[f.key].en !== f.en))
      .map((f) => f.key);
  }, [data, texts]);

  const changedImageKeys = useMemo(() => {
    if (!data) return [] as string[];
    return data.images
      .filter((f) => images[f.key] && !sameList(images[f.key], f.value))
      .map((f) => f.key);
  }, [data, images]);

  const sectionDirty = changedTextKeys.length > 0 || changedImageKeys.length > 0;
  const dirty = sectionDirty || childDirty;

  const selection = selectedId ? parseSelection(selectedId) : null;


  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);


  // ---------- loading ----------

  const loadTree = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setTree(json.groups);
      setTreeError(false);
      return json.groups as TreeGroup[];
    } catch {
      setTreeError(true);
      return null;
    }
  }, []);


  const applySection = useCallback((json: SectionData) => {
    setData(json);
    const nextTexts: TextDraft = {};
    for (const f of json.texts) nextTexts[f.key] = { zh: f.zh, en: f.en };
    const nextImages: ImageDraft = {};
    for (const f of json.images) nextImages[f.key] = [...f.value];
    setTexts(nextTexts);
    setImages(nextImages);
  }, []);


  const loadSection = useCallback(async (id: string) => {
    setLoadingSection(true);
    setSectionError(false);
    try {
      const res = await fetch(`/api/admin/content/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      applySection(await res.json());
    } catch {
      setData(null);
      setSectionError(true);
    } finally {
      setLoadingSection(false);
    }
  }, [applySection]);


  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/content", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json: { groups: TreeGroup[] }) => {
        if (cancelled) return;
        setTree(json.groups);
        const first = json.groups?.[0]?.sections?.[0]?.id;
        if (first) {
          setSelectedId(first);
          loadSection(first);
        }
      })
      .catch(() => {
        if (!cancelled) setTreeError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [loadSection]);


  function selectSection(id: string, force = false) {
    if (id === selectedId) return;
    if (!force && dirty && !window.confirm(t("unsavedConfirm"))) return;
    setChildDirty(false);
    setSelectedId(id);
    setFilter("");
    const next = parseSelection(id);
    if (next.mode === "section") {
      loadSection(id);
    } else {
      // products / solutions screens manage their own data
      setData(null);
      setSectionError(false);
      setLoadingSection(false);
    }
  }


  // ---------- saving ----------

  async function save() {
    if (!data || !sectionDirty || saving) return;

    for (const field of data.images) {
      const list = images[field.key] ?? [];
      if (list.length < field.min) {
        showToast("error", `${field.label[locale]}：${t("minImages", { min: field.min })}`);
        return;
      }
    }

    const body: { texts: TextDraft; images: ImageDraft } = { texts: {}, images: {} };
    for (const key of changedTextKeys) body.texts[key] = texts[key];
    for (const key of changedImageKeys) body.images[key] = images[key];

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${data.section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      applySection({ ...json, section: data.section });
      showToast("success", t("saved"));
      loadTree();
    } catch {
      showToast("error", t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }


  async function resetSection() {
    if (!data || saving) return;
    if (!window.confirm(t("resetConfirm"))) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${data.section.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      applySection({ ...json, section: data.section });
      showToast("success", t("resetDone"));
      loadTree();
    } catch {
      showToast("error", t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }


  function discard() {
    if (data) applySection(data);
  }


  // ---------- texts ----------

  function setText(key: string, lang: "zh" | "en", value: string) {
    setTexts((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));
  }

  function restoreText(field: TextField) {
    setTexts((prev) => ({ ...prev, [field.key]: { zh: field.zhDefault, en: field.enDefault } }));
  }


  // ---------- images ----------

  async function uploadFiles(field: ImageField, files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingKey(field.key);

    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          showToast("error", t("tooLarge"));
          continue;
        }
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/content/upload", { method: "POST", body: form });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          showToast(
            "error",
            json.code === "TOO_LARGE" ? t("tooLarge") : json.code === "BAD_TYPE" ? t("badType") : t("uploadFailed"),
          );
          continue;
        }
        const json = await res.json();
        uploaded.push(json.url);
        if (field.kind === "single") break;
      }
    } catch {
      showToast("error", t("uploadFailed"));
    } finally {
      setUploadingKey(null);
    }

    if (uploaded.length) {
      setImages((prev) => ({
        ...prev,
        [field.key]: field.kind === "single" ? [uploaded[0]] : [...(prev[field.key] ?? []), ...uploaded],
      }));
    }
  }

  function removeImage(field: ImageField, index: number) {
    const list = images[field.key] ?? [];
    if (list.length - 1 < field.min) {
      showToast("error", t("minImages", { min: field.min }));
      return;
    }
    setImages((prev) => ({ ...prev, [field.key]: list.filter((_, i) => i !== index) }));
  }

  function moveImage(field: ImageField, index: number, direction: -1 | 1) {
    const list = [...(images[field.key] ?? [])];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    setImages((prev) => ({ ...prev, [field.key]: list }));
  }

  function restoreImages(field: ImageField) {
    setImages((prev) => ({ ...prev, [field.key]: [...field.defaultValue] }));
  }


  // ---------- filtering ----------

  const visibleTexts = useMemo(() => {
    if (!data) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return data.texts;
    return data.texts.filter((f) => {
      const draft = texts[f.key];
      return (
        f.label.zh.toLowerCase().includes(q) ||
        f.label.en.toLowerCase().includes(q) ||
        (draft?.zh ?? "").toLowerCase().includes(q) ||
        (draft?.en ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, filter, texts]);


  // ---------- render ----------

  return (

    <div className="pb-28">

      {/* Page title */}
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-400">CMS</p>
        <h1 className="mt-4 text-5xl font-bold text-white">{t("title")}</h1>
        <p className="mt-3 text-slate-400">{t("subtitle")}</p>
      </div>


      <div className="mt-10 grid gap-8 xl:grid-cols-[300px_1fr]">


        {/* ---------- content tree ---------- */}
        <aside className="h-fit rounded-3xl border border-cyan-400/20 bg-white/5 p-5 xl:sticky xl:top-10">

          <p className="px-2 text-xs uppercase tracking-[0.3em] text-slate-400">{t("sections")}</p>

          {treeError && <p className="mt-4 px-2 text-sm text-red-400">{t("loadFailed")}</p>}
          {!tree && !treeError && <p className="mt-4 px-2 text-sm text-slate-400">{t("loading")}</p>}

          <nav className="mt-4 space-y-5">
            {tree?.map((group, groupIndex) => (
              <div key={group.id}>
                <p className="px-2 text-sm font-bold text-white">
                  <span className="mr-2 text-cyan-400">{["一", "二", "三", "四", "五", "六"][groupIndex] ?? groupIndex + 1}、</span>
                  {group.title[locale]}
                </p>

                <div className="mt-2 space-y-1">
                  {group.sections.map((section) => {
                    const active =
                      section.id === selectedId ||
                      (section.type === "manager" && selection?.mode === "new" && section.id === `catalog:${selection.kind}`);
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => selectSection(section.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                          active
                            ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                            : "border-transparent text-slate-300 hover:bg-white/5 hover:text-cyan-300"
                        }`}
                      >
                        <span className={`flex items-center gap-2 ${section.hidden ? "opacity-60" : ""}`}>
                          {section.type === "manager" && <span className="text-cyan-400">⚙</span>}
                          {section.title[locale]}
                        </span>
                        {section.type === "added" && !section.hidden && (
                          <span className="shrink-0 rounded-full bg-cyan-400/15 px-2 py-0.5 text-[11px] text-cyan-300">
                            {t("catalog.added")}
                          </span>
                        )}
                        {section.hidden && (
                          <span className="shrink-0 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">
                            {t("catalog.hidden")}
                          </span>
                        )}
                        {section.edited > 0 && (
                          <span className="shrink-0 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">
                            {t("edited", { count: section.edited })}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

        </aside>


        {/* ---------- editor ---------- */}
        <section className="min-w-0">

          {selection?.mode === "manager" && (
            <CatalogManager
              key={selection.kind}
              kind={selection.kind}
              lang={locale}
              notify={showToast}
              onChanged={loadTree}
              onCreate={() => selectSection(`new:${selection.kind}`)}
              onOpenItem={(itemId) => selectSection(`item:${selection.kind}:${itemId}`)}
              onOpenSection={(sectionId) => selectSection(sectionId)}
            />
          )}

          {(selection?.mode === "item" || selection?.mode === "new") && (
            <CatalogEditor
              key={selection.mode === "item" ? selection.itemId : `new-${selection.kind}`}
              kind={selection.kind}
              id={selection.mode === "item" ? selection.itemId : null}
              lang={locale}
              notify={showToast}
              onDirtyChange={setChildDirty}
              onBack={() => selectSection(`catalog:${selection.kind}`)}
              onSaved={(itemId) => {
                loadTree();
                selectSection(`item:${selection.kind}:${itemId}`, true);
              }}
              onDeleted={() => {
                loadTree();
                selectSection(`catalog:${selection.kind}`, true);
              }}
            />
          )}

          {selection?.mode === "section" && loadingSection && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-slate-400">{t("loading")}</div>
          )}

          {selection?.mode === "section" && !loadingSection && sectionError && (
            <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-10 text-red-300">{t("loadFailed")}</div>
          )}

          {(!selection || selection.mode === "section") && !loadingSection && !sectionError && !data && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-slate-400">{t("selectSection")}</div>
          )}

          {selection?.mode === "section" && !loadingSection && data && (
            <div className="space-y-8">

              {/* Section header */}
              <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold">{data.section.title[locale]}</h2>
                    {data.section.description && (
                      <p className="mt-3 text-slate-400">{data.section.description[locale]}</p>
                    )}
                    {data.lastUpdated && (
                      <p className="mt-3 text-xs text-slate-500">
                        {t("lastUpdated", {
                          at: new Date(data.lastUpdated.at).toLocaleString(),
                          by: data.lastUpdated.by ?? "-",
                        })}
                      </p>
                    )}
                  </div>

                  {data.section.previewPath !== null && (
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`/zh${data.section.previewPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
                      >
                        {t("preview")} ↗
                      </a>
                      <a
                        href={`/en${data.section.previewPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                      >
                        {t("previewEn")} ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>


              {/* Images */}
              {data.images.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                  <h3 className="text-xl font-bold">{t("images")}</h3>

                  <div className="mt-6 space-y-8">
                    {data.images.map((field) => {
                      const list = images[field.key] ?? [];
                      const changed = !sameList(list, field.value);
                      const isDefault = sameList(list, field.defaultValue);
                      const uploading = uploadingKey === field.key;
                      const canAdd = field.kind === "gallery" || list.length === 0;

                      return (
                        <div key={field.key} className="border-t border-white/10 pt-6 first:border-t-0 first:pt-0">

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <p className="font-semibold">{field.label[locale]}</p>
                              {!isDefault && (
                                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">{t("modified")}</span>
                              )}
                              {changed && <span className="text-[11px] text-cyan-300">●</span>}
                            </div>

                            {!isDefault && (
                              <button
                                type="button"
                                onClick={() => restoreImages(field)}
                                className="text-xs text-slate-400 underline-offset-4 hover:text-cyan-300 hover:underline"
                              >
                                {t("restoreField")}
                              </button>
                            )}
                          </div>

                          {field.hint && <p className="mt-2 text-xs text-slate-500">{field.hint[locale]}</p>}

                          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">

                            {list.map((src, index) => (
                              <div key={`${src}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]">
                                <div className="flex h-36 items-center justify-center bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:16px_16px]">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={src} alt="" className="h-full w-full object-contain" />
                                </div>

                                <div className="flex items-center justify-between gap-1 p-2 text-xs">
                                  {field.kind === "gallery" ? (
                                    <div className="flex gap-1">
                                      <button
                                        type="button"
                                        title={t("moveLeft")}
                                        disabled={index === 0}
                                        onClick={() => moveImage(field, index, -1)}
                                        className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                                      >
                                        ←
                                      </button>
                                      <button
                                        type="button"
                                        title={t("moveRight")}
                                        disabled={index === list.length - 1}
                                        onClick={() => moveImage(field, index, 1)}
                                        className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                                      >
                                        →
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="cursor-pointer rounded-lg px-2 py-1 text-cyan-300 hover:bg-cyan-400/10">
                                      {uploading ? t("uploading") : t("replace")}
                                      <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        className="hidden"
                                        disabled={uploading}
                                        onChange={(e) => {
                                          uploadFiles(field, e.target.files);
                                          e.target.value = "";
                                        }}
                                      />
                                    </label>
                                  )}

                                  {field.kind === "gallery" && (
                                    <button
                                      type="button"
                                      onClick={() => removeImage(field, index)}
                                      className="rounded-lg px-2 py-1 text-red-300 hover:bg-red-500/15"
                                    >
                                      {t("remove")}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                            {canAdd && (
                              <label
                                className={`flex h-[188px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-sm transition ${
                                  uploading
                                    ? "border-cyan-400/40 text-cyan-300"
                                    : "border-white/15 text-slate-400 hover:border-cyan-400/60 hover:text-cyan-300"
                                }`}
                              >
                                <span className="text-3xl leading-none">+</span>
                                <span className="mt-2">{uploading ? t("uploading") : t("addImages")}</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/gif"
                                  multiple={field.kind === "gallery"}
                                  className="hidden"
                                  disabled={uploading}
                                  onChange={(e) => {
                                    uploadFiles(field, e.target.files);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                            )}

                          </div>

                          {list.length === 0 && field.kind === "gallery" && (
                            <p className="mt-3 text-xs text-slate-500">{t("noImages")}</p>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* Texts */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-xl font-bold">
                    {t("texts")}
                    <span className="ml-3 text-sm font-normal text-slate-500">{data.texts.length}</span>
                  </h3>

                  {data.texts.length > 6 && (
                    <input
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder={t("searchPlaceholder")}
                      className="input max-w-xs"
                    />
                  )}
                </div>

                {data.texts.length === 0 && <p className="mt-6 text-slate-400">{t("noFields")}</p>}
                {data.texts.length > 0 && visibleTexts.length === 0 && (
                  <p className="mt-6 text-slate-400">{t("noMatch")}</p>
                )}

                <div className="mt-6 space-y-5">
                  {visibleTexts.map((field) => {
                    const draft = texts[field.key] ?? { zh: field.zh, en: field.en };
                    const isDefault = draft.zh === field.zhDefault && draft.en === field.enDefault;
                    const changed = draft.zh !== field.zh || draft.en !== field.en;

                    return (
                      <div key={field.key} className="rounded-2xl border border-white/10 bg-[#0b1220]/60 p-5">

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="font-semibold text-white">{field.label[locale]}</p>
                            {!isDefault && (
                              <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">{t("modified")}</span>
                            )}
                            {changed && <span className="text-[11px] text-cyan-300">●</span>}
                          </div>

                          {!isDefault && (
                            <button
                              type="button"
                              onClick={() => restoreText(field)}
                              className="text-xs text-slate-400 underline-offset-4 hover:text-cyan-300 hover:underline"
                            >
                              {t("restoreField")}
                            </button>
                          )}
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          {(["zh", "en"] as const).map((lang) => (
                            <label key={lang} className="block">
                              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                                {lang === "zh" ? t("chinese") : t("english")}
                                {(lang === "zh" ? field.zhMissing : field.enMissing) && (
                                  <span className="normal-case tracking-normal text-slate-600">· {t("missingInLanguage")}</span>
                                )}
                              </span>
                              <textarea
                                value={draft[lang]}
                                rows={rowsFor(draft[lang])}
                                onChange={(e) => setText(field.key, lang, e.target.value)}
                                className="input resize-y leading-relaxed"
                              />
                            </label>
                          ))}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>


              {/* Danger zone */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={resetSection}
                  disabled={saving}
                  className="rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-40"
                >
                  {t("reset")}
                </button>
              </div>

            </div>
          )}

        </section>

      </div>


      {/* Save bar */}
      {selection?.mode === "section" && data && (
        <div
          className={`fixed bottom-0 left-72 right-0 z-40 border-t px-10 py-4 backdrop-blur-xl transition ${
            sectionDirty ? "border-cyan-400/30 bg-[#020617]/95" : "border-white/5 bg-[#020617]/80"
          }`}
        >
          <div className="flex items-center justify-between gap-6">
            <p className={sectionDirty ? "text-cyan-300" : "text-slate-500"}>
              {sectionDirty ? `● ${t("unsavedBar")}（${changedTextKeys.length + changedImageKeys.length}）` : data.section.title[locale]}
            </p>

            <div className="flex gap-3">
              {sectionDirty && (
                <button
                  type="button"
                  onClick={discard}
                  disabled={saving}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-40"
                >
                  {t("discard")}
                </button>
              )}
              <button
                type="button"
                onClick={save}
                disabled={!sectionDirty || saving || uploadingKey !== null}
                className="rounded-xl bg-cyan-400 px-8 py-3 font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? t("saving") : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-24 right-10 z-50 max-w-md rounded-2xl border px-6 py-4 shadow-2xl ${
            toast.type === "success"
              ? "border-green-400/40 bg-green-500/15 text-green-300"
              : "border-red-400/40 bg-red-500/15 text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

    </div>

  );

}
