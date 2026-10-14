import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ImageCarousel from "@/components/ui/ImageCarousel";

import { CatalogData, Lang, images, pick, plain, rows } from "@/lib/catalog/schema";


/**
 * Page of a product added in 内容管理.
 * Same layout and styles as the built-in product pages (360 Sentinel).
 * Parts without content are left out.
 */
export default function AddedProductPage({
  data,
  lang,
}: {
  data: CatalogData;
  lang: Lang;
}) {

  const text = (key: string) => pick(data[key], lang);

  const name = text("name");
  const model = plain(data.model);
  const pictures = images(data.images);

  const advantages = rows(data.advantages);
  const specs = rows(data.specs);
  const comparison = rows(data.comparison);

  const heroLabel = text("heroLabel");
  const heroDescription = text("heroDescription");
  const heroButton = text("heroButton");

  const overviewTitle = text("overviewTitle");
  const overviewDescription = text("overviewDescription");


  return (

    <main>

      {/* Hero */}

      <section className="bg-space-navy py-20 text-white">

        <Container>

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              {heroLabel && (
                <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">
                  {heroLabel}
                </p>
              )}

              <h1 className="mt-5 text-5xl font-bold">
                {name}
              </h1>

              {model && (
                <p className="mt-3 text-lg text-slate-300">
                  {model}
                </p>
              )}

              {heroDescription && (
                <p className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-slate-300">
                  {heroDescription}
                </p>
              )}

              {heroButton && (
                <div className="mt-8">
                  <Button href={`/${lang}/contact`}>
                    {heroButton}
                  </Button>
                </div>
              )}

            </div>


            {pictures.length > 0 && (
              <div className="flex justify-center">
                <div className="flex h-[380px] w-[380px] items-center justify-center rounded-3xl bg-white/5 p-10 backdrop-blur">
                  <ImageCarousel
                    images={pictures}
                    alt={name}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

          </div>

        </Container>

      </section>


      {/* Overview */}

      {overviewDescription && (
        <section className="py-20">
          <Container>
            {overviewTitle && (
              <h2 className="text-3xl font-bold text-navy">
                {overviewTitle}
              </h2>
            )}
            <p className="mt-6 max-w-4xl whitespace-pre-line text-lg leading-relaxed text-text-muted">
              {overviewDescription}
            </p>
          </Container>
        </section>
      )}


      {/* Advantages */}

      {advantages.length > 0 && (
        <section className="bg-gray-bg py-20">
          <Container>

            {text("advantagesTitle") && (
              <h2 className="text-3xl font-bold text-navy">
                {text("advantagesTitle")}
              </h2>
            )}

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {advantages.map((item, index) => (
                <div key={index} className="rounded-2xl bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-navy">
                    {pick(item.title, lang)}
                  </h3>
                  {pick(item.description, lang) && (
                    <p className="mt-4 whitespace-pre-line text-text-muted">
                      {pick(item.description, lang)}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </Container>
        </section>
      )}


      {/* Technical Specifications */}

      {specs.length > 0 && (
        <section className="py-20">
          <Container>

            {text("specsTitle") && (
              <h2 className="text-3xl font-bold text-navy">
                {text("specsTitle")}
              </h2>
            )}

            <div className="mt-10 overflow-hidden rounded-2xl border bg-white">

              <div className="grid grid-cols-2 bg-navy p-5 text-white">
                <p>{text("specsParameter")}</p>
                <p>{text("specsValue")}</p>
              </div>

              {specs.map((item, index) => (
                <div key={index} className="grid grid-cols-2 border-t p-5 text-sm">
                  <p className="text-text-muted">
                    {pick(item.label, lang)}
                  </p>
                  <p className="whitespace-pre-line font-medium text-navy">
                    {pick(item.value, lang)}
                  </p>
                </div>
              ))}

            </div>

          </Container>
        </section>
      )}


      {/* Comparison */}

      {comparison.length > 0 && (
        <section className="bg-gray-bg py-20">
          <Container>

            {text("comparisonTitle") && (
              <h2 className="text-3xl font-bold text-navy">
                {text("comparisonTitle")}
              </h2>
            )}

            <div className="mt-10 overflow-hidden rounded-2xl border bg-white">

              <div className="grid grid-cols-2 bg-navy p-5 text-white">
                <p>{text("comparisonTraditional")}</p>
                <p>{text("comparisonProduct") || name}</p>
              </div>

              {comparison.map((item, index) => (
                <div key={index} className="grid grid-cols-2 border-t p-5 text-sm">
                  <p className="text-text-muted">
                    {pick(item.traditional, lang)}
                  </p>
                  <p className="font-medium text-navy">
                    {pick(item.product, lang)}
                  </p>
                </div>
              ))}

            </div>

          </Container>
        </section>
      )}

    </main>

  );
}
