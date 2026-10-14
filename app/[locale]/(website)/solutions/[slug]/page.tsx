import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AddedSolutionPage from "@/components/catalog/AddedSolutionPage";
import HiddenNotice from "@/components/catalog/HiddenNotice";

import { getAddedItem } from "@/lib/catalog/server";
import { isAdminViewer } from "@/lib/catalog/guard";
import { images, pick } from "@/lib/catalog/schema";


export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };


async function load(params: Props["params"]) {
  const { locale, slug } = await params;
  const lang = locale === "zh" ? "zh" : "en";
  const item = await getAddedItem("solution", slug);
  if (!item) return null;
  if (!item.visible && !(await isAdminViewer())) return null;
  return { item, lang } as const;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  const { item, lang } = found;
  const name = pick(item.data.name, lang);
  const cover = images(item.data.images)[0];
  return {
    title: `${name} | Youyang Intelligent Control`,
    description: pick(item.data.summary, lang),
    ...(item.visible ? {} : { robots: { index: false, follow: false } }),
    ...(cover ? { openGraph: { images: [cover] } } : {}),
  };
}


/** page of a solution added in 内容管理 (built-in pages have their own folders) */
export default async function AddedSolutionRoute({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();
  const { item, lang } = found;
  return (
    <>
      {!item.visible && <HiddenNotice lang={lang} />}
      <AddedSolutionPage data={item.data} lang={lang} />
    </>
  );
}
