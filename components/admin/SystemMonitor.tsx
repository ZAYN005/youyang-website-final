"use client";

import { useTranslations } from "next-intl";


export default function SystemMonitor(){


const t = useTranslations("systemMonitor");


const systems=[

"database",
"api",
"authentication",
"engine"

];


return (

<div className="
mt-10
rounded-3xl
border
border-cyan-400/20
bg-white/5
p-8
text-white
">


<h2 className="
text-2xl
font-bold
">

{t("title")}

</h2>



<div className="
grid
md:grid-cols-4
gap-5
mt-6
">


{
systems.map(item=>(


<div

key={item}

className="
rounded-2xl
bg-black/30
p-5
border
border-white/10
"

>


<div className="
text-green-400
text-xl
">

●

</div>


<p className="mt-3">

{t(item)}

</p>


</div>


))

}


</div>


</div>

);

}