"use client";

import { useTranslations } from "next-intl";


export default function StatPanel(){


const t = useTranslations("statPanel");


const stats=[

{
key:"systems",
value:"128"
},

{
key:"inquiries",
value:"24"
},

{
key:"projects",
value:"18"
},

{
key:"status",
value:"ONLINE"
}

];



return (

<div className="
grid
gap-6
md:grid-cols-4
">


{stats.map((item)=>(


<div

key={item.key}

className="
rounded-3xl
border
border-cyan-400/20
bg-white/5
p-6
backdrop-blur-xl
"

>


<p className="
text-sm
text-slate-400
">

{t(item.key)}

</p>



<h2 className="
mt-4
text-4xl
font-bold
text-white
">

{item.value}

</h2>


</div>


))}


</div>

);


}