"use client";


import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";




export default function UsersPage(){



const t = useTranslations("usersAdmin");



const { data: session, status } = useSession();

const router = useRouter();





if(status === "loading"){


return (

<p className="text-white p-10">

{t("loading")}

</p>

);

}





if(session?.user?.role !== "ADMIN"){


router.push("/admin/dashboard");


return null;


}








const [users,setUsers]=useState<any[]>([]);





const [form,setForm]=useState({


name:"",

email:"",

password:"",

role:"MANAGER"

});







async function load(){



const res =

await fetch("/api/admin/users");



setUsers(

await res.json()

);



}






useEffect(()=>{


load();


},[]);









async function createUser(){



await fetch(

"/api/admin/users",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

}

);





setForm({


name:"",

email:"",

password:"",

role:"SALES"


});




load();



}









async function remove(id:string){



await fetch(


`/api/admin/users/${id}`,

{

method:"DELETE"

}

);




load();



}








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
text-slate-400
mt-2
">

{t("subtitle")}

</p>









<div className="
mt-10
rounded-3xl
border
border-cyan-400/20
bg-white/5
p-8
">





<h2 className="
text-2xl
font-bold
">

{t("create")}

</h2>








<div className="
grid
gap-4
mt-5
">





<input

className="input"

placeholder={t("name")}

value={form.name}

onChange={

e=>setForm({

...form,

name:e.target.value

})

}

/>







<input

className="input"

placeholder={t("email")}

value={form.email}

onChange={

e=>setForm({

...form,

email:e.target.value

})

}

/>







<input

className="input"

placeholder={t("password")}

value={form.password}

onChange={

e=>setForm({

...form,

password:e.target.value

})

}

/>







<select

className="input"

value={form.role}

onChange={

e=>setForm({

...form,

role:e.target.value

})

}

>


<option value="ADMIN">

ADMIN

</option>



<option value="MANAGER">

MANAGER

</option>



</select>







<button

onClick={createUser}

className="
rounded-xl
bg-cyan-400
py-3
font-bold
text-black
"

>


{t("createButton")}


</button>




</div>





</div>
      <div className="
      mt-10
      space-y-5
      ">





      {

      users.map(user=>(



      <div

      key={user.id}

      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-6
      flex
      justify-between
      "

      >





      <div>


      <h2 className="
      text-xl
      font-bold
      ">

      {user.name}

      </h2>





      <p className="
      text-slate-400
      ">

      {user.email}

      </p>




      </div>







      <div>


      <p className="text-cyan-400">

      {user.role}

      </p>





      <p>

      {user.status}

      </p>




      </div>








      <button

      onClick={()=>remove(user.id)}

      className="
      bg-red-500
      px-4
      py-2
      rounded-xl
      "

      >


      {t("delete")}


      </button>







      </div>



      ))

      }





      </div>








      </div>


      )

}