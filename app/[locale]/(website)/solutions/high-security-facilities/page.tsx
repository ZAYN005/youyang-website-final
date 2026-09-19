import type { Metadata } from "next";

import Container from "@/components/ui/Container";

import Button from "@/components/ui/Button";

import { useTranslations, useLocale } from "next-intl";



export const metadata: Metadata = {

  title:
    "High-Security Facilities | AI Security Monitoring Solutions | Youyang Intelligent Control",

  description:
    "Youyang Intelligent Control provides AI-powered intelligent sensing solutions for high-security facilities, supporting perimeter protection, behavior analysis, critical asset monitoring, and advanced security management.",

};





const challenges = [

  "access",

  "environment",

  "blindspots",

  "response",

];





const capabilities = [

  "intrusion",

  "behavior",

  "monitoring",

  "asset",

  "awareness",

];





const applications = [

  "museums",

  "archives",

  "government",

  "protected",

];





export default function HighSecurityPage() {


  const t = useTranslations("highSecurity");

  const locale = useLocale();



  return (

    <main>



      {/* Hero */}


      <section className="bg-space-navy py-24 text-white">


        <Container>


          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">



            <div>



              <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">

                {t("hero.label")}

              </p>




              <h1 className="mt-5 text-5xl font-bold">

                {t("hero.title")}

              </h1>





              <p className="mt-6 text-lg text-slate-300">

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

                src="/solutions/high-security.jpg"

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





          <p className="mt-6 max-w-4xl text-lg text-text-muted">

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



            {challenges.map(item => (



              <div

                key={item}

                className="rounded-2xl bg-white p-6"

              >


                ✓ {t(`challenges.items.${item}`)}



              </div>



            ))}



          </div>



        </Container>


      </section>








      {/* Capabilities */}



      <section className="py-20">


        <Container>




          <h2 className="text-3xl font-bold text-navy">

            {t("capabilities.title")}

          </h2>






          <div className="mt-10 grid gap-6 md:grid-cols-2">



            {capabilities.map(item => (



              <div

                key={item}

                className="rounded-2xl border p-6 font-semibold text-navy"

              >


                ✓ {t(`capabilities.items.${item}`)}



              </div>



            ))}



          </div>




        </Container>


      </section>








      {/* Applications */}



      <section className="bg-gray-bg py-20">


        <Container>




          <h2 className="text-3xl font-bold text-navy">

            {t("applications.title")}

          </h2>






          <div className="mt-8 grid gap-5 md:grid-cols-2">



            {applications.map(item => (



              <div

                key={item}

                className="rounded-xl bg-white p-6 font-semibold"

              >


                {t(`applications.items.${item}`)}



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



            <div className="rounded-2xl bg-gray-bg p-7 font-bold text-navy">

              {t("products.sentinel")}

            </div>




            <div className="rounded-2xl bg-gray-bg p-7 font-bold text-navy">

              {t("products.dome")}

            </div>




            <div className="rounded-2xl bg-gray-bg p-7 font-bold text-navy">

              {t("products.guardian")}

            </div>




          </div>




        </Container>


      </section>



    </main>

  );

}