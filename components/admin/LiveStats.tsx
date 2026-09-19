"use client";

import {useEffect,useState} from "react";
import { useTranslations } from "next-intl";



export default function LiveStats(){


const t = useTranslations("liveStats");


const [data,setData]=useState<any>(null);



useEffect(()=>{


fetch("/api/admin/stats")

.then(res=>res.json())

.then(setData);


},[]);





if(!data){

return (

<div className="text-white">

{t("loading")}

</div>

)

}





const cards=[

{
title:t("total"),
value:data.total
},

{
title:t("leads"),
value:data.newLeads
},

{
title:t("system"),
value:t("online")
}

];



return (


<div className="
grid
md:grid-cols-3
gap-6
">





{cards.map(card=>(


<div

key={card.title}

className="
rounded-3xl
border
border-cyan-400/20
bg-white/5
backdrop-blur-xl
p-8
text-white
"

>



<p className="text-slate-400">

{card.title}

</p>




<h2 className="
mt-4
text-5xl
font-bold
">

{card.value}

</h2>




</div>



))}



</div>


)

}