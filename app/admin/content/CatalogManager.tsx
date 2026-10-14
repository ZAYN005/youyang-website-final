"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import type { CatalogKind } from "@/lib/catalog/schema";


interface Summary {
  id: string | null;
  slug: string;
  builtin: boolean;
  sectionId: string | null;
  title: { zh: string; en: string };
  visible: boolean;
  image: string | null;
  path: string;
  updatedAt: string | null;
  updatedBy: string | null;
}


/**
 * 产品管理 / 方案管理: add, order, hide and delete products or solutions.
 */
export default function CatalogManager({
  kind,
  lang,
  onOpenSection,
  onOpenItem,
  onCreate,
  onChanged,
  notify,
}: {
  kind: CatalogKind;
  lang: "zh" | "en";
  onOpenSection: (sectionId: string) => void;
  onOpenItem: (id: string) => void;
  onCreate: () => void;
  onChanged: () => void;
  notify: (type: "success" | "error", message: string) => void;
}) {

  const t = useTranslations("contentAdmin.catalog");

  const [items, setItems] = useState<Summary[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);


  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/catalog/${kind}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setItems(json.items);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, [kind]);


  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/catalog/${kind}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json: { items: Summary[] }) => {
        if (!cancelled) setItems(json.items);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [kind]);


  async function update(body: object, successMessage: string) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/catalog/${kind}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setItems(json.items);
      notify("success", successMessage);
      onChanged();
    } catch {
      notify("error", t("actionFailed"));
      load();
    } finally {
      setBusy(false);
    }
  }


  function move(index: number, direction: -1 | 1) {
    if (!items) return;
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    update({ order: next.map((i) => i.slug) }, t("orderSaved"));
  }


  function toggle(item: Summary) {
    update(
      { visible: { slug: item.slug, value: !item.visible } },
      item.visible ? t("hiddenDone") : t("shownDone"),
    );
  }


  async function remove(item: Summary) {
    if (item.builtin || !item.id || busy) return;
    const name = item.title[lang] || item.slug;
    if (!window.confirm(t("deleteConfirm", { name }))) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/catalog/${kind}/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      notify("success", t("deleted"));
      onChanged();
      await load();
    } catch {
      notify("error", t("actionFailed"));
    } finally {
      setBusy(false);
    }
  }


  const visibleCount = items?.filter((i) => i.visible).length ?? 0;


  return (

    <div className="space-y-8">

      {/* header */}
      <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">
              {kind === "product" ? t("managerTitleProduct") : t("managerTitleSolution")}
            </h2>
            <p className="mt-3 text-slate-400">
              {kind === "product" ? t("managerDescProduct") : t("managerDescSolution")}
            </p>
            {items && (
              <p className="mt-3 text-xs text-slate-500">
                {t("counts", { total: items.length, visible: visibleCount })}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onCreate}
            className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black transition hover:bg-cyan-300"
          >
            {kind === "product" ? t("addProduct") : t("addSolution")}
          </button>
        </div>
      </div>


      {/* list */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">

        {loadError && <p className="p-4 text-red-300">{t("loadFailed")}</p>}
        {!items && !loadError && <p className="p-4 text-slate-400">{t("loading")}</p>}

        <ul className="space-y-3">
          {items?.map((item, index) => (
            <li
              key={item.slug}
              className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 transition ${
                item.visible ? "border-white/10 bg-[#0b1220]/60" : "border-amber-400/20 bg-amber-400/5"
              }`}
            >

              {/* order */}
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  title={t("moveUp")}
                  aria-label={t("moveUp")}
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                  className="rounded-lg px-2 py-0.5 text-slate-300 hover:bg-white/10 disabled:opacity-25"
                >
                  ▲
                </button>
                <button
                  type="button"
                  title={t("moveDown")}
                  aria-label={t("moveDown")}
                  disabled={busy || index === (items?.length ?? 0) - 1}
                  onClick={() => move(index, 1)}
                  className="rounded-lg px-2 py-0.5 text-slate-300 hover:bg-white/10 disabled:opacity-25"
                >
                  ▼
                </button>
              </div>

              <span className="w-6 text-center text-sm text-slate-500">{index + 1}</span>

              {/* image */}
              <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className={`h-full w-full ${kind === "product" ? "object-contain p-1" : "object-cover"}`} />
                ) : (
                  <span className="text-xs text-slate-600">—</span>
                )}
              </div>

              {/* name */}
              <div className="min-w-[180px] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`font-semibold ${item.visible ? "text-white" : "text-slate-400"}`}>
                    {item.title[lang] || item.title.zh || item.title.en || item.slug}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      item.builtin ? "bg-white/10 text-slate-300" : "bg-cyan-400/15 text-cyan-300"
                    }`}
                  >
                    {item.builtin ? t("builtin") : t("added")}
                  </span>
                  {!item.visible && (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">
                      {t("hidden")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.path}</p>
              </div>

              {/* actions */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <a
                  href={`/${lang}${item.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10"
                >
                  {t("view")} ↗
                </a>

                <button
                  type="button"
                  onClick={() => (item.builtin ? item.sectionId && onOpenSection(item.sectionId) : item.id && onOpenItem(item.id))}
                  className="rounded-lg border border-cyan-400/40 px-3 py-2 text-cyan-300 hover:bg-cyan-400/10"
                >
                  {t("edit")}
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => toggle(item)}
                  className="rounded-lg border border-white/15 px-3 py-2 text-slate-300 hover:bg-white/5 disabled:opacity-40"
                >
                  {item.visible ? t("hide") : t("show")}
                </button>

                {!item.builtin && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => remove(item)}
                    className="rounded-lg border border-red-400/30 px-3 py-2 text-red-300 hover:bg-red-500/15 disabled:opacity-40"
                  >
                    {t("delete")}
                  </button>
                )}
              </div>

            </li>
          ))}
        </ul>

        {items && (
          <p className="mt-5 px-2 text-xs text-slate-500">{t("builtinNote")}</p>
        )}

      </div>

    </div>

  );
}
