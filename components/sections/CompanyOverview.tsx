import Container from "@/components/ui/Container";
import { useTranslations } from "next-intl";


export default function CompanyOverview() {


  const t = useTranslations("company");



  return (

    <section className="
      py-24
      bg-white
    ">


      <Container>


        <div className="
          grid
          gap-12
          lg:grid-cols-2
          items-center
        ">


          {/* Company Information */}


          <div>


            <p className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-brand-blue
            ">

              {t("overview.title")}

            </p>



            <h2 className="
              mt-5
              text-4xl
              font-bold
              text-navy
              leading-tight
            ">

              {t("overview.heading")}

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





          {/* Established Card */}


          <div className="
            rounded-[32px]
            border
            border-slate-200
            bg-[#f4f8ff]
            p-10
          ">



            <p className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-brand-blue
            ">

              {t("established")}

            </p>




            <h3 className="
              mt-5
              text-7xl
              font-black
              text-navy
            ">

              {t("year")}

            </h3>



            <p className="
              mt-5
              text-lg
              leading-relaxed
              text-text-muted
            ">

              {t("establishedDescription")}

            </p>



          </div>



        </div>



      </Container>


    </section>

  );

}