import type { Metadata } from "next";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

import { getTranslations } from "next-intl/server";


export const metadata: Metadata = {

  title:
    "About Youyang Intelligent Control | AI Vision Technology Company",

  description:
    "Learn about Youyang Intelligent Control, an intelligent vision technology company developing panoramic sensing systems, AI recognition technologies, and advanced perception solutions.",

};



const capabilities = [
  {
    key: "one",
  },
  {
    key: "two",
  },
  {
    key: "three",
  },
];



export default async function CompanyPage() {


  const t = await getTranslations("company");



  return (

    <main>


      {/* Hero */}

      <section className="bg-space-navy py-24 text-white">

        <Container>


          <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">

            {t("hero.label")}

          </p>



          <h1 className="mt-5 text-5xl font-bold">

            {t("hero.title")}

          </h1>



          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">

            {t("hero.description")}

          </p>


        </Container>


      </section>






      {/* About */}

      <section className="py-20">

        <Container>


          <div className="grid gap-12 lg:grid-cols-2">


            <div>


              <h2 className="text-3xl font-bold text-navy">

                {t("overview.title")}

              </h2>



              <p className="mt-6 leading-relaxed text-text-muted">

                {t("overview.description")}

              </p>


            </div>





            <div className="rounded-3xl bg-gray-bg p-10">


              <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue">

                {t("established")}

              </p>



              <p className="mt-4 text-6xl font-bold text-navy">

                {t("year")}

              </p>



              <p className="mt-3 text-text-muted">

                {t("establishedDescription")}

              </p>


            </div>



          </div>


        </Container>


      </section>







      {/* Mission Vision Values */}


      <section className="bg-gray-bg py-20">


        <Container>



          <div className="grid gap-8 lg:grid-cols-3">





            {/* Mission */}

            <div className="rounded-2xl bg-white p-8">


              <h3 className="text-2xl font-bold text-navy">

                {t("mission.title")}

              </h3>



              <p className="mt-5 leading-relaxed text-text-muted">

                {t("mission.description")}

              </p>



            </div>







            {/* Vision */}


            <div className="rounded-2xl bg-white p-8">


              <h3 className="text-2xl font-bold text-navy">

                {t("vision.title")}

              </h3>



              <p className="mt-5 leading-relaxed text-text-muted">

                {t("vision.description")}

              </p>



            </div>








            {/* Values */}


            <div className="rounded-2xl bg-white p-8">


              <h3 className="text-2xl font-bold text-navy">

                {t("values.title")}

              </h3>



              <p className="mt-5 leading-relaxed text-text-muted">

                {t("values.description")}

              </p>



            </div>





          </div>



        </Container>



      </section>







      {/* Technology Capability */}


      <section className="py-20">


        <Container>



          <h2 className="text-3xl font-bold text-navy">

            {t("capabilityTitle")}

          </h2>





          <div className="mt-10 grid gap-6 lg:grid-cols-3">



            {capabilities.map((item)=>(


              <div

                key={item.key}

                className="rounded-2xl border bg-white p-8"

              >


                <h3 className="text-xl font-bold text-navy">

                  {t(`capabilities.${item.key}.title`)}

                </h3>




                <p className="mt-4 text-text-muted">

                  {t(`capabilities.${item.key}.description`)}

                </p>



              </div>



            ))}



          </div>



        </Container>



      </section>





    </main>

  );

}