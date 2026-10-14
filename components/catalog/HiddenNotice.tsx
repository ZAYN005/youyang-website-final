/** shown only to logged-in admins when they open a hidden page */
export default function HiddenNotice({ lang }: { lang: "zh" | "en" }) {
  return (
    <div className="bg-amber-400 px-6 py-2 text-center text-sm font-semibold text-navy">
      {lang === "zh"
        ? "此页面已在内容管理中隐藏，访客无法看到（仅管理员可预览）"
        : "This page is hidden in Content Management. Visitors cannot see it (admin preview only)."}
    </div>
  );
}
