import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import DashboardModules from "@/components/admin/DashboardModules";
import DashboardOverviewTitle from "@/components/admin/DashboardOverviewTitle";
import VisionCore from "@/components/admin/VisionCore";
import LiveStats from "@/components/admin/LiveStats";
import RecentActivity from "@/components/admin/RecentActivity";
import AdminHeader from "@/components/admin/AdminHeader";
import SystemMonitor from "@/components/admin/SystemMonitor";

import AdminSidebar from "@/components/admin/AdminSidebar";

import { authOptions } from "@/lib/auth";



export default async function Dashboard(){


  const session = await getServerSession(authOptions);



  if(!session){

    redirect("/admin/login");

  }



  const t = await getTranslations("adminDashboard");




  return (

    <div
      className="
      min-h-screen
      bg-[#020617]
      text-white
      "
    >


      <AdminSidebar />



      <main
        className="
        ml-72
        p-10
        "
      >



        {/* HEADER */}

        <AdminHeader
          name={session.user?.name || "Admin"}
        />





        {/* 3D VISION CORE */}

        <section className="mt-12">

          <VisionCore />

        </section>





        {/* LIVE STATISTICS */}

        <section className="mt-12">


          <DashboardOverviewTitle />



          <LiveStats />


        </section>







        {/* SYSTEM MONITOR */}

        <section className="mt-12">

          <SystemMonitor />

        </section>







        {/* RECENT ACTIVITY */}

        <section className="mt-12">

          <RecentActivity />

        </section>


      <DashboardModules />




      </main>



    </div>

  );

}