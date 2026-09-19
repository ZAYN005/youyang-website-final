"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";



export default function InquiryCRM(){


const t = useTranslations("inquiryCRM");


const [data,setData] = useState<any>(null);

const [search,setSearch] = useState("");

const [selected,setSelected] = useState<any>(null);

const [loading,setLoading] = useState(false);





async function load(){


const res = await fetch(
"/api/admin/inquiries"
);


const json = await res.json();


setData(json);


}





useEffect(()=>{

load();

},[]);







async function save(){


if(!selected) return;


setLoading(true);




const res = await fetch(

`/api/admin/inquiries/${selected.id}`,

{

method:"PATCH",

headers:{

"Content-Type":"application/json"


},

body:JSON.stringify({

status:selected.status,

priority:selected.priority,

adminNote:selected.adminNote || "",

assignedTo:selected.assignedTo || ""

})

}


);




setLoading(false);




if(res.ok){


alert(t("updated"));

await load();


}

else{


alert(t("updateFailed"));


}




}








async function remove(){


if(!selected) return;




const confirmDelete = confirm(

t("confirmDelete")

);




if(!confirmDelete) return;






const res = await fetch(

`/api/admin/inquiries/${selected.id}`,

{

method:"DELETE"

}

);






if(res.ok){


alert(t("deleted"));

setSelected(null);

load();



}

else{


alert(t("deleteFailed"));


}



}








if(!data){


return (

<div className="
min-h-screen
bg-[#020617]
p-10
text-white
">


{t("loading")}


</div>

)


}








const filtered = (data.inquiries || []).filter(


(item:any)=>


`${item.name}

${item.email}

${item.company}

${item.country}

${item.productInterest}`

.toLowerCase()

.includes(

search.toLowerCase()

)



);








return (


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
mt-8
">





{


Object.entries(data.stats).map(


([key,value]:any)=>(



<div


key={key}


className="
rounded-2xl
border
border-cyan-400/20
bg-white/5
p-5
"



>


<p className="
text-slate-400
capitalize
">


{key}


</p>




<h2 className="
text-3xl
font-bold
mt-2
">


{value}


</h2>




</div>



)


)


}





</div>









<input


className="
mt-10
w-full
rounded-xl
border
border-white/20
bg-white/10
p-4
"



placeholder={t("search")}



value={search}



onChange={

e=>setSearch(e.target.value)

}



/>









<div className="
mt-8
grid
md:grid-cols-2
gap-6
">







<div className="
space-y-4
">





{


filtered.map((item:any)=>(



<div


key={item.id}


onClick={()=>setSelected(item)}



className="
cursor-pointer
rounded-2xl
border
border-white/10
bg-white/5
p-6
hover:border-cyan-400
"



>



<div className="
flex
justify-between
">



<h2 className="
text-xl
font-bold
">


{item.name}


</h2>




<span className="
text-green-400
">


{item.status}


</span>




</div>





<p className="
mt-2
text-slate-400
">


{item.email}


</p>





<p>


{item.company || t("noCompany")}


</p>





</div>



))


}






</div>
{


selected &&


<div className="
rounded-3xl
border
border-cyan-400/20
bg-white/5
p-8
">





<h2 className="
text-3xl
font-bold
">


{t("details")}


</h2>







<div className="
mt-6
space-y-3
">



<p>
{t("name")}: {selected.name}
</p>



<p>
{t("email")}: {selected.email}
</p>



<p>
{t("country")}: {selected.country || "N/A"}
</p>



<p>
{t("product")}: {selected.productInterest || "N/A"}
</p>



<p>
{t("solution")}: {selected.solutionInterest || "N/A"}
</p>

<div className="
mt-6
rounded-xl
bg-black/30
p-5
">

<p className="text-slate-400">
Message
</p>

<p className="mt-3 leading-relaxed">
{selected.message || "No message provided"}
</p>

</div>

</div>










<label className="
block
mt-6
text-slate-400
">


{t("status")}


</label>




<select


className="
mt-2
w-full
rounded-xl
bg-black/30
p-3
"



value={selected.status}



onChange={e=>



setSelected({

...selected,

status:e.target.value

})


}



>


<option>New</option>

<option>Reviewing</option>

<option>Contacted</option>

<option>Qualified</option>

<option>Closed</option>



</select>









<label className="
block
mt-6
text-slate-400
">


{t("priority")}


</label>





<select


className="
mt-2
w-full
rounded-xl
bg-black/30
p-3
"



value={selected.priority || "Medium"}



onChange={e=>



setSelected({

...selected,

priority:e.target.value

})


}



>


<option>High</option>

<option>Medium</option>

<option>Low</option>



</select>









<label className="
block
mt-6
text-slate-400
">


{t("note")}


</label>





<textarea


rows={5}



className="
mt-2
w-full
rounded-xl
bg-black/30
p-4
"



value={
selected.adminNote || ""
}



onChange={e=>



setSelected({

...selected,

adminNote:e.target.value

})


}



/>









<button


onClick={save}



disabled={loading}



className="
mt-6
w-full
rounded-xl
bg-cyan-400
py-3
font-bold
text-black
"



>


{


loading

?

t("saving")

:

t("save")


}



</button>









<button


onClick={remove}



className="
mt-3
w-full
rounded-xl
bg-red-500
py-3
font-bold
"



>


{t("delete")}



</button>





</div>


}





</div>





</div>


)

}