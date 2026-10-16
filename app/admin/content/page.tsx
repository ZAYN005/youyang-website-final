import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import ContentManager from "./ContentManager";

import { authOptions } from "@/lib/auth";
import { hasModule, homePathFor } from "@/lib/permissions";


export const dynamic = "force-dynamic";


export default async function ContentPage(){

  const session = await getServerSession(authOptions);

  if(!session){
    redirect("/admin/login");
  }

  // only admins who were given 内容管理
  if(!hasModule(session.user?.role, session.user?.permissions, "content")){
    redirect(homePathFor(session.user?.role, session.user?.permissions));
  }

  return (

    <div className="min-h-screen bg-[#020617] text-white">

      <AdminSidebar />

      <main className="ml-72 p-10">

        <ContentManager />

      </main>

    </div>

  );

}
