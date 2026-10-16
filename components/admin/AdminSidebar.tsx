"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { ModuleKey, TOP_ADMIN_ROLE, effectiveModules } from "@/lib/permissions";


const menu: { key: string; module: ModuleKey | null; link: string }[] = [

{
key:"command",
module:"dashboard",
link:"/admin/dashboard"
},

{
key:"inquiries",
module:"inquiries",
link:"/admin/inquiries"
},

{
key:"content",
module:"content",
link:"/admin/content"
},



{
key:"analytics",
module:"analytics",
link:"/admin/analytics"
},

{
key:"users",
module:null,
link:"/admin/users"
},

{
key:"settings",
module:null,
link:"/admin/settings"
}

];



export default function AdminSidebar(){


const pathname = usePathname();

const { data: session, status } = useSession();

// each admin only sees the modules given to them in 用户管理
const role = session?.user?.role;
const modules = effectiveModules(role, session?.user?.permissions);

const items =
status === "loading"
? []
: menu.filter((item) =>
role === TOP_ADMIN_ROLE
|| (item.module !== null && modules.includes(item.module))
);

const t = useTranslations("adminSidebar");



return (

<aside
className="
fixed
left-0
top-0
h-screen
w-72
bg-[#020617]/90
border-r
border-cyan-400/20
backdrop-blur-xl
p-8
text-white
z-50
flex
flex-col
"
>


{/* Logo */}

<div>

<h1
className="
text-3xl
font-black
tracking-wider
text-cyan-400
"
>
YOUYANG
</h1>


<p
className="
mt-2
text-sm
text-slate-400
"
>
{t("subtitle")}
</p>


</div>





{/* Menu */}

<nav
className="
mt-12
space-y-3
flex-1
"
>


{

items.map((item)=>(


<Link

key={item.key}

href={item.link}

className={`

block

rounded-xl

p-4

transition-all

duration-300

border

${
(pathname === item.link || pathname.startsWith(item.link + "/"))
?
"bg-cyan-400/20 border-cyan-400 text-cyan-400"
:
"border-transparent text-slate-300 hover:bg-white/5 hover:text-cyan-400"
}

`}

>


<div className="
flex
items-center
justify-between
">


<span>
{t(`menu.${item.key}`)}
</span>


{
(pathname === item.link || pathname.startsWith(item.link + "/")) &&
<span>
●
</span>
}


</div>


</Link>


))

}


</nav>





{/* Footer */}

<div
className="
rounded-2xl
border
border-green-400/20
bg-green-400/5
p-5
"
>


<p
className="
text-xs
text-slate-400
uppercase
tracking-widest
"
>
{t("status")}
</p>



<p
className="
mt-3
text-green-400
font-bold
"
>
● {t("online")}
</p>


<p
className="
mt-2
text-xs
text-slate-500
"
>
{t("infrastructure")}
</p>


</div>




</aside>


);


}