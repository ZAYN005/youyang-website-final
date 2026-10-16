"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { MODULES, ModuleKey, STAFF_ROLE, TOP_ADMIN_ROLE } from "@/lib/permissions";


interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  modules: ModuleKey[];
  status: string;
  createdAt: string;
}

interface EditState {
  role: string;
  permissions: ModuleKey[];
  status: string;
  password: string;
}

type Toast = { type: "success" | "error"; message: string } | null;

const MIN_PASSWORD = 8;


function generatePassword() {
  const sets = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnpqrstuvwxyz", "23456789", "@#%"];
  const pick = (chars: string) => chars[crypto.getRandomValues(new Uint32Array(1))[0] % chars.length];
  const chars = [pick(sets[0]), pick(sets[0]), pick(sets[1]), pick(sets[1]), pick(sets[1]), pick(sets[1]),
    pick(sets[2]), pick(sets[2]), pick(sets[2]), pick(sets[3]), pick(sets[0]), pick(sets[1])];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}


export default function UsersContent(){

  const t = useTranslations("usersAdmin");
  const lang = useLocale() === "zh" ? "zh" : "en";
  const { data: session, status } = useSession();
  const router = useRouter();

  const isTopAdmin = session?.user?.role === TOP_ADMIN_ROLE;
  const myId = session?.user?.id;

  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: STAFF_ROLE as string,
    permissions: [] as ModuleKey[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<Toast>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


  const notify = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);


  const errorText = useCallback((code: string | undefined) => {
    const known = ["BAD_NAME", "BAD_EMAIL", "BAD_PASSWORD", "BAD_ROLE", "BAD_PERMISSIONS", "NO_PERMISSIONS",
      "EMAIL_TAKEN", "SELF_LOCKOUT", "LAST_TOP_ADMIN", "SELF_DELETE"];
    return code && known.includes(code) ? t(`errors.${code}`) : t("errors.FAILED");
  }, [t]);


  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setUsers(await res.json());
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);


  // only the top admin may use this page
  useEffect(() => {
    if (status === "authenticated" && !isTopAdmin) router.replace("/admin");
  }, [status, isTopAdmin, router]);

  useEffect(() => {
    if (status !== "authenticated" || !isTopAdmin) return;
    let cancelled = false;
    fetch("/api/admin/users", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json: AdminUser[]) => {
        if (!cancelled) setUsers(json);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [status, isTopAdmin]);


  // ---------- create ----------

  function toggleFormModule(key: ModuleKey) {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key) ? f.permissions.filter((k) => k !== key) : [...f.permissions, key],
    }));
  }

  async function createUser() {
    if (creating) return;
    if (!form.name.trim() || !form.email.trim()) return notify("error", t("errors.FILL_ALL"));
    if (form.password.length < MIN_PASSWORD) return notify("error", t("errors.BAD_PASSWORD"));
    if (form.role === STAFF_ROLE && form.permissions.length === 0) return notify("error", t("errors.NO_PERMISSIONS"));

    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return notify("error", errorText(json.code));
      notify("success", t("created", { email: json.email }));
      setForm({ name: "", email: "", password: "", role: STAFF_ROLE, permissions: [] });
      setShowPassword(false);
      load();
    } catch {
      notify("error", t("errors.FAILED"));
    } finally {
      setCreating(false);
    }
  }


  // ---------- edit ----------

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setEdit({
      role: user.role === TOP_ADMIN_ROLE ? TOP_ADMIN_ROLE : STAFF_ROLE,
      permissions: user.role === TOP_ADMIN_ROLE ? [] : [...user.modules],
      status: user.status === "ACTIVE" ? "ACTIVE" : "DISABLED",
      password: "",
    });
  }

  function toggleEditModule(key: ModuleKey) {
    setEdit((e) => e && ({
      ...e,
      permissions: e.permissions.includes(key) ? e.permissions.filter((k) => k !== key) : [...e.permissions, key],
    }));
  }

  async function saveEdit(user: AdminUser) {
    if (!edit || saving) return;
    if (edit.role === STAFF_ROLE && edit.permissions.length === 0) return notify("error", t("errors.NO_PERMISSIONS"));
    if (edit.password && edit.password.length < MIN_PASSWORD) return notify("error", t("errors.BAD_PASSWORD"));

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: edit.role,
          permissions: edit.role === STAFF_ROLE ? edit.permissions : [],
          status: edit.status,
          ...(edit.password ? { password: edit.password } : {}),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return notify("error", errorText(json.code));
      notify("success", t("saved"));
      setEditingId(null);
      setEdit(null);
      load();
    } catch {
      notify("error", t("errors.FAILED"));
    } finally {
      setSaving(false);
    }
  }

  async function remove(user: AdminUser) {
    if (!window.confirm(t("deleteConfirm", { name: user.name, email: user.email }))) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return notify("error", errorText(json.code));
      notify("success", t("deleted"));
      load();
    } catch {
      notify("error", t("errors.FAILED"));
    }
  }


  // ---------- render helpers ----------

  function moduleChecklist(selected: ModuleKey[], onToggle: (key: ModuleKey) => void) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {MODULES.map((m) => {
          const on = selected.includes(m.key);
          return (
            <label
              key={m.key}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                on ? "border-cyan-400 bg-cyan-400/10 text-cyan-200" : "border-white/10 text-slate-300 hover:border-cyan-400/40"
              }`}
            >
              <input type="checkbox" checked={on} onChange={() => onToggle(m.key)} className="h-4 w-4 accent-cyan-400" />
              <span>{m.label[lang]}</span>
            </label>
          );
        })}
      </div>
    );
  }

  function roleChoice(value: string, onChange: (role: string) => void, disabled = false) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { role: STAFF_ROLE, title: t("staff"), hint: t("staffHint") },
          { role: TOP_ADMIN_ROLE, title: t("topAdmin"), hint: t("topAdminHint") },
        ].map((option) => (
          <label
            key={option.role}
            className={`block cursor-pointer rounded-xl border p-4 transition ${
              value === option.role ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 hover:border-cyan-400/40"
            } ${disabled ? "pointer-events-none opacity-50" : ""}`}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                checked={value === option.role}
                onChange={() => onChange(option.role)}
                disabled={disabled}
                className="accent-cyan-400"
              />
              <span className="font-semibold">{option.title}</span>
            </span>
            <span className="mt-2 block text-xs text-slate-400">{option.hint}</span>
          </label>
        ))}
      </div>
    );
  }


  // ---------- render ----------

  if (status === "loading" || !isTopAdmin) {
    return <p className="p-10 text-white">{t("loading")}</p>;
  }

  return (

    <div className="pb-20">

      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-400">ACCESS</p>
        <h1 className="mt-4 text-5xl font-bold text-white">{t("title")}</h1>
        <p className="mt-3 text-slate-400">{t("subtitle")}</p>
      </div>


      {/* create */}
      <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
        <h2 className="text-2xl font-bold">{t("create")}</h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">{t("name")}</span>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">{t("email")}</span>
            <input
              className="input"
              type="email"
              autoComplete="off"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
              {t("password")} <span className="normal-case tracking-normal">（{t("passwordHint")}）</span>
            </span>
            <div className="flex gap-2">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, password: generatePassword() });
                  setShowPassword(true);
                }}
                className="shrink-0 rounded-xl border border-cyan-400/40 px-3 text-sm text-cyan-300 hover:bg-cyan-400/10"
              >
                {t("generate")}
              </button>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 rounded-xl border border-white/15 px-3 text-sm text-slate-300 hover:bg-white/5"
              >
                {showPassword ? t("hide") : t("show")}
              </button>
            </div>
          </label>
        </div>

        <p className="mt-8 font-semibold">{t("accountType")}</p>
        <div className="mt-3">{roleChoice(form.role, (role) => setForm({ ...form, role }))}</div>

        {form.role === STAFF_ROLE && (
          <>
            <p className="mt-8 font-semibold">{t("modules")}</p>
            <p className="mt-1 text-xs text-slate-500">{t("modulesHint")}</p>
            <div className="mt-3">{moduleChecklist(form.permissions, toggleFormModule)}</div>
          </>
        )}

        <button
          type="button"
          onClick={createUser}
          disabled={creating}
          className="mt-8 rounded-xl bg-cyan-400 px-8 py-3 font-bold text-black transition hover:bg-cyan-300 disabled:opacity-40"
        >
          {creating ? t("saving") : t("createButton")}
        </button>
      </div>


      {/* list */}
      <div className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">
          {t("accounts")}
          {users && <span className="ml-3 text-sm font-normal text-slate-500">{users.length}</span>}
        </h2>

        {loadError && <p className="text-red-300">{t("errors.LOAD")}</p>}
        {!users && !loadError && <p className="text-slate-400">{t("loading")}</p>}

        {users?.map((user) => {
          const isMe = user.id === myId;
          const top = user.role === TOP_ADMIN_ROLE;
          const active = user.status === "ACTIVE";
          const editing = editingId === user.id && edit;

          return (
            <div key={user.id} className={`rounded-3xl border p-6 ${active ? "border-white/10 bg-white/5" : "border-amber-400/20 bg-amber-400/5"}`}>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    {isMe && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">{t("you")}</span>}
                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${top ? "bg-cyan-400/20 text-cyan-300" : "bg-white/10 text-slate-300"}`}>
                      {top ? t("topAdmin") : t("staff")}
                    </span>
                    {!active && <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">{t("disabled")}</span>}
                  </div>
                  <p className="mt-1 text-slate-400">{user.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {top ? (
                      <span className="text-sm text-cyan-300">{t("allModules")}</span>
                    ) : user.modules.length ? (
                      user.modules.map((key) => (
                        <span key={key} className="rounded-lg border border-cyan-400/30 px-2 py-1 text-xs text-cyan-200">
                          {MODULES.find((m) => m.key === key)?.label[lang]}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-amber-300">{t("noModules")}</span>
                    )}
                  </div>
                </div>

                {!editing && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(user)}
                      className="rounded-xl border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/10"
                    >
                      {t("edit")}
                    </button>
                    {!isMe && (
                      <button
                        type="button"
                        onClick={() => remove(user)}
                        className="rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/15"
                      >
                        {t("delete")}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {editing && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="font-semibold">{t("accountType")}</p>
                  {isMe && <p className="mt-1 text-xs text-slate-500">{t("selfNote")}</p>}
                  <div className="mt-3">
                    {roleChoice(edit.role, (role) => setEdit({ ...edit, role }), isMe)}
                  </div>

                  {edit.role === STAFF_ROLE && (
                    <>
                      <p className="mt-6 font-semibold">{t("modules")}</p>
                      <div className="mt-3">{moduleChecklist(edit.permissions, toggleEditModule)}</div>
                    </>
                  )}

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="font-semibold">{t("status")}</p>
                      <div className="mt-3 flex gap-2">
                        {(["ACTIVE", "DISABLED"] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={isMe}
                            onClick={() => setEdit({ ...edit, status: s })}
                            className={`rounded-xl border px-4 py-2 text-sm transition disabled:opacity-40 ${
                              edit.status === s ? "border-cyan-400 bg-cyan-400/10 text-cyan-200" : "border-white/10 text-slate-300"
                            }`}
                          >
                            {s === "ACTIVE" ? t("active") : t("disabled")}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="block">
                      <span className="font-semibold">{t("newPassword")}</span>
                      <span className="mt-1 block text-xs text-slate-500">{t("newPasswordHint")}</span>
                      <input
                        className="input mt-3"
                        type="text"
                        autoComplete="new-password"
                        value={edit.password}
                        onChange={(e) => setEdit({ ...edit, password: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => saveEdit(user)}
                      disabled={saving}
                      className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black hover:bg-cyan-300 disabled:opacity-40"
                    >
                      {saving ? t("saving") : t("save")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEdit(null);
                      }}
                      className="rounded-xl border border-white/15 px-6 py-3 text-slate-300 hover:bg-white/5"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>


      {toast && (
        <div
          role="status"
          className={`fixed bottom-10 right-10 z-50 max-w-md rounded-2xl border px-6 py-4 shadow-2xl ${
            toast.type === "success" ? "border-green-400/40 bg-green-500/15 text-green-300" : "border-red-400/40 bg-red-500/15 text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

    </div>

  );

}
