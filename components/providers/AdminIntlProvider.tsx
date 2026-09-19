"use client";


import {NextIntlClientProvider} from "next-intl";
import {useState} from "react";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

import AdminLanguageSwitcher from "@/components/admin/AdminLanguageSwitcher";



export default function AdminIntlProvider({
children
}:{
children: React.ReactNode;
}){


const [locale,setLocale] = useState<"en" | "zh">("en");



const messages = locale === "zh"
? zh
: en;



return (


<NextIntlClientProvider

locale={locale}

messages={messages}

>


<AdminLanguageSwitcher
locale={locale}
setLocale={setLocale}
/>



{children}



</NextIntlClientProvider>


);


}