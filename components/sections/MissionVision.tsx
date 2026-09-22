import Container from "@/components/ui/Container";
import { useTranslations } from "next-intl";


export default function MissionVision() {


  const t = useTranslations("company");



  const items = [

    {
      title: t("mission.title"),
      description: t("mission.description"),
    },

    {
      title: t("vision.title"),
      description: t("vision.description"),
    },

    {
      title: t("values.title"),
      description: t("values.description"),
    },

  ];



  return (

    <section className="
      bg-[#f7faff]
      py-24
    ">


      <Container>


        <div className="
          text-center
        ">


          <p className="
            text-sm
            uppercase
            tracking-[0.3em]
            text-brand-blue
          ">

            {t("cultureLabel")}

          </p>



          <h2 className="
            mt-5
            text-4xl
            font-bold
            text-navy
          ">

            {t("cultureTitle")}

          </h2>


        </div>




        <div className="
          mt-14
          grid
          gap-8
          md:grid-cols-3
        ">


          {items.map((item,index)=>(


            <div
              key={index}
              className="
                rounded-[32px]
                border
                border-slate-200
                bg-white
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >


              <span className="
                text-sm
                font-bold
                text-brand-blue
              ">

                0{index + 1}

              </span>




              <h3 className="
                mt-6
                text-2xl
                font-bold
                text-navy
              ">

                {item.title}

              </h3>




              <p className="
                mt-4
                leading-relaxed
                text-text-muted
              ">

                {item.description}

              </p>



            </div>


          ))}



        </div>


</Container>


<div className="
  mx-auto
  mt-12
  h-px
  w-4/5
  bg-slate-200
"/>

</section>
  );

}