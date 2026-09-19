import type { Metadata } from "next";

import Container from "@/components/ui/Container";

import Button from "@/components/ui/Button";

import { useTranslations, useLocale } from "next-intl";



export const metadata: Metadata = {

  title:
    "Urban Public Spaces | AI Public Safety Solutions | Youyang Intelligent Control",

  description:
    "Youyang Intelligent Control provides AI-powered intelligent sensing solutions for urban public spaces, supporting crowd monitoring, abnormal activity detection, emergency response, and public safety management.",

};




const challenges = [

  "crowd",

  "abnormal",

  "blindspots",

  "emergency",

];




const capabilities = [

  "crowdMonitoring",

  "fallDetection",

  "dangerousObject",

  "wideArea",

  "securityAnalysis",

];




const applications = [

  "squares",

  "sports",

  "parks",

  "streets",

];





export default function UrbanPublicSpacesPage() {


  const t = useTranslations("urbanPublicSpaces");

    const locale = useLocale();



  return (

    <main>



      {/* Hero */}


      <section className="relative overflow-hidden bg-space-navy py-24 text-white">


        <Container>


          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">



            <div>


              <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">

                {t("hero.label")}

              </p>



              <h1 className="mt-5 text-5xl font-bold leading-tight">

                {t("hero.title")}

              </h1>



              <p className="mt-6 text-lg leading-relaxed text-slate-300">

                {t("hero.description")}

              </p>




              <div className="mt-8">


                <Button href={`/${locale}/contact`}>
  {t("hero.button")} →
</Button>


              </div>



            </div>




            <div className="overflow-hidden rounded-3xl">


              <img

                src="/solutions/urban-public-space.jpg"

                alt={t("hero.title")}

                className="h-[420px] w-full object-cover"

              />


            </div>



          </div>



        </Container>


      </section>





      {/* Overview */}


      <section className="py-20">


        <Container>



          <h2 className="text-3xl font-bold text-navy">

            {t("overview.title")}

          </h2>




          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-text-muted">

            {t("overview.description")}

          </p>



        </Container>


      </section>





      {/* Challenges */}


      <section className="bg-gray-bg py-20">


        <Container>



          <h2 className="text-3xl font-bold text-navy">

            {t("challenges.title")}

          </h2>



          <div className="mt-10 grid gap-5 md:grid-cols-2">



            {challenges.map((item)=>(


              <div

                key={item}

                className="rounded-2xl bg-white p-6 shadow-sm"

              >


                <p className="font-medium text-navy">

                  ✓ {t(`challenges.items.${item}`)}

                </p>


              </div>



            ))}



          </div>



        </Container>


      </section>
            {/* Intelligent Capabilities */}


      <section className="py-20">


        <Container>


          <h2 className="text-3xl font-bold text-navy">

            {t("capabilities.title")}

          </h2>




          <div className="mt-10 grid gap-6 md:grid-cols-2">



            {capabilities.map((item)=>(



              <div

                key={item}

                className="rounded-2xl border p-7"

              >


                <h3 className="font-bold text-navy">

                  {t(`capabilities.items.${item}`)}

                </h3>


              </div>



            ))}



          </div>



        </Container>


      </section>







      {/* Application Areas */}



      <section className="bg-gray-bg py-20">


        <Container>



          <h2 className="text-3xl font-bold text-navy">

            {t("applications.title")}

          </h2>





          <div className="mt-8 grid gap-5 md:grid-cols-2">



            {applications.map((item)=>(



              <div

                key={item}

                className="rounded-xl bg-white p-6 font-semibold text-navy"

              >


                ✓ {t(`applications.items.${item}`)}



              </div>



            ))}



          </div>



        </Container>


      </section>







      {/* Products */}



      <section className="py-20">


        <Container>




          <h2 className="text-3xl font-bold text-navy">

            {t("products.title")}

          </h2>





          <div className="mt-8 grid gap-6 md:grid-cols-3">





            <div className="rounded-2xl bg-gray-bg p-7">


              <h3 className="text-xl font-bold text-navy">

                {t("products.sentinel.name")}

              </h3>


              <p className="mt-3 text-text-muted">

                {t("products.sentinel.description")}

              </p>


            </div>





            <div className="rounded-2xl bg-gray-bg p-7">


              <h3 className="text-xl font-bold text-navy">

                {t("products.dome.name")}

              </h3>


              <p className="mt-3 text-text-muted">

                {t("products.dome.description")}

              </p>


            </div>





            <div className="rounded-2xl bg-gray-bg p-7">


              <h3 className="text-xl font-bold text-navy">

                {t("products.guardian.name")}

              </h3>


              <p className="mt-3 text-text-muted">

                {t("products.guardian.description")}

              </p>


            </div>




          </div>



        </Container>


      </section>




    </main>


  );


}