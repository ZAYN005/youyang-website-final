import type { Metadata } from "next";

import Link from "next/link";

import Container from "@/components/ui/Container";

import Button from "@/components/ui/Button";

import { useTranslations, useLocale } from "next-intl";

import { FiArrowRight, FiCheck, FiMapPin, FiTarget } from "react-icons/fi";



export const metadata: Metadata = {

  title:
    "AI Intelligent Vision Solutions | Public Safety, Transportation & Smart City Applications | Youyang Intelligent Control",

  description:
    "Explore Youyang Intelligent Control's intelligent vision solutions for urban public spaces, transportation hubs, critical infrastructure, healthcare, high-security facilities, and industrial environments.",

};




const solutions = [

  {
    key: "urban",
    image: "/solutions/plaza.png",
    link: "/solutions/urban-public-spaces",
    features: [
      "crowd",
      "behavior",
      "awareness",
    ],
  },


  {
    key: "transportation",
    image: "/solutions/airport.png",
    link: "/solutions/transportation-hubs-critical-sites",
    features: [
      "intrusion",
      "trajectory",
      "monitoring",
    ],
  },


  {
    key: "campus",
    image: "/solutions/campus.jpg",
    link: "/solutions/campuses-educational-institutions",
    features: [
      "perimeter",
      "safety",
      "intelligent",
    ],
  },


  {
    key: "healthcare",
    image: "/solutions/healthcare.jpg",
    link: "/solutions/healthcare-senior-care",
    features: [
      "critical",
      "risk",
      "patient",
    ],
  },


  {
    key: "security",
    image: "/solutions/high-security.jpg",
    link: "/solutions/high-security-facilities",
    features: [
      "intrusion",
      "behavior",
      "asset",
    ],
  },


  {
    key: "industrial",
    image: "/solutions/industrial-worksite.jpg",
    link: "/solutions/commercial-industrial-worksites",
    features: [
      "safety",
      "hazard",
      "security",
    ],
  },

];




const products = [

  {
    key: "sentinel",
    image: "/products/360-sentinel.png",
    link: "/products/360-sentinel",
  },


  {
    key: "dome",
    image: "/products/dome-watch.png",
    link: "/products/dome-watch",
  },


  {
    key: "guardian",
    image: "/products/wide-area-guardian.jpg",
    link: "/products/wide-area-guardian",
  },

];




export default function SolutionsPage() {


  const t = useTranslations("solutions");

  const locale = useLocale();



  return (

    <main>
            {/* Hero */}

      <section className="bg-space-navy py-24 text-white">


        <Container>


          <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">

            {t("hero.label")}

          </p>




          <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-tight">


            {t("hero.title")}


          </h1>




          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">


            {t("hero.description")}


          </p>



        </Container>


      </section>






      {/* Solutions */}

      <section className="py-20">

        <Container>

          <div className="grid gap-8 lg:grid-cols-2">

            {solutions.map((solution, index) => (

              <Link
                key={solution.key}
                href={`/${locale}${solution.link}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-brand-blue/30 hover:shadow-2xl"
              >

                {/* Image */}

                <div className="relative h-64 overflow-hidden sm:h-72">

                  <img
                    src={solution.image}
                    alt={t(`items.${solution.key}.title`)}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-space-navy via-space-navy/40 to-transparent" />

                  <span className="absolute left-6 top-6 rounded-full border border-white/25 bg-space-navy/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")} / {t("solutionLabel")}
                  </span>

                  <h2 className="absolute inset-x-6 bottom-6 text-2xl font-bold leading-snug text-white sm:text-3xl">
                    {t(`items.${solution.key}.title`)}
                  </h2>

                </div>

                {/* Body */}

                <div className="flex flex-1 flex-col p-6 sm:p-8">

                  <p className="leading-relaxed text-text-muted">
                    {t(`items.${solution.key}.description`)}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    <div className="rounded-2xl bg-slate-50 p-5">

                      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue">
                        <FiMapPin aria-hidden className="h-4 w-4" />
                        {t("coverage")}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-text-dark">
                        {t(`items.${solution.key}.coverage`)}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5">

                      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue">
                        <FiTarget aria-hidden className="h-4 w-4" />
                        {t("coreValue")}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-text-dark">
                        {t(`items.${solution.key}.value`)}
                      </p>

                    </div>

                  </div>

                  <ul className="mt-6 flex flex-wrap gap-2">

                    {solution.features.map((feature) => (

                      <li
                        key={feature}
                        className="flex items-center gap-1.5 rounded-full border border-tech-cyan/40 bg-tech-cyan/10 px-3 py-1.5 text-xs font-medium text-navy"
                      >
                        <FiCheck aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
                        {t(`features.${feature}`)}
                      </li>

                    ))}

                  </ul>

                  <div className="mt-auto pt-8">

                    <div className="flex items-center justify-between border-t border-border pt-6">

                      <span className="font-semibold text-brand-blue">
                        {t("explore")}
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue transition duration-300 group-hover:translate-x-1 group-hover:bg-brand-blue group-hover:text-white">
                        <FiArrowRight aria-hidden className="h-5 w-5" />
                      </span>

                    </div>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </Container>

      </section>

            {/* Architecture */}

      <section className="bg-gray-bg py-20">


        <Container>


          <div className="text-center">



            <p className="text-sm uppercase tracking-[0.3em] text-brand-blue">

              {t("architecture.label")}

            </p>




            <h2 className="mt-4 text-4xl font-bold text-navy">


              {t("architecture.title")}


            </h2>



          </div>





          <div className="mt-12 rounded-3xl bg-white p-6 shadow-sm">


            <img

              src="/solutions/architecture.png"

              alt={t("architecture.title")}

              className="w-full object-contain"

            />



          </div>




        </Container>


      </section>







      {/* Products */}


      <section className="py-20">


        <Container>




          <h2 className="text-center text-4xl font-bold text-navy">


            {t("productsTitle")}


          </h2>






          <div className="mt-12 grid gap-8 md:grid-cols-3">



            {products.map(product => (



              <Link

                key={product.key}

                href={`/${locale}${product.link}`}

                className="rounded-3xl bg-white p-8 shadow-sm hover:shadow-xl"

              >




                <img

                  src={product.image}

                  alt={t(`products.${product.key}.name`)}

                  className="h-52 w-full object-contain"

                />





                <h3 className="mt-6 text-2xl font-bold text-navy">


                  {t(`products.${product.key}.name`)}


                </h3>





                <p className="mt-3 text-text-muted">


                  {t(`products.${product.key}.description`)}


                </p>





              </Link>



            ))}




          </div>





        </Container>



      </section>





    </main>

  );


}