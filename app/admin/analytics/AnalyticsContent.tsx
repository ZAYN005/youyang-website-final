"use client";



import {useEffect,useState} from "react";
import { useTranslations } from "next-intl";



export default function AnalyticsPage(){


const t = useTranslations("analyticsAdmin");



const [data,setData]=useState<any>(null);



useEffect(()=>{


fetch("/api/admin/analytics")

.then(res=>res.json())

.then(setData);


},[]);





if(!data)

return(

<div className="
min-h-screen
bg-[#020617]
p-10
text-white
">

{t("loading")}

</div>

)





return(


<div className="
min-h-screen
bg-[#020617]
p-10
text-white
">





<h1 className="
text-4xl
font-bold
">

{t("title")}

</h1>





<p className="
mt-2
text-slate-400
">

{t("subtitle")}

</p>







<div className="
grid
md:grid-cols-5
gap-5
mt-10
">



{

Object.entries(data.status || {})

.map(

([key,value]:any)=>(



<div

key={key}

className="
rounded-3xl
border
border-cyan-400/20
bg-white/5
p-6
"

>



<p className="
text-slate-400
">

{key}

</p>




<h2 className="
text-3xl
font-bold
mt-3
">

{value}

</h2>




</div>



)

)

}



</div>









<div className="
grid
md:grid-cols-2
gap-8
mt-10
">








<div className="
rounded-3xl
border
border-white/10
bg-white/5
p-8
">



<h2 className="
text-2xl
font-bold
">

{t("productInterest")}

</h2>





{

Object.entries(data.products)

.map(

([key,value]:any)=>(



<div

key={key}

className="
mt-4
flex
justify-between
border-b
border-white/10
pb-3
"

>


<span>

{key}

</span>



<span className="
text-cyan-400
">

{value}

</span>



</div>



)

)

}



</div>






      <div className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-8
      ">



      <h2 className="
      text-2xl
      font-bold
      ">

      {t("countries")}

      </h2>






      {

      Object.entries(data.countries)

      .map(

      ([key,value]:any)=>(


      <div

      key={key}

      className="
      mt-4
      flex
      justify-between
      border-b
      border-white/10
      pb-3
      "

      >



      <span>

      {key}

      </span>




      <span className="
      text-green-400
      ">

      {value}

      </span>




      </div>



      )

      )

      }






      </div>





      </div>









      <div className="
      mt-10
      rounded-3xl
      border
      border-purple-400/20
      bg-white/5
      p-8
      ">




      <h2 className="
      text-2xl
      font-bold
      ">


      {t("recentLeads")}


      </h2>








      {


      data.recent.map(

      (item:any)=>(



      <div


      key={item.id}


      className="
      mt-5
      border-b
      border-white/10
      pb-4
      "


      >




      <div className="
      flex
      justify-between
      ">




      <span>

      {item.name}

      </span>





      <span className="
      text-cyan-400
      ">

      {item.status}

      </span>





      </div>







      <p className="
      text-slate-400
      ">

      {item.email}

      </p>





      </div>



      )

      )

      }







      </div>







</div>

)

}