import React, { useState,useRef,useEffect } from "react";
import Link from 'next/link';
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import Nft from "../components/ui/Nft-card/nft";
import { NFT__DATA } from "../assets/data/data";
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Testimonials, Hero } from "./components";
import { toast } from 'react-toastify';
import { Container, Row, Col } from "reactstrap";
import styles from "../pages/style";
import Image from 'next/future/image';
import { useForm } from 'react-hook-form';
import ReactTooltip from "react-tooltip";
import { BigNumber, Contract, providers, utils } from "ethers";
import { akuverseABI,akuverseAddress } from "./constants";
import Web3Modal from "web3modal";

//import "../styles/market.css";

const Upload = () => {
    const web3ModalRef = useRef();
    const [walletConnected, setWalletConnected] = useState(false);
    const [currentAccount, setCurrentAccount] = useState('');

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

	

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}


		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
		const chainId = await ethereum.request({ method: 'eth_chainId' });
    
    console.log("chain ID:", chainId)
		if (chainId !== '0x13881') {
			window.alert("Change the network to Mumbai", chainId);
		  }
		console.log("chain ID:", chainId)
		setNetwork(chainId);

		ethereum.on('chainChanged', handleChainChanged);
		
		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	};
  
 const {handleSubmit,register,getValues,formState: { errors },} = useForm();
  const submitHandler = async ({name,symbol,image,amount,about,shares }) => {
    try {
        const signer = await getProviderOrSigner(true);
        
        //final transfer transaction
        const akuverseContract = new Contract(
          akuverseAddress,
          akuverseABI,
          signer
        );
        console.log(akuverseContract)
        const tx = await akuverseContract.create(name,symbol,image,amount,about,shares);
        console.log(tx)
       
        
        setLoading(false);
        window.alert("Sucessfully transfered");
  
      }
       catch (err) {
        console.error(err);
      toast.error(err);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    console.log(chainId)
    if (chainId !== 80001) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };



  const Upload = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      
      //final transfer transaction
      const routerContract = new Contract(
        ROUTER_ADDRESS,
        ROUTER_ABI,
        signer
      );
      console.log(routerContract)
      const transferTx = await routerContract.buyTokensUSDC();
      console.log(transferTx)
      const balance = await routerContract.getContractBalance()
      console.log(balance)
      
      setLoading(false);
      window.alert("Sucessfully transfered");

    } catch (err) {
      console.error(err);
    }
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
    

    
     

    
      </div>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>

      <div className="flex min-h-full items-center justify-center  ">
        <div className="w-full max-w-xl space-y-8 bg-black-gradient-2 rounded-[20px] box-shadow px-4 sm:px-6 py-12 lg:px-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://droigon.com/images/logo.png"
              alt="Your Company"
            />
           
            <h2 className="mt-6 text-gradient text-center text-3xl font-bold tracking-tight text-gray-900">
             Mint House To Marketplace
            </h2>
       
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitHandler)} >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
            
            <div className="">
            <label htmlFor="name" className="text-white px-3 py-2 sr-only">Name:</label>
            <input
            data-tip data-for="name"
                type="text"
                id="name"
                autoFocus

                className="relative block w-full appearance-none mb-4 rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                name="email"
                placeholder="Name:"
                {...register('name', {
                required: 'Please enter name',
                })}
            />
            <ReactTooltip id="name" place="top" textColor="white" backgroundColor="black" effect="solid">
                Tooltip for the register button
            </ReactTooltip>
            {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
            )}
             </div>
             <div className="">
            <label htmlFor="symbol" className="sr-only">symbol</label>
            <input
            data-tip data-for="symbol"
                type="text"
                id="symbol"
                autoFocus

                className="relative block w-full mb-4 appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                name="symbol"
                placeholder="Symbol:"
                {...register('symbol', {
                required: 'Please enter the symbol',
                maxLength:{value:5,message:"error"}
                })}
            />
            <ReactTooltip id="symbol" place="top" textColor="white" backgroundColor="black" effect="solid">
                Enter the nft symbol
                </ReactTooltip>

        
            {errors.symbol && (
                <div className="text-red-500">{errors.symbol.message}</div>
            )}
             </div>

             <div className="">
            <label htmlFor="symbol" className="sr-only">symbol</label>
            <input
                type="text"
                id="image"
                autoFocus

                className="relative block w-full mb-4 appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                name="image"
                placeholder="Image:"
                {...register('image', {
                required: 'Please enter the image',
                })}
            />
            {errors.image && (
                <div className="text-red-500">{errors.image.message}</div>
            )}
             </div>
             <div className="mb-4">
            <label htmlFor="amount" className="sr-only">amount</label>
            <input
                type="number"
                id="amount"
                autoFocus

                className="relative block w-full mb-4 appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                name="amount"
                placeholder="Amount:"
                {...register('amount', {
                required: 'Please enter the image',
                })}
            />
            {errors.amount && (
                <div className="text-red-500">{errors.amount.message}</div>
            )}
             </div>
             <div className="mb-4">
            <label htmlFor="about" className="sr-only">about</label>
            <input
                type="text"
                id="about"
                autoFocus

                className="relative block w-full mb-4 appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                name="about"
                placeholder="About:"
                {...register('about', {
                required: 'Please enter the about',
                })}
            />
            {errors.about && (
                <div className="text-red-500">{errors.about.message}</div>
            )}
             </div>
             <div className="mb-4">
            <label htmlFor="shares" className="sr-only">Shares</label>
            <input
            data-tip data-for="shares"
                type="number"
                id="shares"
                autoFocus

                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                name="shares"
                placeholder="Shares:"
                {...register('shares', {
                required: 'Please enter the shares',
                })}
            />
            <ReactTooltip id="shares" place="top" textColor="white" backgroundColor="black" effect="solid">
           No of shares
            </ReactTooltip>
            {errors.shares && (
                <div className="text-red-500">{errors.shares.message}</div>
            )}
             </div>
              
              
            </div>

          

            <div className="mb-4 ">
       
        </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  
                </span>
               Upload
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      </div>
      </div>
    
    </>
  );
};

export default Upload;
