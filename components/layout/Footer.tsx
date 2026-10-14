"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";


import {
  FaLinkedinIn,
  FaYoutube,
  FaWeixin,
} from "react-icons/fa";


export interface FooterLink {
  href: string;
  label: string;
}


export default function Footer({
  products,
  solutions,
}: {
  products: FooterLink[];
  solutions: FooterLink[];
}) {

  const locale = useLocale();

  const t = useTranslations("footer");

  const tContact = useTranslations("contact");


  return (

    <footer className="bg-space-navy text-white">


      <div
        className="
        mx-auto
        max-w-[1200px]
        px-6
        py-10
        "
      >


        <div
          className="
          grid
          gap-10
          lg:grid-cols-5
          "
        >




          {/* PRODUCTS */}

          <div className="relative group">


            <h3
              className="
              cursor-pointer
              font-semibold
              "
            >
              {t("products.title")}
            </h3>



            <div
              className="
              absolute
              left-0
              top-10
              z-50
              hidden
              w-56
              rounded-2xl
              border
              border-white/10
              bg-[#101d35]/95
              p-5
              shadow-2xl
              backdrop-blur-md
              group-hover:block
              "
            >

              <ul
                className="
                max-h-80
                space-y-2
                overflow-y-auto
                text-sm
                text-slate-200
                "
              >

                {products.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={`/${locale}${item.href}`}
                      className="
                    block
                    rounded-lg
                    px-3
                    py-2
                    transition
                    hover:bg-blue-500/10
                    hover:text-cyan-300
                    "
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

              </ul>


            </div>


          </div>









          {/* SOLUTIONS */}

          <div className="relative group">


            <h3
              className="
              cursor-pointer
              font-semibold
              "
            >
              {t("solutions.title")}
            </h3>



            <div
              className="
              absolute
              left-0
              top-10
              z-50
              hidden
              w-64
              rounded-2xl
              border
              border-white/10
              bg-[#101d35]/95
              p-5
              shadow-2xl
              backdrop-blur-md
              group-hover:block
              "
            >


              <ul
                className="
                max-h-80
                space-y-2
                overflow-y-auto
                text-sm
                text-slate-200
                "
              >

                {solutions.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={`/${locale}${item.href}`}
                      className="
                    block
                    rounded-lg
                    px-3
                    py-2
                    transition
                    hover:bg-blue-500/10
                    hover:text-cyan-300
                    "
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

              </ul>


            </div>


          </div>









          {/* FOLLOW US */}

          <div>


            <h3 className="font-semibold">

              {t("follow")}

            </h3>



            <div
              className="
              mt-4
              flex
              items-center
              gap-5
              text-xl
              text-slate-300
              "
            >


              <Link
                href="#"
                className="hover:text-white transition"
              >
                <FaLinkedinIn />
              </Link>



              <Link
                href="#"
                className="hover:text-white transition"
              >
                <FaYoutube />
              </Link>




              <div className="relative group">


                <button
                  className="hover:text-white transition"
                >
                  <FaWeixin />
                </button>



                <div
                  className="
                  absolute
                  bottom-10
                  left-1/2
                  hidden
                  w-52
                  -translate-x-1/2
                  rounded-xl
                  bg-white
                  p-4
                  shadow-xl
                  group-hover:block
                  "
                >

                  <img
                    src={t("wechatQr")}
                    alt="WeChat QR Code"
                    className="
                    mx-auto
                    h-36
                    w-36
                    object-contain
                    "
                  />

                  <p
                    className="
                    mt-3
                    text-center
                    text-sm
                    text-slate-600
                    "
                  >
                    {t("wechatScan")}
                  </p>


                </div>


              </div>


            </div>


          </div>









          {/* CONTACT */}

          <div>


            <h3 className="font-semibold">

              {t("contactTitle")}

            </h3>



            <p
              className="
              mt-4
              text-sm
              text-slate-300
              "
            >

              📞 {tContact("info.phone")}

            </p>



            <p
              className="
              mt-2
              text-sm
              text-slate-300
              "
            >

              ✉ {tContact("info.email")}

            </p>


          </div>









          {/* ADDRESS */}

          <div>


            <h3 className="font-semibold">

              {t("addressTitle")}

            </h3>



            <p
              className="
              mt-4
              text-sm
              leading-relaxed
              text-slate-300
              "
            >

              {tContact("info.address")}

            </p>


          </div>




        </div>






        {/* COPYRIGHT */}

        <div
          className="
          mt-10
          border-t
          border-white/10
          pt-5
          text-sm
          text-slate-400
          "
        >

          <p>

            {t("copyright")}

          </p>


        </div>



      </div>


    </footer>

  );

}