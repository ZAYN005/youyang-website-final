import type { Metadata } from "next";

import Link from "next/link";

import Container from "@/components/ui/Container";

import Button from "@/components/ui/Button";

import { useTranslations, useLocale } from "next-intl";



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



          <div className="grid gap-10 lg:grid-cols-2">



            {solutions.map((solution,index)=>(



              <Link

                key={solution.key}

                href={`/${locale}${solution.link}`}

                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"

              >



                <div className="h-72 overflow-hidden">


                  <img

                    src={solution.image}

                    alt={t(`items.${solution.key}.title`)}

                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"

                  />


                </div>





                <div className="p-8">



                  <p className="text-sm font-bold uppercase tracking-wider text-brand-blue">

                    0{index+1} / {t("solutionLabel")}

                  </p>




                  <h2 className="mt-4 text-3xl font-bold text-navy">


                    {t(`items.${solution.key}.title`)}


                  </h2>




                  <p className="mt-4 text-text-muted">


                    {t(`items.${solution.key}.description`)}


                  </p>





                  <div className="mt-6 border-t pt-5">


                    <h3 className="font-bold text-navy">

                      {t("coverage")}

                    </h3>



                    <p className="mt-2 text-sm text-text-muted">


                      {t(`items.${solution.key}.coverage`)}


                    </p>



                  </div>






                  <div className="mt-5">


                    <h3 className="font-bold text-navy">


                      {t("coreValue")}


                    </h3>




                    <p className="mt-2 text-sm text-text-muted">


                      {t(`items.${solution.key}.value`)}


                    </p>



                  </div>






                  <ul className="mt-6 space-y-2 text-sm text-text-muted">



                    {solution.features.map(feature => (



                      <li key={feature}>


                        ✓ {t(`features.${feature}`)}


                      </li>



                    ))}



                  </ul>





                  <p className="mt-7 font-semibold text-brand-blue">


                    {t("explore")} →


                  </p>





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