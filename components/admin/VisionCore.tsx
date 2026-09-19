"use client";

import { Canvas, useFrame } from "@react-three/fiber";

import {
  OrbitControls,
  Float,
  Sphere,
  Torus,
  Stars,
} from "@react-three/drei";

import { useRef } from "react";

import * as THREE from "three";

import { useTranslations } from "next-intl";





function CoreObject() {


  const core = useRef<THREE.Group>(null);


  useFrame((state)=>{


    const t = state.clock.elapsedTime;


    if(core.current){


      core.current.rotation.y = t * 0.35;


      core.current.rotation.x =
        Math.sin(t * 0.8) * 0.15;


    }


  });





  return (


    <group ref={core}>


      <Sphere args={[1,128,128]}>

        <meshStandardMaterial

          color="#00eaff"

          emissive="#0066ff"

          emissiveIntensity={6}

          wireframe

        />

      </Sphere>






      <Torus
        args={[
          1.35,
          0.025,
          64,
          200
        ]}
      >

        <meshStandardMaterial

          color="#00ffff"

          emissive="#00ffff"

          emissiveIntensity={8}

        />

      </Torus>







      <Torus

        args={[
          1.7,
          0.015,
          64,
          200
        ]}

        rotation={[
          Math.PI / 2,
          0,
          0
        ]}

      >

        <meshStandardMaterial

          color="#f5c542"

          emissive="#f5c542"

          emissiveIntensity={5}

        />

      </Torus>







      <Torus

        args={[
          2,
          0.01,
          64,
          200
        ]}

        rotation={[
          0,
          Math.PI / 2,
          0
        ]}

      >

        <meshStandardMaterial

          color="#0088ff"

          emissive="#0088ff"

          emissiveIntensity={5}

        />

      </Torus>



    </group>


  );


}







function ScannerPulse(){


const ring = useRef<THREE.Mesh>(null);




useFrame(({clock})=>{


if(ring.current){


const scale =
1 + Math.sin(clock.elapsedTime*2)*0.15;


ring.current.scale.set(
scale,
scale,
scale
);


}


});





return (


<Torus

ref={ring}

args={[
2.5,
0.01,
32,
128
]}

>


<meshStandardMaterial

color="#00ffff"

emissive="#00ffff"

emissiveIntensity={4}

/>


</Torus>


);


}









export default function VisionCore(){


const t = useTranslations("visionCore");



return (



<div
className="
h-[500px]
rounded-3xl
border
border-cyan-400/20
bg-black/60
overflow-hidden
relative
"
>



<div
className="
absolute
top-6
left-8
z-10
"
>



<p
className="
text-cyan-400
tracking-[0.3em]
text-sm
"
>


{t("title")}


</p>




<p
className="
text-slate-400
text-xs
mt-2
"
>


{t("subtitle")}


</p>




</div>







<Canvas

camera={{
position:[0,0,6]
}}

>



<ambientLight

intensity={1}

/>




<pointLight

position={[
4,
4,
4
]}

color="#00eaff"

intensity={10}

/>




<pointLight

position={[
-4,
-2,
3
]}

color="#f5c542"

intensity={5}

/>






<Stars

radius={20}

depth={10}

count={500}

factor={3}

fade

/>






<Float

speed={2}

floatIntensity={0.6}

>


<CoreObject/>


<ScannerPulse/>


</Float>





<OrbitControls

enableZoom={false}

autoRotate

autoRotateSpeed={0.5}

/>





</Canvas>




</div>



);


}