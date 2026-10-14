import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ImageCarousel from "@/components/ui/ImageCarousel";

import { CatalogData, Lang, images, pick, rows } from "@/lib/catalog/schema";


/**
 * Page of a solution added in 内容管理.
 * Same layout and styles as the built-in solution pages (Urban public spaces).
 * Parts without content are left out.
 */
export default function AddedSolutionPage({
  data,
  lang,
}: {
  data: CatalogData;
  lang: Lang;
}) {

  const text = (key: string) => pick(data[key], lang);

  const name = text("name");
  const pictures = images(data.images);

  const coverage = rows(data.coverage);
  const capabilities = rows(data.capabilities);
  const values = rows(data.values);

  const heroLabel = text("heroLabel");
  const heroTitle = text("heroTitle") || name;
  const heroDescription = text("heroDescription");
  const heroButton = text("heroButton");

  const overviewDescription = text("overviewDescription");
  const highlightTitle = text("highlightTitle");
  const highlight = text("highlight");

  const ctaTitle = text("ctaTitle");
  const ctaDescription = text("ctaDescription");
  const ctaButton = text("ctaButton");


  return (

    <main>

      {/* HERO */}

      <section className="relative overflow-hidden bg-space-navy py-24 text-white">

        <Container>

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              {heroLabel && (
                <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">
                  {heroLabel}
                </p>
              )}

              <h1 className="mt-5 whitespace-pre-line text-4xl font-bold leading-tight lg:text-5xl">
                {heroTitle}
              </h1>

              {heroDescription && (
                <p className="mt-6 max-w-xl whitespace-pre-line text-lg leading-relaxed text-slate-300">
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
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-3">
                <ImageCarousel
                  images={pictures}
                  alt={heroTitle}
                  className="h-[420px] w-full rounded-[24px] object-cover"
                />
              </div>
            )}

          </div>

        </Container>

      </section>


      {/* OVERVIEW */}

      {overviewDescription && (
        <section className="py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-3">

              <div className={highlightTitle || highlight ? "lg:col-span-2" : "lg:col-span-3"}>

                {text("overviewLabel") && (
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-blue">
                    {text("overviewLabel")}
                  </p>
                )}

                {text("overviewTitle") && (
                  <h2 className="mt-4 text-4xl font-bold text-navy">
                    {text("overviewTitle")}
                  </h2>
                )}

                <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-text-muted">
                  {overviewDescription}
                </p>

              </div>

              {(highlightTitle || highlight) && (
                <div className="rounded-[32px] bg-[#f4f8ff] p-8">
                  {highlightTitle && (
                    <h3 className="text-xl font-bold text-navy">
                      {highlightTitle}
                    </h3>
                  )}
                  {highlight && (
                    <p className="mt-4 whitespace-pre-line leading-relaxed text-text-muted">
                      {highlight}
                    </p>
                  )}
                </div>
              )}

            </div>
          </Container>
        </section>
      )}


      {/* COVERAGE */}

      {coverage.length > 0 && (
        <section className="bg-gray-bg py-24">
          <Container>

            <div>
              {text("coverageLabel") && (
                <p className="text-sm uppercase tracking-[0.3em] text-brand-blue">
                  {text("coverageLabel")}
                </p>
              )}
              {text("coverageTitle") && (
                <h2 className="mt-4 text-4xl font-bold text-navy">
                  {text("coverageTitle")}
                </h2>
              )}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {coverage.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[28px] bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <span className="text-4xl font-black text-brand-blue/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-navy">
                    {pick(item.title, lang)}
                  </h3>
                </div>
              ))}
            </div>

          </Container>
        </section>
      )}


      {/* CORE CAPABILITIES */}

      {capabilities.length > 0 && (
        <section className="py-24">
          <Container>

            <div>
              {text("capabilitiesLabel") && (
                <p className="text-sm uppercase tracking-[0.3em] text-brand-blue">
                  {text("capabilitiesLabel")}
                </p>
              )}
              {text("capabilitiesTitle") && (
                <h2 className="mt-4 text-4xl font-bold text-navy">
                  {text("capabilitiesTitle")}
                </h2>
              )}
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {capabilities.map((item, index) => (
                <div
                  key={index}
                  className="group rounded-[32px] border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <span className="text-5xl font-black text-slate-100 transition group-hover:text-brand-blue/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 text-2xl font-bold text-navy">
                    {pick(item.title, lang)}
                  </h3>
                  {pick(item.description, lang) && (
                    <p className="mt-5 whitespace-pre-line leading-relaxed text-text-muted">
                      {pick(item.description, lang)}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </Container>
        </section>
      )}


      {/* CORE VALUE */}

      {values.length > 0 && (
        <section className="bg-space-navy py-24 text-white">
          <Container>

            <div className="max-w-3xl">
              {text("valuesLabel") && (
                <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">
                  {text("valuesLabel")}
                </p>
              )}
              {text("valuesTitle") && (
                <h2 className="mt-4 text-4xl font-bold">
                  {text("valuesTitle")}
                </h2>
              )}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {values.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur"
                >
                  <span className="text-4xl font-black text-tech-cyan/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-xl font-bold">
                    {pick(item.title, lang)}
                  </h3>
                  {pick(item.description, lang) && (
                    <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-300">
                      {pick(item.description, lang)}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </Container>
        </section>
      )}


      {/* CTA */}

      {ctaTitle && (
        <section className="py-24">
          <Container>
            <div className="rounded-[40px] bg-[#f4f8ff] px-8 py-14 text-center lg:px-20">

              <h2 className="text-3xl font-bold text-navy lg:text-4xl">
                {ctaTitle}
              </h2>

              {ctaDescription && (
                <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-text-muted">
                  {ctaDescription}
                </p>
              )}

              {ctaButton && (
                <div className="mt-8">
                  <Button href={`/${lang}/contact`}>
                    {ctaButton}
                  </Button>
                </div>
              )}

            </div>
          </Container>
        </section>
      )}

    </main>

  );
}
