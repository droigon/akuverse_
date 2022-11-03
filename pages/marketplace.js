import React, { useState,useEffect,useRef } from "react";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import Nft from "../components/ui/Nft-card/nft";
import { NFT__DATA,HOUSE__DATA } from "../assets/data/data";
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Testimonials, Hero } from "./components";
import styles from "../pages/style";
import Image from 'next/future/image';

  import { BigNumber, Contract, providers, utils } from "ethers";
  import { akuverseABI,akuverseAddress } from "../pages/constants/index";
import Web3Modal from "web3modal";




const Market = () => {
  const [data, setData] = useState(NFT__DATA);
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(false);

  const handleCategory = () => {};



  

  const handleItems = () => {};

  // ====== SORTING DATA BY HIGH, MID, LOW RATE =========
  const handleSort = (e) => {
    const filterValue = e.target.value;

    if (filterValue === "high") {
      const filterData = NFT__DATA.filter((item) => item.currentBid >= 6);

      setData(filterData);
    }

    if (filterValue === "mid") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 5.5 && item.currentBid < 6
      );

      setData(filterData);
    }

    if (filterValue === "low") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 4.89 && item.currentBid < 5.5
      );

      setData(filterData);
    }
  };


  const check = async () => {
    try {
      console.log("aaaa")
      const signer = await getProviderOrSigner();
      
      //final transfer transaction
      const akuverseContract = new Contract(
        akuverseAddress,
        akuverseABI,
        signer
      );

      const data = await akuverseContract.getHouses();
      console.log("Contract:",data)
      setData(data);
      
      
      
      
  
    } catch (err) {
      console.error(err);
    }
    
  }
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      console.log(ethereum)
  
      // Fancy method to request access to account.
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
  
    
      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const getProvider = async () => {
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
  
    return web3Provider;
  };
  
  
  const getProviderOrSigner = async (needSigner = false) => {
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


  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "Mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      check()
      
    }
  }, [walletConnected]);

  return (
    <>
    <div className="bg-primary w-full overflow-hidden">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>
     

      <section className={`${styles.marginY} ${styles.padding} `}>
        
            <div className="flex-row ">
                <div className="filter__left flex justify-start gap-10">
                    <div className="all__category__filter">
                        <select onChange={handleCategory}>
                        <option>All Categories</option>
                        <option value="art">Art</option>
                        <option value="music">Music</option>
                        <option value="domain-name">Domain Name</option>
                        <option value="virtual-world">Virtual World</option>
                        <option value="trending-card">Trending Cards</option>
                        </select>
                    </div>

                    <div className="all__items__filter">
                        <select onChange={handleItems}>
                        <option>All Items</option>
                        <option value="single-item">Single Item</option>
                        <option value="bundle">Bundle</option>
                        </select>
                    </div>
                </div>

                <div className="filter__right flex justify-end">
                  <select onChange={handleSort}>
                    <option>Sort By</option>
                    <option value="high">High Rate</option>
                    <option value="mid">Mid Rate</option>
                    <option value="low">Low Rate</option>
                  </select>
                </div>
              </div>
           
      </section>
     
      <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding}  relative `}>
      <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient bottom-40" />
      <div className="flex flex-wrap sm:justify-start justify-center w-full feedback-container relative z-[1]">
      {data?.map((item) => (
            <Nft key={item} item={item} />
            ))}
    </div>
      </section>
      </div>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
      <Footer />
      </div>
      </div>
    
    </>
  );
};

export default Market;
