"use client";

import { useTranslations } from "next-intl";


export default function DashboardModules(){

const t = useTranslations("adminDashboard");


return (

<section
className="
mt-12
grid
gap-6
md:grid-cols-3
"
>


<div
className="
rounded-3xl
border
border-cyan-400/20
bg-white/5
p-8
"
>

<h3 className="text-xl font-bold">

{t("inquiries.title")}

</h3>


<p className="mt-3 text-slate-400">

{t("inquiries.description")}

</p>


</div>





<div
className="
rounded-3xl
border
border-yellow-400/20
bg-white/5
p-8
"
>

<h3 className="text-xl font-bold">

{t("products.title")}

</h3>


<p className="mt-3 text-slate-400">

{t("products.description")}

</p>


</div>





<div
className="
rounded-3xl
border
border-purple-400/20
bg-white/5
p-8
"
>

<h3 className="text-xl font-bold">

{t("analytics.title")}

</h3>


<p className="mt-3 text-slate-400">

{t("analytics.description")}

</p>


</div>



</section>

);

}