"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";

import {
  FaLinkedinIn,
  FaYoutube,
  FaWeixin,
} from "react-icons/fa";


export default function Footer() {

  const locale = useLocale();

  const t = useTranslations("footer");


  return (

    <footer className="bg-space-navy text-white">


      <div className="mx-auto max-w-[1200px] px-6 py-16">


        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">



          {/* Brand */}

          <div className="lg:col-span-2">


            <Link
              href={`/${locale}`}
              className="flex items-center gap-3"
            >

              <img
                src="/logo.png"
                alt="Youyang Intelligent Control"
                className="h-12 w-auto object-contain"
              />


              <div className="leading-tight">

                <p className="text-xl font-bold">
                  YOUYANG
                </p>

                <p className="text-xs text-slate-400">
                  Intelligent Control
                </p>

              </div>


            </Link>




            <p className="mt-5 max-w-sm leading-relaxed text-slate-300">

              {t("description")}

            </p>




            {/* Social */}

            <div className="mt-8">


              <p className="text-sm font-semibold">

                {t("follow")}

              </p>



              <div className="mt-4 flex items-center gap-5 text-xl text-slate-300">


                <Link
                  href="#"
                  className="transition hover:text-white"
                >

                  <FaLinkedinIn />

                </Link>



                <Link
                  href="#"
                  className="transition hover:text-white"
                >

                  <FaYoutube />

                </Link>



                <FaWeixin
                  className="cursor-pointer transition hover:text-white"
                />


              </div>


            </div>


          </div>





          {/* Company */}


          <div>


            <h3 className="font-semibold">

              {t("company.title")}

            </h3>



            <ul className="mt-5 space-y-3 text-sm text-slate-300">


              <li>

                <Link href={`/${locale}/company`}>

                  {t("company.about")}

                </Link>

              </li>



              <li>

                <Link href={`/${locale}/company/technology`}>

                  {t("company.technology")}

                </Link>

              </li>



              <li>

                {t("company.rd")}

              </li>



              <li>

                {t("company.partners")}

              </li>


            </ul>


          </div>






          {/* Products */}


          <div>


            <h3 className="font-semibold">

              {t("products.title")}

            </h3>



            <ul className="mt-5 space-y-3 text-sm text-slate-300">


              <li>

                <Link href={`/${locale}/products/360-sentinel`}>

                  {t("products.sentinel")}

                </Link>

              </li>



              <li>

                <Link href={`/${locale}/products/dome-watch`}>

                  {t("products.dome")}

                </Link>

              </li>



              <li>

                <Link href={`/${locale}/products/wide-area-guardian`}>

                  {t("products.guardian")}

                </Link>

              </li>


            </ul>


          </div>






          {/* Solutions */}


          <div>


            <h3 className="font-semibold">

              {t("solutions.title")}

            </h3>




            <ul className="mt-5 space-y-3 text-sm text-slate-300">


              <li>

                <Link href={`/${locale}/solutions/urban-public-spaces`}>

                  {t("solutions.urban")}

                </Link>

              </li>




              <li>

                <Link href={`/${locale}/solutions/transportation-hubs-critical-sites`}>

                  {t("solutions.transportation")}

                </Link>

              </li>




              <li>

                <Link href={`/${locale}/solutions/campuses-educational-institutions`}>

                  {t("solutions.campuses")}

                </Link>

              </li>




              <li>

                <Link href={`/${locale}/solutions/healthcare-senior-care`}>

                  {t("solutions.healthcare")}

                </Link>

              </li>




              <li>

                <Link href={`/${locale}/solutions/high-security-facilities`}>

                  {t("solutions.security")}

                </Link>

              </li>




              <li>

                <Link href={`/${locale}/solutions/commercial-industrial-worksites`}>

                  {t("solutions.industrial")}

                </Link>

              </li>


            </ul>


          </div>






          {/* Contact */}


          <div>


            <h3 className="font-semibold">

              {t("contactTitle")}

            </h3>



            <ul className="mt-5 space-y-3 text-sm text-slate-300">


              <li>

                📞 {siteConfig.contact.phone}

              </li>



              <li>

                ✉ {siteConfig.contact.email}

              </li>



              <li className="leading-relaxed">

                {siteConfig.contact.address}

              </li>


            </ul>


          </div>



        </div>







        {/* Bottom */}


        <div
          className="
          mt-12 flex flex-col gap-3
          border-t border-white/10
          pt-6 text-sm text-slate-400
          md:flex-row md:justify-between
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