import type { Metadata } from "next";

import Link from "next/link";

import Container from "@/components/ui/Container";

import { getVisibleCatalog } from "@/lib/catalog/server";
import { pathFor } from "@/lib/catalog/builtins";
import { images, pick, plain } from "@/lib/catalog/schema";

import { getTranslations, getLocale } from "next-intl/server";

import { imageList } from "@/lib/cms/images";


export const metadata: Metadata = {

  title:
    "AI Intelligent Vision Products | 360 Sentinel, Dome Watch & Wide-area Guardian",

  description:
    "Explore Youyang Intelligent Control's intelligent vision products including panoramic sensing systems.",

};



export const dynamic = "force-dynamic";


export default async function ProductsPage() {


  const t = await getTranslations("products");

  const locale = await getLocale();

  const lang = locale === "zh" ? "zh" : "en";


  // built-in products + products added in 内容管理, in the chosen order
  const products = (await getVisibleCatalog("product")).map((entry) => {
    if (entry.builtin) {
      const key = entry.builtin.key;
      return {
        id: entry.slug,
        href: pathFor("product", entry.slug),
        image: imageList(t.raw(`${key}.images`), [entry.builtin.image])[0],
        name: t(`${key}.name`),
        model: t(`${key}.model`),
        description: t(`${key}.description`),
      };
    }
    const data = entry.data ?? {};
    return {
      id: entry.slug,
      href: pathFor("product", entry.slug),
      image: images(data.images)[0] ?? "",
      name: pick(data.name, lang),
      model: plain(data.model),
      description: pick(data.summary, lang),
    };
  });



  return (

    <section className="bg-gray-bg py-20">


      <Container>



        {/* Header */}


        <div className="max-w-3xl">



          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">

            {t("label")}

          </p>





          <h1 className="mt-4 text-4xl font-bold text-navy lg:text-5xl">

            {t("title")}

          </h1>





          <p className="mt-6 text-lg leading-relaxed text-text-muted">

            {t("description")}

          </p>



        </div>







        {/* Products */}


        <div className="mt-14 grid gap-10 lg:grid-cols-3">





          {products.map((product) => (

            <Link
              key={product.id}

              href={`/${locale}${product.href}`}

              className="group rounded-3xl bg-white p-8 transition hover:-translate-y-2 hover:shadow-xl"

            >


              {/* Image */}

              <div className="flex h-[260px] items-center justify-center rounded-2xl bg-gray-50 p-8">

                {product.image && (
                  <img

                    src={product.image}

                    alt={product.name}

                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"

                  />
                )}

              </div>


              {/* Product Name */}

              <h2 className="mt-8 text-2xl font-bold text-navy">

                {product.name}

              </h2>


              {/* Model */}

              {product.model && (
                <p className="mt-2 text-sm text-brand-blue">

                  {product.model}

                </p>
              )}


              {/* Description */}

              <p className="mt-5 whitespace-pre-line leading-relaxed text-text-muted">

                {product.description}

              </p>


              {/* Button */}

              <p className="mt-6 font-semibold text-brand-blue">

                {t("explore")} →

              </p>


            </Link>

          ))}





        </div>





      </Container>



    </section>

  );

}