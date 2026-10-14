"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import {
  Bilingual,
  CatalogData,
  CatalogKind,
  FieldDef,
  ImagesFieldDef,
  ListFieldDef,
  ListRow,
  MAX_SLUG_LENGTH,
  SLUG_PATTERN,
  emptyData,
  fieldsFor,
  formFor,
  slugify,
} from "@/lib/catalog/schema";


type Lang = "zh" | "en";

interface LoadedItem {
  id: string;
  slug: string;
  visible: boolean;
  data: CatalogData;
  path: string;
  updatedAt: string;
  updatedBy: string | null;
}

interface Snapshot {
  slug: string;
  visible: boolean;
  data: CatalogData;
}


/** fills in fields that are missing in stored data (e.g. after a form update) */
function normalise(kind: CatalogKind, data: unknown): CatalogData {
  const base = emptyData(kind);
  if (!data || typeof data !== "object") return base;
  const source = data as CatalogData;
  for (const field of fieldsFor(kind)) {
    const value = source[field.key];
    if (field.type === "text") {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const v = value as Bilingual;
        base[field.key] = { zh: typeof v.zh === "string" ? v.zh : "", en: typeof v.en === "string" ? v.en : "" };
      } else {
        base[field.key] = { zh: "", en: "" };
      }
    } else if (field.type === "plain") {
      base[field.key] = typeof value === "string" ? value : "";
    } else if (field.type === "images") {
      base[field.key] = Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
    } else {
      base[field.key] = Array.isArray(value)
        ? (value as ListRow[]).map((row) => {
            const clean: ListRow = {};
            for (const column of field.columns) {
              const cell = row?.[column.key];
              clean[column.key] = {
                zh: typeof cell?.zh === "string" ? cell.zh : "",
                en: typeof cell?.en === "string" ? cell.en : "",
              };
            }
            return clean;
          })
        : [];
    }
  }
  return base;
}

function rowsFor(text: string, min = 2) {
  const lines = text.split("\n").length;
  const wrapped = Math.ceil(text.length / 48);
  return Math.min(14, Math.max(min, lines, wrapped));
}

const inputClass = "input";


