import { useState,useEffect } from "react";
import Image from 'next/future/image';
import { signOut, useSession } from 'next-auth/react';
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import Link from "next/link";
import styles from "../style";
import Cookies from 'js-cookie';

const Navbar = ({dispatch,title,status,session}) => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);


  const [currentAccount, setCurrentAccount] = useState('');
	const [network, setNetwork] = useState('');

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
  

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  
 
  useEffect(() => {
		console.log("checking....")
		checkIfWalletIsConnected();
	}, []);

  
  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };


  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <Link href="/">
        <h2 className="text-gradient  text-[32px] cursor-pointer">Akuverse</h2>
       
      </Link>
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`${nav.id}`}>{nav.title}</a>
          </li>

        ))}

        {session?.user ?
            <>
            <li className={`font-poppins font-normal cursor-pointer ml-10 text-[16px]`}>
              <a
              className="text-dimWhite"
                href="#"
                onClick={logoutClickHandler}
              >
              Logout
            </a>
            </li>
            </>
            :<li className={`font-poppins font-normal cursor-pointer ml-10 text-[16px]`} onClick={() => setActive("Dashboard")}>
                <a href="/login" className={` ${title === "Login" ? "text-white" : "text-dimWhite"}`}>Login</a>
            </li>
        }
      </ul>


           

      <button type="button" className={`py-4 ml-20  px-6  md: right-0 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none `}>
        <span>
          <i className="ri-wallet-line"></i>
        </span>
        { currentAccount ? <span>{currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </span> : 
                 
       <span onClick={connectWallet}>Connect Wallet</span>}
       
      </button>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <Image
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;
