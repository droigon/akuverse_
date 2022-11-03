import styles from "../style";
import { discount, robot } from "../assets";
import GetStarted from "./GetStarted";
import Image from 'next/future/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Canvas} from '@react-three/fiber'
import { BakeShadows, OrbitControls, Stage } from '@react-three/drei'
import { useGLTF } from "@react-three/drei"


const Model = () => {
  const { nodes, animations } = useGLTF("/starterscene.glb")
  return (
    <>
      <primitive object={nodes.Scene} scale={0.4} />
    </>
  );
};



const Hero = () => {
  return (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-14 px-6`}>
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <Image src={discount} alt="discount" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">20%</span> Discount For{" "}
            <span className="text-white">1 Month</span> Account
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
        Future Of <br className="sm:block hidden" />
        {" "}
            <span className="text-gradient"> RealEstate </span>{" "}
          </h1>
          
          <div className="ss:flex hidden md:mr-4 mr-0">
          
            <GetStarted />
         
          </div>
          
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full">
         Investment
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Diversification and Risk Tolerance is key to any investment strategy, but the barrier to entry for real estate investing has always been so high. We don't believe that should be the case because we use the Ethereum blockchain.
        </p>
      </div>

      <div className={`flex-1 flex  md:my-0 my-10 relative`}>
        <Canvas >
        <ambientLight  intensity={0.3}  />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null} >
          <Stage environment="city" intensity={0.9} >
          <Model scale={-1} rotation={[0, 0.5, Math.PI]} position={[0, 0, 0]}/>
          </Stage>
          <BakeShadows />
        </Suspense>
        <OrbitControls autoRotate />
      </Canvas>

        {/* gradient start */}
       
        {/* gradient end */}
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <GetStarted />
      </div>
    </section>
  );
};

export default Hero;
