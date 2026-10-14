import type { Metadata } from "next";

import Container from "@/components/ui/Container";

import Button from "@/components/ui/Button";

import { useTranslations, useLocale } from "next-intl";

import ImageCarousel from "@/components/ui/ImageCarousel";
import { imageList } from "@/lib/cms/images";





export const metadata: Metadata = {

  title:
    "Commercial & Industrial Worksites Intelligent Sensing Solution | Youyang Intelligent Control",

  description:
    "AI-powered intelligent sensing solutions for industrial environments supporting safety monitoring, hazard detection, operational visibility, and large-area perception.",

};







const coverage = [

  "factories",

  "logistics",

  "construction",

  "industrialFacilities",

];







const capabilities = [

  "industrialMonitoring",

  "hazardDetection",

  "behaviorAnalysis",

  "wideAreaPerception",

];







const values = [

  "workplaceSafety",

  "riskPrevention",

  "operationalEfficiency",

  "intelligentManagement",

];








export default function IndustrialPage() {


  const t = useTranslations("industrial");

  const locale = useLocale();

  const heroImages = imageList(t.raw("hero.images"), ["/solutions/industrial-worksite.jpg"]);





  return (

    <main>





      {/* HERO */}



      <section className="
        relative
        overflow-hidden
        bg-space-navy
        py-24
        text-white
      ">



        <Container>





          <div className="
            grid
            items-center
            gap-12
            lg:grid-cols-2
          ">





            <div>




              <p className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-tech-cyan
              ">



                {t("hero.label")}



              </p>







              <h1 className="
                mt-5
                text-4xl
                font-bold
                leading-tight
                lg:text-5xl
              ">



                {t("hero.title")}



              </h1>







              <p className="
                mt-6
                max-w-xl
                text-lg
                leading-relaxed
                text-slate-300
              ">



                {t("hero.description")}



              </p>







              <div className="mt-8">



                <Button href={`/${locale}/contact`}>



                  {t("hero.button")}



                </Button>



              </div>






            </div>









            <div className="
              overflow-hidden
              rounded-[32px]
              border
              border-white/10
              bg-white/5
              p-3
            ">





              <ImageCarousel


                images={heroImages}


                alt={t("hero.title")}


                className="
                  h-[420px]
                  w-full
                  rounded-[24px]
                  object-cover
                "


              />





            </div>






          </div>






        </Container>




      </section>









      {/* OVERVIEW */}



      <section className="py-24">



        <Container>





          <div className="
            grid
            gap-12
            lg:grid-cols-3
          ">






            <div className="lg:col-span-2">





              <p className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-brand-blue
              ">



                {t("overview.label")}



              </p>







              <h2 className="
                mt-4
                text-4xl
                font-bold
                text-navy
              ">



                {t("overview.title")}



              </h2>








              <p className="
                mt-6
                text-lg
                leading-relaxed
                text-text-muted
              ">



                {t("overview.description")}



              </p>





            </div>









            <div className="
              rounded-[32px]
              bg-[#f4f8ff]
              p-8
            ">






              <h3 className="
                text-xl
                font-bold
                text-navy
              ">



                {t("overview.highlightTitle")}



              </h3>








              <p className="
                mt-4
                leading-relaxed
                text-text-muted
              ">



                {t("overview.highlight")}



              </p>





            </div>






          </div>






        </Container>




      </section>









      {/* COVERAGE */}



      <section className="
        bg-gray-bg
        py-24
      ">



        <Container>





          <p className="
            text-sm
            uppercase
            tracking-[0.3em]
            text-brand-blue
          ">



            {t("coverage.label")}



          </p>







          <h2 className="
            mt-4
            text-4xl
            font-bold
            text-navy
          ">



            {t("coverage.title")}



          </h2>







          <div className="
            mt-12
            grid
            gap-6
            md:grid-cols-2
            lg:grid-cols-4
          ">






            {coverage.map((item,index)=>(




              <div

                key={item}

                className="
                  rounded-[28px]
                  bg-white
                  p-8
                  shadow-sm
                  transition
                  hover:-translate-y-2
                  hover:shadow-xl
                "



              >






                <span className="
                  text-4xl
                  font-black
                  text-brand-blue/20
                ">



                  0{index + 1}



                </span>








                <h3 className="
                  mt-5
                  text-xl
                  font-bold
                  text-navy
                ">



                  {t(`coverage.items.${item}`)}



                </h3>






              </div>





            ))}




          </div>






        </Container>




      </section>
      
      {/* CORE CAPABILITIES */}


      <section className="py-24">


        <Container>





          <div>


            <p className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-brand-blue
            ">


              {t("capabilities.label")}


            </p>







            <h2 className="
              mt-4
              text-4xl
              font-bold
              text-navy
            ">


              {t("capabilities.title")}


            </h2>





          </div>









          <div className="
            mt-12
            grid
            gap-8
            lg:grid-cols-3
          ">





            {capabilities.map((item,index)=>(





              <div

                key={item}

                className="
                  group
                  rounded-[32px]
                  border
                  border-slate-200
                  bg-white
                  p-8
                  transition
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-xl
                "



              >





                <span className="
                  text-5xl
                  font-black
                  text-slate-100
                  transition
                  group-hover:text-brand-blue/20
                ">



                  0{index + 1}



                </span>








                <h3 className="
                  mt-6
                  text-2xl
                  font-bold
                  text-navy
                ">



                  {t(`capabilities.items.${item}.title`)}



                </h3>








                <p className="
                  mt-5
                  leading-relaxed
                  text-text-muted
                ">



                  {t(`capabilities.items.${item}.description`)}



                </p>






              </div>





            ))}





          </div>






        </Container>



      </section>









      {/* CORE VALUE */



      <section className="
        bg-space-navy
        py-24
        text-white
      ">




        <Container>





          <div className="max-w-3xl">



            <p className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-tech-cyan
            ">



              {t("values.label")}



            </p>







            <h2 className="
              mt-4
              text-4xl
              font-bold
            ">



              {t("values.title")}



            </h2>






          </div>









          <div className="
            mt-12
            grid
            gap-6
            md:grid-cols-2
          ">



            {values.map((item,index)=>(





              <div

                key={item}

                className="
                  rounded-[28px]
                  border
                  border-white/10
                  bg-white/5
                  p-8
                "





              >





                <span className="
                  text-4xl
                  font-black
                  text-tech-cyan/60
                ">



                  0{index + 1}



                </span>








                <h3 className="
                  mt-5
                  text-xl
                  font-bold
                ">



                  {t(`values.items.${item}.title`)}



                </h3>








                <p className="
                  mt-4
                  leading-relaxed
                  text-slate-300
                ">



                  {t(`values.items.${item}.description`)}



                </p>






              </div>





            ))}





          </div>






        </Container>




      </section>









      /* CTA */}



      <section className="py-24">



        <Container>






          <div className="
            rounded-[40px]
            bg-[#f4f8ff]
            px-8
            py-14
            text-center
            lg:px-20
          ">







            <h2 className="
              text-3xl
              font-bold
              text-navy
              lg:text-4xl
            ">



              {t("cta.title")}



            </h2>








            <p className="
              mx-auto
              mt-5
              max-w-2xl
              text-lg
              leading-relaxed
              text-text-muted
            ">



              {t("cta.description")}



            </p>








            <div className="mt-8">



              <Button href={`/${locale}/contact`}>



                {t("cta.button")}



              </Button>




            </div>







          </div>






        </Container>




      </section>







    </main>

  );


}