import { getTranslations } from "next-intl/server";

import ContactPageClient from "./ContactPageClient";

import { getVisibleCatalog } from "@/lib/catalog/server";
import { pick } from "@/lib/catalog/schema";
import { InterestOption, OTHER_INTEREST } from "@/lib/catalog/interest";


export const dynamic = "force-dynamic";


/**
 * The "选择解决方案 / 选择产品" dropdowns list every product / solution that is
 * shown on the website (built-in + added in 内容管理, same order), plus 其他.
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;
  const lang = locale === "zh" ? "zh" : "en";
  const t = await getTranslations("contact");

  const [products, solutions] = await Promise.all([
    getVisibleCatalog("product"),
    getVisibleCatalog("solution"),
  ]);

  const other: InterestOption = { value: OTHER_INTEREST, label: t("form.fields.other") };

  const productOptions: InterestOption[] = [
    ...products.map((entry) =>
      entry.builtin
        ? { value: entry.builtin.footerKey, label: t(`products.${entry.builtin.footerKey}`) }
        : { value: pick(entry.data?.name, "zh"), label: pick(entry.data?.name, lang) },
    ),
    other,
  ].filter((o) => o.value && o.label);

  const solutionOptions: InterestOption[] = [
    ...solutions.map((entry) =>
      entry.builtin
        ? { value: entry.builtin.footerKey, label: t(`solutions.${entry.builtin.footerKey}`) }
        : { value: pick(entry.data?.name, "zh"), label: pick(entry.data?.name, lang) },
    ),
    other,
  ].filter((o) => o.value && o.label);

  return <ContactPageClient productOptions={productOptions} solutionOptions={solutionOptions} />;
}
