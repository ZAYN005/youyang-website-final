"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Container from "@/components/ui/Container";
import { siteConfig } from "@/config/site";


const benefits = [
  {
    key: "engineering",
  },
  {
    key: "customized",
  },
  {
    key: "support",
  },
];


const solutions = [
  "urban",
  "transportation",
  "campuses",
  "healthcare",
  "security",
  "industrial",
];


const products = [
  "sentinel",
  "dome",
  "guardian",
];


export default function ContactPage() {


  const t = useTranslations("contact");


  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({

    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    solutionInterest: "",
    productInterest: "",
    message: "",

  });



  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    setLoading(true);


    try {


      const response = await fetch("/api/contact", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),

      });



      if (response.ok) {


        alert(
          t("messages.success")
        );


        setFormData({

          name: "",
          company: "",
          email: "",
          phone: "",
          country: "",
          solutionInterest: "",
          productInterest: "",
          message: "",

        });


      } else {


        alert(
          t("messages.failed")
        );


      }


    } catch(error) {


      console.error(error);


      alert(
        t("messages.error")
      );


    }



    setLoading(false);


  };



  return (

    <main>


      {/* Hero */}

      <section className="bg-space-navy py-24 text-white">


        <Container>


          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">


            <div>


              <div className="flex items-center gap-3">


                <img
                  src="/logo.png"
                  alt="Youyang Intelligent Control"
                  className="h-14 w-auto object-contain"
                />


                <div className="leading-tight">

                  <p className="text-2xl font-bold">
                    YOUYANG
                  </p>


                  <p className="text-sm text-slate-300">
                    Intelligent Control
                  </p>


                </div>


              </div>



              <p className="mt-10 text-sm uppercase tracking-[0.3em] text-tech-cyan">

                {t("hero.label")}

              </p>



              <h1 className="mt-5 text-5xl font-bold leading-tight">

                {t("hero.title")}

              </h1>



              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">

                {t("hero.description")}

              </p>



              <div className="mt-8 flex gap-4">


                <a
                  href="#contact-form"
                  className="rounded-md bg-gold px-7 py-3 font-semibold text-navy"
                >

                  {t("hero.button")}

                </a>


              </div>


            </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">


              <h2 className="text-2xl font-bold">

                {t("benefits.title")}

              </h2>


              <div className="mt-8 space-y-6">


                {benefits.map((item) => (

                  <div key={item.key}>


                    <h3 className="font-bold text-white">

                      {t(`benefits.items.${item.key}.title`)}

                    </h3>


                    <p className="mt-2 text-slate-300">

                      {t(`benefits.items.${item.key}.description`)}

                    </p>


                  </div>

                ))}


              </div>


            </div>


          </div>


        </Container>


      </section>





      {/* Contact Information */}

      <section className="py-20">


        <Container>


          <div className="grid gap-10 lg:grid-cols-3">


            <div>

              <h3 className="font-bold text-navy">

                {t("information.email")}

              </h3>


              <p className="mt-2 text-text-muted">

                {siteConfig.contact.email}

              </p>


            </div>



            <div>

              <h3 className="font-bold text-navy">

                {t("information.phone")}

              </h3>


              <p className="mt-2 text-text-muted">

                {siteConfig.contact.phone}

              </p>


            </div>



            <div>

              <h3 className="font-bold text-navy">

                {t("information.address")}

              </h3>


              <p className="mt-2 text-text-muted">

                {siteConfig.contact.address}

              </p>


            </div>


          </div>


        </Container>


      </section>





      {/* Form */}

      <section
        id="contact-form"
        className="bg-gray-bg py-20"
      >


        <Container>


          <div className="grid gap-12 lg:grid-cols-2">



            <div>


              <h2 className="text-3xl font-bold text-navy">

                {t("form.title")}

              </h2>



              <p className="mt-4 text-text-muted">

                {t("form.description")}

              </p>




              <div className="mt-8 rounded-2xl bg-white p-6">


                <h3 className="font-bold text-navy">

                  {t("form.supportTitle")}

                </h3>


                <ul className="mt-5 space-y-3 text-text-muted">


                  <li>
                    ✓ {t("form.support.one")}
                  </li>


                  <li>
                    ✓ {t("form.support.two")}
                  </li>


                  <li>
                    ✓ {t("form.support.three")}
                  </li>


                  <li>
                    ✓ {t("form.support.four")}
                  </li>


                </ul>


              </div>


            </div>





            <div className="rounded-3xl bg-white p-8 shadow-xl">


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >


                <input

                  placeholder={t("form.fields.name")}

                  value={formData.name}

                  onChange={(e)=>setFormData({

                    ...formData,

                    name:e.target.value

                  })}

                  className="w-full rounded-lg border px-4 py-3"

                />



                <input

                  placeholder={t("form.fields.company")}

                  value={formData.company}

                  onChange={(e)=>setFormData({

                    ...formData,

                    company:e.target.value

                  })}

                  className="w-full rounded-lg border px-4 py-3"

                />



                <input

                  placeholder={t("form.fields.email")}

                  value={formData.email}

                  onChange={(e)=>setFormData({

                    ...formData,

                    email:e.target.value

                  })}

                  className="w-full rounded-lg border px-4 py-3"

                />



                <input

                  placeholder={t("form.fields.phone")}

                  value={formData.phone}

                  onChange={(e)=>setFormData({

                    ...formData,

                    phone:e.target.value

                  })}

                  className="w-full rounded-lg border px-4 py-3"

                />



                <input

                  placeholder={t("form.fields.country")}

                  value={formData.country}

                  onChange={(e)=>setFormData({

                    ...formData,

                    country:e.target.value

                  })}

                  className="w-full rounded-lg border px-4 py-3"

                />
                                <select

                  value={formData.solutionInterest}

                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      solutionInterest:e.target.value
                    })
                  }

                  className="w-full rounded-lg border px-4 py-3"

                >


                  <option value="">

                    {t("form.fields.solution")}

                  </option>


                  {solutions.map((item)=>(

                    <option
                      key={item}
                      value={item}
                    >

                      {t(`solutions.${item}`)}

                    </option>

                  ))}


                </select>





                <select

                  value={formData.productInterest}

                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      productInterest:e.target.value
                    })
                  }

                  className="w-full rounded-lg border px-4 py-3"

                >


                  <option value="">

                    {t("form.fields.product")}

                  </option>


                  {products.map((item)=>(

                    <option
                      key={item}
                      value={item}
                    >

                      {t(`products.${item}`)}

                    </option>

                  ))}


                </select>





                <textarea

                  rows={5}

                  placeholder={t("form.fields.message")}

                  value={formData.message}

                  onChange={(e)=>
                    setFormData({

                      ...formData,

                      message:e.target.value

                    })
                  }

                  className="w-full rounded-lg border px-4 py-3"

                />





                <button

                  type="submit"

                  disabled={loading}

                  className="w-full rounded-lg bg-gold py-3 font-semibold text-navy"

                >

                  {loading
                    ? t("form.sending")
                    : t("form.submit")
                  }


                </button>


              </form>


            </div>


          </div>


        </Container>


      </section>


    </main>

  );

}