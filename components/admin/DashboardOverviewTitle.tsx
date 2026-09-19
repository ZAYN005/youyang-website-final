"use client";

import { useTranslations } from "next-intl";


export default function DashboardOverviewTitle(){

const t = useTranslations("adminDashboard");


return (

<h2
className="
mb-6
text-2xl
font-bold
"
>

{t("overview")}

</h2>

);

}