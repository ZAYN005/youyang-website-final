import Container from "@/components/ui/Container";
import { useTranslations } from "next-intl";


export default function CoreTechnology() {


  const t = useTranslations("technology");


  const technologies = [

    {
      number: "01",
      title: t("capabilities.one.title"),
      description: t("capabilities.one.description"),
    },

    {
      number: "02",
      title: t("capabilities.two.title"),
      description: t("capabilities.two.description"),
    },

    {
      number: "03",
      title: t("capabilities.three.title"),
      description: t("capabilities.three.description"),
    },

    {
      number: "04",
      title: t("capabilities.four.title"),
      description: t("capabilities.four.description"),
    },

    {
      number: "05",
      title: t("capabilities.five.title"),
      description: t("capabilities.five.description"),
    },

  ];



  return (

    <section className="
      py-24
      bg-white
    ">


      <Container>


        <div>


          <p className="
            text-sm
            uppercase
            tracking-[0.3em]
            text-brand-blue
          ">
            {t("label")}
          </p>



          <h2 className="
            mt-5
            text-4xl
            font-bold
            text-navy
            lg:text-5xl
          ">
            {t("capabilityTitle")}
          </h2>



          <p className="
            mt-6
            max-w-3xl
            text-lg
            leading-relaxed
            text-text-muted
          ">
            {t("description")}
          </p>



        </div>





        <div className="
          mt-14
          grid
          gap-8
          md:grid-cols-2
        ">


          {technologies.map((item)=>(


            <div
              key={item.number}
              className="
                group
                rounded-[32px]
                border
                border-slate-200
                bg-[#f8fbff]
                p-10
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-xl
              "
            >



              <div className="
                text-5xl
                font-black
                text-slate-200
                group-hover:text-brand-blue/30
                transition
              ">
                {item.number}
              </div>




              <h3 className="
                mt-6
                text-2xl
                font-bold
                text-navy
              ">
                {item.title}
              </h3>



              <p className="
                mt-5
                text-lg
                leading-relaxed
                text-text-muted
              ">
                {item.description}
              </p>



            </div>


          ))}



        </div>



      </Container>


    </section>

  );

}