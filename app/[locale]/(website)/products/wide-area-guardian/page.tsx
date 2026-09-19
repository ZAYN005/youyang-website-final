import type { Metadata } from "next";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

import { useTranslations, useLocale } from "next-intl";



export const metadata: Metadata = {

  title:
    "Wide-area Guardian | Large-Scale AI Perception System | Youyang Intelligent Control",

  description:
    "Wide-area Guardian is a large-scale intelligent sensing solution from Youyang Intelligent Control, delivering panoramic imaging, AI-powered perception, and continuous monitoring for complex environments.",

};



const advantages = [
  {
    key: "one",
  },
  {
    key: "two",
  },
  {
    key: "three",
  },
  {
    key: "four",
  },
];



const applications = [
  {
    key: "city",
    image: "/solutions/street.png",
  },
  {
    key: "infrastructure",
    image: "/solutions/airport.png",
  },
  {
    key: "transportation",
    image: "/solutions/port.png",
  },
  {
    key: "safety",
    image: "/solutions/mine.jpg",
  },
];





export default function SentinelPage() {

  const t = useTranslations("products.guardian");

  const locale = useLocale();



  return (

    <main>




      {/* Hero */}


      <section className="bg-space-navy py-20 text-white">


        <Container>



          <div className="grid items-center gap-12 lg:grid-cols-2">



            {/* Text */}


            <div>


              <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">

                {t("hero.label")}

              </p>




              <h1 className="mt-5 text-5xl font-bold">

                Wide-area Guardian

              </h1>




              <p className="mt-3 text-lg text-slate-300">

                YYZK-PANO-52L-V1.0

              </p>





              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">


                {t("hero.description")}


              </p>





              <div className="mt-8">


                <Button href={`/${locale}/contact`}>


                  {t("hero.button")}


                </Button>


              </div>



            </div>







            {/* Product Image */}


            <div className="flex justify-center">



              <div className="flex h-[380px] w-[380px] items-center justify-center rounded-3xl bg-white/5 p-10 backdrop-blur">



                <img
                  src="/products/wide-area-guardian.jpg"
                  alt="Wide-area Guardian"
                  className="h-full w-full object-contain"
                />



              </div>



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








      {/* Advantages */}


      <section className="bg-gray-bg py-20">


        <Container>




          <h2 className="text-3xl font-bold text-navy">

            {t("advantages.title")}

          </h2>





          <div className="mt-10 grid gap-6 md:grid-cols-2">





            {advantages.map((item) => (



              <div
                key={item.key}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >




                <h3 className="text-xl font-bold text-navy">

                  {t(`advantages.items.${item.key}.title`)}

                </h3>





                <p className="mt-4 text-text-muted">

                  {t(`advantages.items.${item.key}.description`)}

                </p>



              </div>



            ))}




          </div>




        </Container>



      </section>

            {/* Technical Specifications */}


      <section className="py-20">


        <Container>



          <h2 className="text-3xl font-bold text-navy">

            {t("specifications.title")}

          </h2>





          <div className="mt-10 overflow-hidden rounded-2xl border bg-white">


            <div className="grid grid-cols-2 bg-navy p-5 text-white">


              <p>

                {t("specifications.parameter")}

              </p>



              <p>

                {t("specifications.value")}

              </p>



            </div>







            {[
  {
    parameter: "model",
    value: "YYZK-PANO-52L-V1.0",
  },

  {
    parameter: "imaging",
    value: t("specifications.values.imaging"),
  },

  {
    parameter: "ai",
    value: t("specifications.values.ai"),
  },

  {
    parameter: "application",
    value: t("specifications.values.application"),
  },

].map((item) => (



              <div
                key={item.parameter}
                className="grid grid-cols-2 border-t p-5 text-sm"
              >



                <p className="text-text-muted">

                  {t(`specifications.items.${item.parameter}`)}

                </p>




                <p className="font-medium text-navy">

                  {item.value}

                </p>




              </div>



            ))}




          </div>



        </Container>


      </section>









      {/* Comparison */}



      <section className="bg-gray-bg py-20">


        <Container>




          <h2 className="text-3xl font-bold text-navy">

            {t("comparison.title")}

          </h2>








          <div className="mt-10 overflow-hidden rounded-2xl border bg-white">



            <div className="grid grid-cols-2 bg-navy p-5 text-white">


              <p>

                {t("comparison.traditional")}

              </p>




              <p>

                {t("comparison.product")}

              </p>




            </div>







            {[
              {
                key: "one",
              },
              {
                key: "two",
              },
              {
                key: "three",
              },
              {
                key: "four",
              },

            ].map((item) => (



              <div
                key={item.key}
                className="grid grid-cols-2 border-t p-5 text-sm"
              >




                <p className="text-text-muted">

                  {t(`comparison.items.${item.key}.traditional`)}

                </p>





                <p className="font-medium text-navy">

                  {t(`comparison.items.${item.key}.guardian`)}

                </p>




              </div>



            ))}



          </div>





        </Container>



      </section>









      {/* Application Scenarios */}



      <section className="py-20">


        <Container>




          <h2 className="text-3xl font-bold text-navy">

            {t("applications.title")}

          </h2>







          <div className="mt-10 grid gap-8 md:grid-cols-2">






            {applications.map((item) => (




              <div
                key={item.key}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >





                <img

                  src={item.image}

                  alt={t(`applications.items.${item.key}`)}

                  className="h-56 w-full object-cover"

                />






                <div className="p-6">



                  <h3 className="text-xl font-bold text-navy">

                    {t(`applications.items.${item.key}`)}

                  </h3>





                  <p className="mt-3 text-text-muted">

                    {t("applications.description")}

                  </p>





                </div>





              </div>





            ))}





          </div>





        </Container>



      </section>


    </main>

  );

}