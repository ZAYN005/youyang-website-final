import type { Metadata } from "next";

import Link from "next/link";

import Container from "@/components/ui/Container";

import { getTranslations, getLocale } from "next-intl/server";

import { singleImage } from "@/lib/cms/images";

import { getVisibleCatalog } from "@/lib/catalog/server";
import { pathFor } from "@/lib/catalog/builtins";
import { images, pick } from "@/lib/catalog/schema";


export const metadata: Metadata = {

  title:
    "AI Intelligent Vision Solutions | Public Safety, Transportation & Smart City Applications | Youyang Intelligent Control",

  description:
    "Explore Youyang Intelligent Control's intelligent vision solutions for urban public spaces, transportation hubs, critical infrastructure, healthcare, high-security facilities, and industrial environments.",

};








export const dynamic = "force-dynamic";


export default async function SolutionsPage() {


  const t = await getTranslations("solutions");

  const locale = await getLocale();

  const lang = locale === "zh" ? "zh" : "en";


  // built-in solutions + solutions added in 内容管理, in the chosen order
  const solutions = (await getVisibleCatalog("solution")).map((entry) => {
    if (entry.builtin) {
      const key = entry.builtin.key;
      return {
        id: entry.slug,
        href: pathFor("solution", entry.slug),
        image: singleImage(t.raw(`items.${key}.image`), entry.builtin.image),
        title: t(`items.${key}.title`),
        description: t(`items.${key}.description`),
      };
    }
    const data = entry.data ?? {};
    return {
      id: entry.slug,
      href: pathFor("solution", entry.slug),
      image: images(data.images)[0] ?? "",
      title: pick(data.name, lang),
      description: pick(data.summary, lang),
    };
  });



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





      {/* Solution Cards */}


      <section className="py-20">


        <Container>



          <div className="grid gap-10 lg:grid-cols-2">



            {solutions.map((solution,index)=>(



              <Link

                key={solution.id}

                href={`/${locale}${solution.href}`}

                className="
                group
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-sm
                transition
                hover:-translate-y-2
                hover:shadow-xl
                "


              >



                <div className="h-72 overflow-hidden">


                  {solution.image && <img

                    src={solution.image}

                    alt={solution.title}

                    className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                    "

                  />}


                </div>





                <div className="p-8">



                  <p className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-wider
                  text-brand-blue
                  ">

                    {String(index + 1).padStart(2, "0")} / {t("solutionLabel")}

                  </p>





                  <h2 className="
                  mt-4
                  text-3xl
                  font-bold
                  text-navy
                  ">


                    {solution.title}


                  </h2>





                  <p className="
                  mt-4
                  whitespace-pre-line
                  leading-relaxed
                  text-text-muted
                  ">


                    {solution.description}


                  </p>





                  <p className="
                  mt-7
                  font-semibold
                  text-brand-blue
                  ">


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


            <p className="
            text-sm
            uppercase
            tracking-[0.3em]
            text-brand-blue
            ">

              {t("architecture.label")}

            </p>





            <h2 className="
            mt-4
            text-4xl
            font-bold
            text-navy
            ">


              {t("architecture.title")}


            </h2>



          </div>





          <div className="
          mt-12
          rounded-3xl
          bg-white
          p-6
          shadow-sm
          ">


            <img

              src={singleImage(t.raw("architecture.image"), "/solutions/architecture.png")}

              alt={t("architecture.title")}

              className="w-full object-contain"

            />



          </div>




        </Container>


      </section>




    </main>

  );

}