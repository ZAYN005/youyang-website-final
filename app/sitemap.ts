import type { MetadataRoute } from "next";

import { getVisibleCatalog } from "@/lib/catalog/server";
import { pathFor } from "@/lib/catalog/builtins";


export const dynamic = "force-dynamic";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {


  const baseUrl = "https://yyteck.cn";


  // products / solutions added in 内容管理
  const added = (await Promise.all([getVisibleCatalog("product"), getVisibleCatalog("solution")]))
    .flat()
    .filter((entry) => !entry.builtin)
    .map((entry) => ({
      url: `${baseUrl}${pathFor(entry.kind, entry.slug)}`,
      lastModified: entry.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));


  return [

    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },


    {
      url: `${baseUrl}/company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },


    {
      url: `${baseUrl}/company/technology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },



    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },


    {
      url: `${baseUrl}/products/360-sentinel`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },


    {
      url: `${baseUrl}/products/dome-watch`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },


    {
      url: `${baseUrl}/products/wide-area-guardian`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },



    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },


    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },


    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },


    ...added,

  ];

}