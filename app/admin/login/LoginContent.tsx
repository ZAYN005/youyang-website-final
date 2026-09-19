"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";



export default function LoginContent() {


  const t = useTranslations("adminLogin");


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();



  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);


    const result = await signIn(
      "credentials",
      {
        email,
        password,
        redirect: false,
      }
    );


    if (result?.ok) {

      router.push("/admin/dashboard");

    } else {

      alert(t("invalid"));

    }


    setLoading(false);

  };



  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-space-navy
      relative
      overflow-hidden
    ">



      <div className="
        absolute
        inset-0
        opacity-20
        bg-[radial-gradient(circle_at_top,#00d9ff,transparent_40%)]
      "/>



      <div className="
        absolute
        inset-0
        bg-[linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)]
        bg-[size:50px_50px]
      "/>





      <div className="
        relative
        z-10
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-10
        shadow-2xl
      ">


        <div className="text-center">


          <Image

            src="/logo.png"

            alt="Youyang"

            width={90}

            height={90}

            className="mx-auto"

          />


          <h1 className="
            mt-6
            text-3xl
            font-bold
            text-white
          ">

            {t("title")}

          </h1>


          <p className="
            mt-3
            text-sm
            text-slate-400
          ">

            {t("description")}

          </p>


        </div>





        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >


          <input

            type="email"

            placeholder={t("email")}

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/20
              px-5
              py-4
              text-white
              outline-none
              focus:border-tech-cyan
            "

          />





          <input

            type="password"

            placeholder={t("password")}

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/20
              px-5
              py-4
              text-white
              outline-none
              focus:border-tech-cyan
            "

          />






          <button

            className="
              w-full
              rounded-xl
              bg-gold
              py-4
              font-bold
              text-navy
              transition
              hover:scale-[1.02]
            "

          >

            {loading
              ? t("authenticating")
              : t("button")
            }


          </button>





        </form>






        <p className="
          mt-8
          text-center
          text-xs
          text-slate-500
        ">

          {t("protected")}

        </p>





      </div>




    </main>

  );

}