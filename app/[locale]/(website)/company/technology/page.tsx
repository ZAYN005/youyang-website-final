import type { Metadata } from "next";

import Container from "@/components/ui/Container";

import Button from "@/components/ui/Button";



export const metadata: Metadata = {

  title:
    "Core Technology | AI Perception & Panoramic Imaging Systems",

  description:
    "Explore Youyang Intelligent Control's core technologies including compound-eye imaging, AI recognition algorithms, 3D image stitching, and intelligent perception systems.",

};


const technologies = [
  {
    number: "01",
    title: "Compound-Eye Imaging",
    description:
      "Multi-camera optical architecture inspired by compound-eye vision enables wide-area panoramic perception with reduced blind spots.",
  },

  {
    number: "02",
    title: "AI Recognition Algorithms",
    description:
      "Advanced AI algorithms provide real-time detection, classification, recognition, and intelligent situation awareness.",
  },

  {
    number: "03",
    title: "3D Image Stitching",
    description:
      "High-precision image fusion technology creates seamless panoramic visual information from multiple camera viewpoints.",
  },

  {
    number: "04",
    title: "Digital Twin Modeling",
    description:
      "Digital representation technology supports intelligent monitoring, environment analysis, and operational decision making.",
  },
];


export default function TechnologyPage(){


return (

<main>


<section className="bg-space-navy py-24 text-white">

<Container>

<p className="text-sm uppercase tracking-[0.3em] text-tech-cyan">
Core Technology
</p>


<h1 className="mt-5 text-5xl font-bold">
Engineering Intelligent
Perception Systems
</h1>


<p className="mt-6 max-w-3xl text-lg text-slate-300">

Combining optical innovation,
AI computing, and intelligent sensing
technologies to deliver next-generation
wide-area awareness.

</p>


</Container>

</section>





<section className="py-20">

<Container>


<h2 className="text-3xl font-bold text-navy">
Core Technology Capabilities
</h2>


<div className="mt-12 grid gap-8 md:grid-cols-2">


{technologies.map(item=>(

<div
key={item.number}
className="rounded-3xl border bg-white p-8 shadow-sm"
>

<p className="font-bold text-brand-blue">
{item.number}
</p>


<h3 className="mt-4 text-2xl font-bold text-navy">
{item.title}
</h3>


<p className="mt-4 text-text-muted leading-relaxed">
{item.description}
</p>


</div>

))}


</div>


</Container>

</section>





<section className="bg-gray-bg py-20">

<Container>


<div className="text-center">

<h2 className="text-4xl font-bold text-navy">
From Perception To Intelligence
</h2>


<p className="mx-auto mt-5 max-w-3xl text-text-muted">

Integrated sensing hardware,
edge AI computing, and intelligent
analysis platforms.

</p>


</div>



<div className="mt-12 rounded-3xl bg-white p-6">

<img
src="/solutions/architecture.png"
alt="Architecture"
className="w-full object-contain"
/>

</div>


</Container>

</section>



</main>


);


}