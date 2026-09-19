"use client";


export default function AdminLanguageSwitcher({

locale,
setLocale

}:{

locale:"en" | "zh";

setLocale:(value:"en"|"zh")=>void;

}){


return (


<div className="
fixed
top-5
right-5
z-[100]
flex
gap-2
rounded-xl
bg-black/40
border
border-white/10
p-2
">


<button

onClick={()=>setLocale("en")}

className={`
px-4
py-2
rounded-lg
font-semibold
${locale==="en"
?
"bg-cyan-400 text-black"
:
"text-white"
}
`}

>

English

</button>




<button

onClick={()=>setLocale("zh")}

className={`
px-4
py-2
rounded-lg
font-semibold
${locale==="zh"
?
"bg-cyan-400 text-black"
:
"text-white"
}
`}

>

中文

</button>



</div>


);


}