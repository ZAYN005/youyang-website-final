import {getRequestConfig} from "next-intl/server";


export default getRequestConfig(async ({requestLocale})=>{


  const locale = await requestLocale;


  const currentLocale =
    locale && ["en","zh"].includes(locale)
      ? locale
      : "en";


  return {

    locale: currentLocale,

    timeZone: "Asia/Shanghai",

    messages:
      (
        await import(`../messages/${currentLocale}.json`)
      ).default

  };


});