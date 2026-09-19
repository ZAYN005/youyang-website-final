"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";



export default function RecentActivity(){


const t = useTranslations("recentActivity");


const [items,setItems] = useState<any[]>([]);



useEffect(()=>{


fetch("/api/admin/stats")

.then(res=>res.json())

.then(data=>{

setItems(data.recent || []);

});


},[]);




return (


<div className="
mt-10
rounded-3xl
border
border-cyan-400/20
bg-white/5
backdrop-blur-xl
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
mt-6
space-y-4
">





{
items.length === 0 ? (


<p className="text-slate-400">

{t("empty")}

</p>



) : (



items.map((item)=>(


<div

key={item.id}

className="
rounded-2xl
border
border-white/10
bg-black/20
p-5
"

>



<div className="
flex
justify-between
">



<h3 className="font-bold">

🟢 {item.name}

</h3>





<span className="
text-sm
text-slate-400
">

{new Date(item.createdAt)
.toLocaleDateString()}

</span>




</div>







<p className="mt-2 text-slate-400">

{item.company || t("individual")}

</p>







<p className="mt-2">

{t("product")}

{" "}

{item.productInterest || t("notSelected")}

</p>







<p>

{t("solution")}

{" "}

{item.solutionInterest || t("notSelected")}

</p>







</div>



))


)



}





</div>





</div>



);


}