import type { Metadata } from "next";
import Container from "@/components/ui/Container";


export const metadata: Metadata = {

  title:
    "Terms of Use | Youyang Intelligent Control",

  description:
    "Terms and conditions for using Youyang Intelligent Control website and services.",

};


export default function TermsPage() {

  return (

    <main>



      <section className="py-20">

        <Container>

          <div className="max-w-4xl space-y-8 text-text-muted">


            <div>

              <h2 className="text-2xl font-bold text-navy">
                Website Usage
              </h2>

              <p className="mt-3">
                This website provides information about
                Youyang Intelligent Control products,
                technologies, and solutions.
              </p>

            </div>



            <div>

              <h2 className="text-2xl font-bold text-navy">
                Intellectual Property
              </h2>

              <p className="mt-3">
                Website content, branding, graphics, and
                technical materials belong to Youyang
                Intelligent Control unless otherwise stated.
              </p>

            </div>



            <div>

              <h2 className="text-2xl font-bold text-navy">
                Product Information
              </h2>

              <p className="mt-3">
                Product specifications and solutions may be
                updated according to technology development.
              </p>

            </div>



            <div>

              <h2 className="text-2xl font-bold text-navy">
                Contact
              </h2>

              <p className="mt-3">
                For questions regarding these terms,
                contact baol@yyteck.cn.
              </p>

            </div>


          </div>

        </Container>

      </section>


    </main>

  );

}