import { getTranslations } from "next-intl/server";


export default async function SystemStatus(){


const t = await getTranslations("systemStatus");



const systems=[

"engine",

"database",

"network",

"security"

];


return (

<div className="
mt-8
rounded-3xl
border
border-white/10
bg-black/30
p-8
text-white
">


<h2 className="
text-xl
font-bold
">

{t("title")}

</h2>




<div className="
mt-6
space-y-4
">


{systems.map(item=>(

<p key={item}>

🟢 {t(item)}

</p>

))}


</div>



</div>

);


}