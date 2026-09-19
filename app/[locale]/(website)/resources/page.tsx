import type { Metadata } from "next";

import Container from "@/components/ui/Container";
import { useTranslations } from "next-intl";


export const metadata: Metadata = {

  title:
    "Resources | FAQ, Technical Documents & Knowledge Center | Youyang Intelligent Control",

  description:
    "Explore Youyang Intelligent Control resources including frequently asked questions, technical information, product documents, and knowledge about intelligent vision systems.",

};



export default function ResourcesPage() {


  const t = useTranslations("resources");



  const faqGroups = [

    {
      category: t("faq.ai.category"),

      questions: [

        {
          question: t("faq.ai.q1.question"),
          answer: t("faq.ai.q1.answer"),
        },

        {
          question: t("faq.ai.q2.question"),
          answer: t("faq.ai.q2.answer"),
        },

      ],
    },



    {
      category: t("faq.management.category"),

      questions: [

        {
          question: t("faq.management.q1.question"),
          answer: t("faq.management.q1.answer"),
        },

        {
          question: t("faq.management.q2.question"),
          answer: t("faq.management.q2.answer"),
        },

        {
          question: t("faq.management.q3.question"),
          answer: t("faq.management.q3.answer"),
        },

      ],
    },



    {
      category: t("faq.integration.category"),

      questions: [

        {
          question: t("faq.integration.q1.question"),
          answer: t("faq.integration.q1.answer"),
        },

        {
          question: t("faq.integration.q2.question"),
          answer: t("faq.integration.q2.answer"),
        },

      ],
    },



    {
      category: t("faq.storage.category"),

      questions: [

        {
          question: t("faq.storage.q1.question"),
          answer: t("faq.storage.q1.answer"),
        },

        {
          question: t("faq.storage.q2.question"),
          answer: t("faq.storage.q2.answer"),
        },

      ],
    },



    {
      category: t("faq.deployment.category"),

      questions: [

        {
          question: t("faq.deployment.q1.question"),
          answer: t("faq.deployment.q1.answer"),
        },

        {
          question: t("faq.deployment.q2.question"),
          answer: t("faq.deployment.q2.answer"),
        },

      ],
    },



    {
      category: t("faq.troubleshooting.category"),

      questions: [

        {
          question: t("faq.troubleshooting.q1.question"),
          answer: t("faq.troubleshooting.q1.answer"),
        },

        {
          question: t("faq.troubleshooting.q2.question"),
          answer: t("faq.troubleshooting.q2.answer"),
        },

      ],
    },


  ];




  return (

    <main>



      {/* Hero */}

    

<section className="bg-space-navy py-24 text-white">

  <Container>

    <div className="grid items-center gap-12 lg:grid-cols-2">


      {/* Left Text */}

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">
          {t("hero.label")}
        </p>


        <h1 className="mt-5 text-5xl font-bold">
          {t("hero.title")}
        </h1>


        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          {t("hero.description")}
        </p>

      </div>



      {/* Right Image */}

      <div className="hidden lg:block">

        <div className="overflow-hidden rounded-2xl shadow-xl">

          <img
            src="/resources-hero.jpg"
            alt="Youyang intelligent vision resources"
            className="h-[380px] w-full object-cover"
          />

        </div>

      </div>



    </div>

  </Container>

</section>



      {/* FAQ */}


      <section className="py-20">


        <Container>


          <h2 className="text-3xl font-bold text-navy">

            {t("faqTitle")}

          </h2>




          <div className="mt-12 space-y-12">



            {faqGroups.map((group) => (


              <div key={group.category}>


                <h3 className="mb-6 text-xl font-bold text-brand-blue">

                  {group.category}

                </h3>



                <div className="space-y-5">



                  {group.questions.map((faq) => (


                    <div

                      key={faq.question}

                      className="rounded-2xl border bg-white p-8"

                    >


                      <h4 className="text-lg font-bold text-navy">

                        {faq.question}

                      </h4>




                      <p className="mt-4 leading-relaxed text-text-muted">

                        {faq.answer}

                      </p>



                    </div>


                  ))}


                </div>



              </div>


            ))}



          </div>



        </Container>


      </section>
            {/* Resources Placeholder */}

      <section className="bg-gray-bg py-20">


        <Container>


          <div className="grid gap-8 lg:grid-cols-2">



            <div className="rounded-2xl bg-white p-8">


              <h3 className="text-2xl font-bold text-navy">

                {t("downloads.title")}

              </h3>



              <p className="mt-4 text-text-muted">

                {t("downloads.description")}

              </p>



              <p className="mt-5 font-semibold text-brand-blue">

                {t("comingSoon")}

              </p>



            </div>





            <div className="rounded-2xl bg-white p-8">


              <h3 className="text-2xl font-bold text-navy">

                {t("whitepapers.title")}

              </h3>



              <p className="mt-4 text-text-muted">

                {t("whitepapers.description")}

              </p>



              <p className="mt-5 font-semibold text-brand-blue">

                {t("comingSoon")}

              </p>



            </div>



          </div>



        </Container>


      </section>




    </main>

  );

}