import Container from "@/components/ui/Container";
import { useTranslations } from "next-intl";


export default function Technology() {


  const t = useTranslations("technology");


  const technologies = [

    {
      number:"01",
      title:t("items.one.title"),
      description:t("items.one.description")
    },

    {
      number:"02",
      title:t("items.two.title"),
      description:t("items.two.description")
    },

    {
      number:"03",
      title:t("items.three.title"),
      description:t("items.three.description")
    },

    {
      number:"04",
      title:t("items.four.title"),
      description:t("items.four.description")
    },

  ];



  return (


    <main>



      {/* Core Technology */}


      <section className="bg-space-navy py-24 text-white">


        <Container>


          <p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">

            {t("label")}

          </p>



          <h1 className="mt-5 max-w-4xl text-4xl font-bold lg:text-5xl">

            {t("title")}

          </h1>



          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">

            {t("description")}

          </p>


        </Container>


      </section>







     {/* Capability Cards */}


<section className="py-24">


<Container>


<div className="
flex
items-end
justify-between
">

<div>

<p className="
text-sm
uppercase
tracking-[0.3em]
text-brand-blue
">

INTELLIGENT PLATFORM

</p>


<h2 className="
mt-4
text-4xl
font-bold
text-navy
">

{t("capabilities")}

</h2>


</div>


<p className="
hidden
max-w-md
text-right
text-text-muted
md:block
">

Advanced sensing technologies combining
optics, AI computing, and intelligent perception.

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
relative
overflow-hidden
rounded-[32px]
border
border-slate-200
bg-white
p-10
transition-all
duration-500
hover:-translate-y-3
hover:shadow-2xl
"

>


{/* Number + line */}

<div className="
flex
items-center
gap-5
">


<span className="
text-6xl
font-black
text-slate-100
transition
duration-500
group-hover:text-brand-blue/20
">

{item.number}

</span>


<div className="
h-px
flex-1
bg-slate-200
group-hover:bg-brand-blue
transition
">

</div>


</div>





<h3 className="
mt-8
text-3xl
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





<div className="
mt-10
flex
items-center
gap-3
">


<span className="
h-2
w-2
rounded-full
bg-tech-cyan
">

</span>


<span className="
text-xs
uppercase
tracking-[0.25em]
text-slate-400
">

AI PERCEPTION MODULE

</span>


</div>





{/* bottom light effect */}

<div className="
absolute
bottom-0
left-0
h-1
w-0
bg-tech-cyan
transition-all
duration-700
group-hover:w-full
">

</div>



</div>


))}


</div>



</Container>


</section>






      {/* Architecture */}


      <section className="bg-gray-bg py-20">


        <Container>


          <div className="text-center">


            <p className="text-sm uppercase tracking-[0.3em] text-brand-blue">

              {t("architecture.label")}

            </p>



            <h2 className="mt-4 text-4xl font-bold text-navy">


              {t("architecture.title")}


            </h2>




            <p className="mx-auto mt-5 max-w-3xl text-text-muted">

              {t("architecture.description")}

            </p>


          </div>





          <div className="mt-12 overflow-hidden rounded-3xl bg-white p-6 shadow-sm">


            <img
              src="/solutions/architecture.png"
              alt="Intelligent Perception Architecture"
              className="w-full object-contain"
            />


          </div>



        </Container>


      </section>



    </main>


  );

}