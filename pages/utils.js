import { BigNumber, Contract, providers, utils } from "ethers";
import { akuverseABI,akuverseAddress } from "../pages/constants/index";
import Web3Modal from "web3modal"
import React, { useState,useEffect,useRef } from "react";;



export const getProviderOrSigner = async (needSigner = false) => {
  const web3ModalRef = useRef();

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




