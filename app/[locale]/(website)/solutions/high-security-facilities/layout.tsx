import HiddenNotice from "@/components/catalog/HiddenNotice";
import { guardBuiltinPage } from "@/lib/catalog/guard";


export const dynamic = "force-dynamic";


/** hides this page when it is switched off in 内容管理 */
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { hidden } = await guardBuiltinPage("solution", "high-security-facilities");
  const { locale } = await params;
  return (
    <>
      {hidden && <HiddenNotice lang={locale === "zh" ? "zh" : "en"} />}
      {children}
    </>
  );
}