export default function CatalogEditor({
  kind,
  id,
  lang,
  onSaved,
  onDeleted,
  onBack,
  onDirtyChange,
  notify,
}: {
  kind: CatalogKind;
  /** null = new item */
  id: string | null;
  lang: Lang;
  onSaved: (id: string) => void;
  onDeleted: () => void;
  onBack: () => void;
  onDirtyChange: (dirty: boolean) => void;
  notify: (type: "success" | "error", message: string) => void;
}) {

  const t = useTranslations("contentAdmin.catalog");
  const tc = useTranslations("contentAdmin");

  const form = formFor(kind);
  const fields = useMemo(() => fieldsFor(kind), [kind]);

  const [item, setItem] = useState<LoadedItem | null>(null);
  const [loading, setLoading] = useState(id !== null);
  const [loadError, setLoadError] = useState(false);

  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState<CatalogData>(() => emptyData(kind));
  const [snapshot, setSnapshot] = useState<Snapshot>(() => ({ slug: "", visible: true, data: emptyData(kind) }));

  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);

  const isNew = id === null;


  // ---------- loading ----------

  useEffect(() => {
    if (id === null) return;
    let cancelled = false;
    fetch(`/api/admin/catalog/${kind}/${id}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json: { item: LoadedItem }) => {
        if (cancelled) return;
        const loaded = { ...json.item, data: normalise(kind, json.item.data) };
        setItem(loaded);
        setSlug(loaded.slug);
        setSlugTouched(true);
        setVisible(loaded.visible);
        setData(loaded.data);
        setSnapshot({ slug: loaded.slug, visible: loaded.visible, data: loaded.data });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [kind, id]);


  // ---------- dirty state ----------

  const dirty = useMemo(
    () =>
      slug !== snapshot.slug ||
      visible !== snapshot.visible ||
      JSON.stringify(data) !== JSON.stringify(snapshot.data),
    [slug, visible, data, snapshot],
  );

  const dirtyRef = useRef(onDirtyChange);
  useEffect(() => {
    dirtyRef.current = onDirtyChange;
  }, [onDirtyChange]);

  useEffect(() => {
    dirtyRef.current(dirty);
  }, [dirty]);

  useEffect(() => () => dirtyRef.current(false), []);


  // ---------- editing helpers ----------

  const englishName = (data.name as Bilingual | undefined)?.en ?? "";
  const autoSlug = slugify(englishName);
  const effectiveSlug = slugTouched ? slug : autoSlug;

  function setText(key: string, l: Lang, value: string) {
    setErrorField(null);
    setData((prev) => ({ ...prev, [key]: { ...(prev[key] as Bilingual), [l]: value } }));
  }

  function setPlain(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function listOf(key: string): ListRow[] {
    return (data[key] as ListRow[]) ?? [];
  }

  function setRows(key: string, next: ListRow[]) {
    setErrorField(null);
    setData((prev) => ({ ...prev, [key]: next }));
  }

  function addRow(field: ListFieldDef) {
    const row: ListRow = {};
    for (const column of field.columns) row[column.key] = { zh: "", en: "" };
    setRows(field.key, [...listOf(field.key), row]);
  }

  function setCell(field: ListFieldDef, index: number, column: string, l: Lang, value: string) {
    const next = listOf(field.key).map((row, i) =>
      i === index ? { ...row, [column]: { ...row[column], [l]: value } } : row,
    );
    setRows(field.key, next);
  }

  function moveRow(field: ListFieldDef, index: number, direction: -1 | 1) {
    const next = [...listOf(field.key)];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(field.key, next);
  }

  function removeRow(field: ListFieldDef, index: number) {
    setRows(field.key, listOf(field.key).filter((_, i) => i !== index));
  }

  function imagesOf(key: string): string[] {
    return (data[key] as string[]) ?? [];
  }

  function setImages(key: string, next: string[]) {
    setErrorField(null);
    setData((prev) => ({ ...prev, [key]: next }));
  }

  async function upload(field: ImagesFieldDef, files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingKey(field.key);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (imagesOf(field.key).length + uploaded.length >= field.max) {
          notify("error", t("maxImages", { max: field.max }));
          break;
        }
        if (file.size > 10 * 1024 * 1024) {
          notify("error", tc("tooLarge"));
          continue;
        }
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/content/upload", { method: "POST", body });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          notify(
            "error",
            json.code === "TOO_LARGE" ? tc("tooLarge") : json.code === "BAD_TYPE" ? tc("badType") : tc("uploadFailed"),
          );
          continue;
        }
        uploaded.push((await res.json()).url);
      }
    } catch {
      notify("error", tc("uploadFailed"));
    } finally {
      setUploadingKey(null);
    }
    if (uploaded.length) {
      setData((prev) => ({ ...prev, [field.key]: [...((prev[field.key] as string[]) ?? []), ...uploaded] }));
      setErrorField(null);
    }
  }

  function moveImage(key: string, index: number, direction: -1 | 1) {
    const next = [...imagesOf(key)];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setImages(key, next);
  }


  // ---------- saving ----------

  function labelOf(key: string) {
    if (key === "slug") return t("address");
    const field = fields.find((f) => f.key === key);
    return field ? field.label[lang] : key;
  }

  function showError(code: string, field: string) {
    setErrorField(field || null);
    const name = field ? labelOf(field) : "";
    const messages: Record<string, string> = {
      REQUIRED: t("errorRequired", { field: name }),
      MIN_IMAGES: t("errorMinImages", { field: name }),
      MAX_IMAGES: t("errorMaxImages", { field: name }),
      TOO_LONG: t("errorTooLong", { field: name }),
      BAD_SLUG: t("errorBadSlug"),
      SLUG_TAKEN: t("errorSlugTaken"),
      MAX_ROWS: t("errorMaxRows", { field: name }),
    };
    notify("error", messages[code] ?? tc("saveFailed"));
    if (field) {
      document.getElementById(`field-${field}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  /** same checks as the server, so mistakes are shown before sending */
  function checkLocally(): boolean {
    for (const field of fields) {
      if (field.type === "text" && field.required) {
        const v = data[field.key] as Bilingual;
        if (!v.zh.trim() || !v.en.trim()) {
          showError("REQUIRED", field.key);
          return false;
        }
      }
      if (field.type === "images" && imagesOf(field.key).length < field.min) {
        showError("MIN_IMAGES", field.key);
        return false;
      }
    }
    if (effectiveSlug && (effectiveSlug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(effectiveSlug))) {
      showError("BAD_SLUG", "slug");
      return false;
    }
    return true;
  }

  async function save() {
    if (saving || uploadingKey) return;
    if (!checkLocally()) return;

    setSaving(true);
    try {
      const res = await fetch(isNew ? `/api/admin/catalog/${kind}` : `/api/admin/catalog/${kind}/${id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: effectiveSlug, visible, data }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(json.code ?? "", json.field ?? "");
        return;
      }

      if (isNew) {
        // mark as saved before switching to the edit view of the new item
        setSnapshot({ slug: effectiveSlug, visible, data });
        dirtyRef.current(false);
        notify("success", t("created"));
        onSaved(json.id);
        return;
      }

      const saved = { ...json.item, data: normalise(kind, json.item.data) } as LoadedItem;
      setItem(saved);
      setSlug(saved.slug);
      setVisible(saved.visible);
      setData(saved.data);
      setSnapshot({ slug: saved.slug, visible: saved.visible, data: saved.data });
      notify("success", tc("saved"));
      onSaved(saved.id);
    } catch {
      notify("error", tc("saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!item || saving) return;
    const name = (data.name as Bilingual)[lang] || item.slug;
    if (!window.confirm(t("deleteConfirm", { name }))) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/catalog/${kind}/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      dirtyRef.current(false);
      notify("success", t("deleted"));
      onDeleted();
    } catch {
      notify("error", t("actionFailed"));
      setSaving(false);
    }
  }

  function discard() {
    setSlug(snapshot.slug);
    setSlugTouched(!isNew || snapshot.slug !== "");
    setVisible(snapshot.visible);
    setData(snapshot.data);
    setErrorField(null);
  }


  // ---------- render helpers ----------

  function fieldShell(field: FieldDef, children: React.ReactNode) {
    const hasError = errorField === field.key;
    const required = (field.type === "text" || field.type === "plain") && field.required;
    const minImages = field.type === "images" && field.min > 0;
    return (
      <div
        key={field.key}
        id={`field-${field.key}`}
        className={`rounded-2xl border p-5 ${
          hasError ? "border-red-400/60 bg-red-500/5" : "border-white/10 bg-[#0b1220]/60"
        }`}
      >
        <p className="font-semibold text-white">
          {field.label[lang]}
          {(required || minImages) && <span className="ml-1 text-red-400">*</span>}
        </p>
        {field.type === "images" && field.hint && <p className="mt-1 text-xs text-slate-500">{field.hint[lang]}</p>}
        <div className="mt-4">{children}</div>
      </div>
    );
  }

  function renderBilingual(
    value: Bilingual,
    onChange: (l: Lang, v: string) => void,
    multiline: boolean | undefined,
    placeholder?: Bilingual,
  ) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {(["zh", "en"] as const).map((l) => (
          <label key={l} className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
              {l === "zh" ? tc("chinese") : tc("english")}
            </span>
            {multiline ? (
              <textarea
                value={value[l]}
                rows={rowsFor(value[l], 3)}
                placeholder={placeholder?.[l]}
                onChange={(e) => onChange(l, e.target.value)}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            ) : (
              <input
                value={value[l]}
                placeholder={placeholder?.[l]}
                onChange={(e) => onChange(l, e.target.value)}
                className={inputClass}
              />
            )}
          </label>
        ))}
      </div>
    );
  }

  function renderField(field: FieldDef) {
    if (field.type === "text") {
      return fieldShell(
        field,
        renderBilingual(
          data[field.key] as Bilingual,
          (l, v) => setText(field.key, l, v),
          field.multiline,
          field.placeholder,
        ),
      );
    }

    if (field.type === "plain") {
      return fieldShell(
        field,
        <input
          value={data[field.key] as string}
          placeholder={field.placeholder?.[lang]}
          onChange={(e) => setPlain(field.key, e.target.value)}
          className={`${inputClass} max-w-xl`}
        />,
      );
    }

    if (field.type === "images") {
      const list = imagesOf(field.key);
      const uploading = uploadingKey === field.key;
      return fieldShell(
        field,
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">
          {list.map((src, index) => (
            <div key={`${src}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]">
              <div className="relative flex h-36 items-center justify-center bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:16px_16px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-contain" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-bold text-black">
                    {t("cover")}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2 text-xs">
                <div className="flex gap-1">
                  <button
                    type="button"
                    title={tc("moveLeft")}
                    disabled={index === 0}
                    onClick={() => moveImage(field.key, index, -1)}
                    className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    title={tc("moveRight")}
                    disabled={index === list.length - 1}
                    onClick={() => moveImage(field.key, index, 1)}
                    className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setImages(field.key, list.filter((_, i) => i !== index))}
                  className="rounded-lg px-2 py-1 text-red-300 hover:bg-red-500/15"
                >
                  {tc("remove")}
                </button>
              </div>
            </div>
          ))}

          {list.length < field.max && (
            <label
              className={`flex h-[188px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-sm transition ${
                uploading
                  ? "border-cyan-400/40 text-cyan-300"
                  : "border-white/15 text-slate-400 hover:border-cyan-400/60 hover:text-cyan-300"
              }`}
            >
              <span className="text-3xl leading-none">+</span>
              <span className="mt-2">{uploading ? tc("uploading") : tc("addImages")}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  upload(field, e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>,
      );
    }

    // list
    const list = listOf(field.key);
    return fieldShell(
      field,
      <div className="space-y-4">
        {list.length === 0 && <p className="text-sm text-slate-500">{t("noRows")}</p>}

        {list.map((row, index) => (
          <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                {t("row", { n: index + 1 })}
              </span>
              <div className="flex gap-1 text-xs">
                <button
                  type="button"
                  title={t("moveUp")}
                  disabled={index === 0}
                  onClick={() => moveRow(field, index, -1)}
                  className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  title={t("moveDown")}
                  disabled={index === list.length - 1}
                  onClick={() => moveRow(field, index, 1)}
                  className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(field, index)}
                  className="rounded-lg px-2 py-1 text-red-300 hover:bg-red-500/15"
                >
                  {t("removeRow")}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {field.columns.map((column) => (
                <div key={column.key}>
                  {field.columns.length > 1 && (
                    <p className="mb-2 text-sm text-slate-300">{column.label[lang]}</p>
                  )}
                  {renderBilingual(
                    row[column.key] ?? { zh: "", en: "" },
                    (l, v) => setCell(field, index, column.key, l, v),
                    column.multiline,
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {list.length < field.max && (
          <button
            type="button"
            onClick={() => addRow(field)}
            className="rounded-xl border border-dashed border-cyan-400/40 px-5 py-3 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
          >
            + {field.addLabel[lang]}
          </button>
        )}
      </div>,
    );
  }


  // ---------- render ----------

  if (loading) {
    return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-slate-400">{tc("loading")}</div>;
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={onBack} className="text-sm text-slate-400 hover:text-cyan-300">
          {t("backToList")}
        </button>
        <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-10 text-red-300">{tc("loadFailed")}</div>
      </div>
    );
  }

  const title = isNew
    ? kind === "product" ? t("newProductTitle") : t("newSolutionTitle")
    : (data.name as Bilingual)[lang] || (data.name as Bilingual).zh || item?.slug || "";

  const savedPath = item?.path ?? null;
  const pathPrefix = kind === "product" ? "/products/" : "/solutions/";


  return (

    <div className="space-y-8">

      {/* header */}
      <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
        <button type="button" onClick={onBack} className="text-sm text-slate-400 hover:text-cyan-300">
          {t("backToList")}
        </button>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold">{title}</h2>
              {!isNew && (
                <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[11px] text-cyan-300">{t("added")}</span>
              )}
              {!isNew && !snapshot.visible && (
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">{t("hidden")}</span>
              )}
            </div>
            <p className="mt-3 text-slate-400">{t("editorDesc")}</p>
            {item && (
              <p className="mt-3 text-xs text-slate-500">
                {tc("lastUpdated", {
                  at: new Date(item.updatedAt).toLocaleString(),
                  by: item.updatedBy ?? "-",
                })}
              </p>
            )}
          </div>

          {savedPath && (
            <div className="flex flex-wrap gap-3">
              <a
                href={`/zh${savedPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
              >
                {tc("preview")} ↗
              </a>
              <a
                href={`/en${savedPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
              >
                {tc("previewEn")} ↗
              </a>
            </div>
          )}
        </div>
      </div>


      {/* publishing */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h3 className="text-xl font-bold">{t("publishing")}</h3>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <div
            id="field-slug"
            className={`rounded-2xl border p-5 ${
              errorField === "slug" ? "border-red-400/60 bg-red-500/5" : "border-white/10 bg-[#0b1220]/60"
            }`}
          >
            <p className="font-semibold text-white">{t("address")}</p>
            <p className="mt-1 text-xs text-slate-500">{t("addressHint")}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="shrink-0 text-sm text-slate-500">/{lang}{pathPrefix}</span>
              <input
                value={effectiveSlug}
                placeholder={kind === "product" ? "new-product" : "new-solution"}
                onChange={(e) => {
                  setSlugTouched(true);
                  setErrorField(null);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, MAX_SLUG_LENGTH));
                }}
                className={inputClass}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1220]/60 p-5">
            <p className="font-semibold text-white">{t("publish")}</p>
            <p className="mt-1 text-xs text-slate-500">{t("publishHint")}</p>
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              onClick={() => setVisible((v) => !v)}
              className="mt-4 flex items-center gap-3"
            >
              <span
                className={`relative h-7 w-12 rounded-full transition ${visible ? "bg-cyan-400" : "bg-white/15"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    visible ? "left-6" : "left-1"
                  }`}
                />
              </span>
              <span className={visible ? "text-cyan-300" : "text-slate-400"}>
                {visible ? t("visibleOn") : t("visibleOff")}
              </span>
            </button>
          </div>

        </div>
      </div>


      {/* form groups */}
      {form.map((group, index) => (
        <div key={group.id} className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-xl font-bold">
            <span className="mr-2 text-cyan-400">{index + 1}.</span>
            {group.title[lang]}
          </h3>
          {group.description && <p className="mt-2 text-sm text-slate-400">{group.description[lang]}</p>}
          <div className="mt-6 space-y-5">{group.fields.map(renderField)}</div>
        </div>
      ))}


      {/* delete */}
      {!isNew && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={remove}
            disabled={saving}
            className="rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-40"
          >
            {kind === "product" ? t("deleteProduct") : t("deleteSolution")}
          </button>
        </div>
      )}


      {/* save bar */}
      <div
        className={`fixed bottom-0 left-72 right-0 z-40 border-t px-10 py-4 backdrop-blur-xl transition ${
          dirty || isNew ? "border-cyan-400/30 bg-[#020617]/95" : "border-white/5 bg-[#020617]/80"
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          <p className={dirty ? "text-cyan-300" : "text-slate-500"}>
            {dirty ? `● ${tc("unsavedBar")}` : title}
          </p>

          <div className="flex gap-3">
            {dirty && !isNew && (
              <button
                type="button"
                onClick={discard}
                disabled={saving}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-40"
              >
                {tc("discard")}
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={(!dirty && !isNew) || saving || uploadingKey !== null}
              className="rounded-xl bg-cyan-400 px-8 py-3 font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? tc("saving") : isNew ? t("create") : tc("save")}
            </button>
          </div>
        </div>
      </div>

    </div>

  );
}
