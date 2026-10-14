import { getTranslations } from "next-intl/server";

import Navbar from "@/components/layout/Navbar";
import Footer, { FooterLink } from "@/components/layout/Footer";

import { getVisibleCatalog } from "@/lib/catalog/server";
import { pathFor } from "@/lib/catalog/builtins";
import { pick } from "@/lib/catalog/schema";


export default async function WebsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;
  const lang = locale === "zh" ? "zh" : "en";
  const t = await getTranslations("footer");

  // footer menus: built-in + added products / solutions, in the chosen order
  const [productEntries, solutionEntries] = await Promise.all([
    getVisibleCatalog("product"),
    getVisibleCatalog("solution"),
  ]);

  const products: FooterLink[] = productEntries.map((entry) => ({
    href: pathFor("product", entry.slug),
    label: entry.builtin ? t(`products.${entry.builtin.footerKey}`) : pick(entry.data?.name, lang),
  }));

  const solutions: FooterLink[] = solutionEntries.map((entry) => ({
    href: pathFor("solution", entry.slug),
    label: entry.builtin ? t(`solutions.${entry.builtin.footerKey}`) : pick(entry.data?.name, lang),
  }));

  return (
    <>
      <Navbar />

      {children}

      <Footer products={products} solutions={solutions} />
    </>
  );
}
