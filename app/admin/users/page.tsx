import AdminSidebar from "@/components/admin/AdminSidebar";

import UsersContent from "./UsersContent";


export const dynamic = "force-dynamic";


export default function UsersPage(){

  return (

    <div className="min-h-screen bg-[#020617] text-white">

      <AdminSidebar />

      <main className="ml-72 p-10">

        <UsersContent />

      </main>

    </div>

  );

}
