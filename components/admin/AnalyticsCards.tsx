"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";


export default function AnalyticsCards(){


const t = useTranslations("analyticsCards");


const data=[

{ 
key:"total",
value:"124",
icon:"📩"
},

{ 
key:"leads",
value:"35",
icon:"⚡"
},

{ 
key:"contacted",
value:"56",
icon:"🤝"
},

{ 
key:"completed",
value:"33",
icon:"✓"
}

];



return (

<div className="grid md:grid-cols-4 gap-6">

{data.map((item)=>(


<motion.div

key={item.key}

whileHover={{
scale:1.05
}}

className="
rounded-3xl
border
border-cyan-400/20
bg-white/5
backdrop-blur-xl
p-6
text-white
"

>


<div className="text-3xl">

{item.icon}

</div>



<p className="mt-4 text-slate-400">

{t(item.key)}

</p>



<h2 className="text-5xl font-bold mt-2">

{item.value}

</h2>



</motion.div>


))}

</div>

)

}