"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";


/** shown to an admin account that has no modules assigned yet */
export default function NoAccessPage(){

  const t = useTranslations("usersAdmin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] p-10 text-white">
      <div className="max-w-md rounded-3xl border border-cyan-400/20 bg-white/5 p-10 text-center">
        <h1 className="text-2xl font-bold">{t("noAccessTitle")}</h1>
        <p className="mt-4 text-slate-400">{t("noAccessText")}</p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-8 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black transition hover:bg-cyan-300"
        >
          {t("signOut")}
        </button>
      </div>
    </div>
  );

}
