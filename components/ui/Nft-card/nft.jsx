import React, { useState } from "react";
import ava03 from "../../../assets/images/ava-03.png";


//import "./nft-card.css";
import Image from 'next/future/image';
import Modal from "../Modal/Modal";
import { providers } from "ethers";

const Nft = (props) => {
  const { id } = props.item;
  console.log("id:",props.item)
  const creatorImg = "https://images.lofty.ai/images/01GE0CM20MNH70QYRC06M90W7K/thumb-min.jpg"
  const creator = props.item[0];
  const [showModal, setShowModal] = useState(false);
  const amountRemaining =  props.item[6].toNumber() - props.item[7].toNumber()

  return (

    <div key={id} className="flex justify-between flex-col px-10 py-12 rounded-[20px]  max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 feedback-card feedback-card2 ">
        <div className="relative">
        <Image src="https://images.lofty.ai/images/01GE0CM20MNH70QYRC06M90W7K/thumb-min.jpg" width={349} height={100} alt="double_quotes" className="w-[369.6px] object-contain" />
        <div className="text-white absolute right-0 top-0">
            { amountRemaining == 0 ?
                <button className="place__bid-btn">sold out</button>
                :
                <button className="place__bid-btn">{props.item[7].toNumber()} of {props.item[6].toNumber()} sold</button>
            }
        
        </div>
        </div>
        
        <div className="flex flex-column">
            <p className="font-poppins font-normal text-[18px] leading-[32.4px] text-white my-10">
            {props.item[1]}
            </p>
            <p className="font-poppins font-normal text-[16px] justify-content-end  ml-16 text-white my-10">
            {props.item[3].toNumber()} ETH
            </p>
        </div>

             <div className="flex flex-row">
                <Image src={ava03} width={49} height={100} alt="" className="w-[48px] h-[48px] rounded-full" />
                
                <div className="flex flex-col ml-4">
                
                <p className="font-poppins font-normal text-[16px] leading-[48px] text-dimWhite">
                Created By{""} {creator.slice(0, 6)}...{creator.slice(-4)}
                </p>
                </div>   
            </div>

        

                <div className=" mt-3 d-flex align-items-center justify-content-between">
                <button
                    className="bid__btn d-flex align-items-center gap-1"
                    onClick={() => setShowModal(true)}
                >
                    <i className="ri-shopping-bag-line"></i>Buy Share
                </button>

                {showModal && <Modal key={props.key} props={props} setShowModal={setShowModal} />}

                <span className="history__link">
                
                </span>
                </div>
        </div>
  );
};

export default Nft;
