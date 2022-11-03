import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import style from "./style";
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Testimonials, Hero } from "./components";
import Link from 'next/link';
//import Model from './components/gltf';

import { Suspense } from 'react';
import { Canvas} from '@react-three/fiber'
import { BakeShadows, OrbitControls, Stage } from '@react-three/drei'
import { useGLTF } from "@react-three/drei"

const Model = () => {
  const { nodes, animations } = useGLTF("/z.glb")
  return (
    <>
      <primitive object={nodes.Scene} scale={0.4} />
    </>
  );
};


export default function Home() {
  return (
    <div className="bg-primary w-full overflow-hidden">
    <div className={`${style.paddingX} ${style.flexCenter}`}>
      <div className={`${style.boxWidth}`}>
        <Navbar />
      </div>
    </div>

    

   
    

    <div className={`bg-primary ${style.flexStart}`}>
      <div className={`${style.boxWidth}`}>
        <Hero />
        
      </div>
    </div>
    
    
    <div className={`bg-primary ${style.paddingX} ${style.flexCenter}`}>
      <div className={`${style.boxWidth}`}>
        
      
        <Stats />
        <Business />
        <Billing />
        <CardDeal />
        <Testimonials />
        <Clients />
        <CTA />
        <Footer />
      </div>
    </div>
  </div>
  )
}
