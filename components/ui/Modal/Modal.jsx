import React,{useRef} from "react";
import Image from 'next/future/image';
//import "./modal.css";
import { close} from "../../../pages/assets";
import { BigNumber, Contract, providers, utils } from "ethers";
import { akuverseABI,akuverseAddress } from "../../../pages/constants/index";
import Web3Modal from "web3modal";




const Modal = ({ setShowModal,props }) => {
  const web3ModalRef = useRef();
 const amountRemaining =  props.item[6].toNumber() - props.item[7].toNumber()

 const buy = async () => {
  try {

    const signer = await getProviderOrSigner(true);
    
    //final transfer transaction
    const akuverseContract = new Contract(
      akuverseAddress,
      akuverseABI,
      signer
    );

    const data = await akuverseContract.mintHouse(props.item[2],{value:props.item[3]});
    
    

  } catch (err) {
    console.error(err);
  }
  
}

const getProviderOrSigner = async (needSigner = false) => {
  

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
  
    
      // Boom! This should print out public address once we authorize Metamask.
  console.log("Connected", accounts[0]);

  
  // Connect to Metamask
  // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  web3ModalRef.current = new Web3Modal({
    network: "Mumbai",
    providerOptions: {},
    disableInjectedProvider: false,
  });
  const provider = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);

  // If user is not connected to the Goerli network, let them know and throw an error
  const { chainId } = await web3Provider.getNetwork();
  console.log(chainId)
  if (chainId !== 80001) {
    window.alert("Change the network to Mumbai");
    throw new Error("Change network to Mumbai");
  }

  if (needSigner) {
    const signer = web3Provider.getSigner();
    return signer;
  }
  return web3Provider;
};



  return (
    <div className="modal__wrapper">
      <div className="single__modal">
        <span className="close__modal">
          <Image src={close} alt="image" className="closer" onClick={() => setShowModal(false)} />
          <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
        <h6 className="text-center text-white">Buy a share</h6>
        <p className="text-center text-white">
          You must send at least <span className="money">{props.item[3].toNumber()} ETH</span>
        </p>

       

        <div className="input__item mt-8">
          <h6>Enter Quantity, {amountRemaining} available</h6>
          <input type="number" placeholder="Enter quantity" />
        </div>

        

        <div className=" d-flex mt-8 align-items-center justify-content-between">
          <p className="text-white">About the project</p>
          <span className="money">{props.item[5]}</span>
        </div>


        <button className="place__bid-btn" onClick={buy}>Buy</button>
      </div>
    </div>
  );
};

export default Modal;
