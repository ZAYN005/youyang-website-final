import {getRequestConfig} from "next-intl/server";

import {getSiteMessages} from "@/lib/cms/content";


export default getRequestConfig(async ({requestLocale})=>{


  const locale = await requestLocale;


  const currentLocale =
    locale && ["en","zh"].includes(locale)
      ? (locale as "en" | "zh")
      : "en";


  return {

    locale: currentLocale,

    timeZone: "Asia/Shanghai",

    // messages/*.json + edits saved in 内容管理 (falls back to the JSON files)
    messages: await getSiteMessages(currentLocale)

  };


});
