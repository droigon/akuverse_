import Web3 from 'web3';
import { Suspense, useState,useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, MapControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Web3Modal from "web3modal";
import { BigNumber, Contract, providers, utils,ethers  } from "ethers";
import styles from "../pages/style";

// Import CSS
//import './App.css';

// Import Components
import Navbar from './components/Navbar';
import Plane from './components/Plane';
import Plot from './components/Plot';
import Building from './components/Building';

// Import ABI
import Land from './abis/Land.json';

const LandAddress ='0x0C91d916176496579D423Ba6Ede24f00D3bC146C'

function Apps() {
	const [web3, setWeb3] = useState({})
	const [account, setAccount] = useState({})

	// Contract & Contract States
	const [landContract, setLandContract] = useState({})
    const web3ModalRef = useRef();
    const [walletConnected, setWalletConnected] = useState(false);

	const [cost, setCost] = useState(0)
	const [buildings, setBuildings] = useState([])
	const [landId, setLandId] = useState(0)
	const [landName, setLandName] = useState({})
	const [landOwner, setLandOwner] = useState({})
	const [hasOwner, setHasOwner] = useState(false)

	const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
    
        // If user is not connected to the Rinkeby network, let them know and throw an error
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 80001) {
          window.alert("Change the network to Rinkeby");
          
        }
    
        if (needSigner) {
          const signer = web3Provider.getSigner();
          return signer;
        }
        return web3Provider;
      };

	const loadBlockchainData = async () => {
		console.log("connected....")
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

            setWalletConnected(true)


            const accounts = await ethereum.request({ method: "eth_requestAccounts" });


		
			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);

			if (accounts.length > 0) {
				setAccount(accounts[0])
			}

			setLandContract(LandAddress)

            

            const signer = await getProviderOrSigner(false);
            // Create an instance of token contract
            const landContract = new Contract(
                "0x0C91d916176496579D423Ba6Ede24f00D3bC146C",
                Land,
                signer
            );
            // Get all the tokens that have been minted
            const cost = await landContract.cost();
			console.log("cost:",cost.toString())
            setCost(cost.toString());



			//const cost = await land.methods.cost().call()
			//setCost(web3.utils.fromWei(cost.toString(), 'ether'))

            const buildings = await landContract.getBuildings();
			const build = [
				["City Hall",0x0000000000000000000000000000000000000000,0,0,0,10,10,10,],
				['Stadium',0x0000000000000000000000000000000000000000,0,10,0,10,5,3,],
				['University',0x0000000000000000000000000000000000000000,0,-10,0,10,5,3,],
				['Shopping Plaza 1',0x0000000000000000000000000000000000000000,10,0,0,5,25,5,],
				['Shopping Plaza 2',0x0000000000000000000000000000000000000000,-10,0,0,5,25,5],
			]
			
            setBuildings(buildings);

            console.log("buildingssss",buildings)
            console.log("building",build)

			//const buildings = await land.methods.getBuildings().call()
			//setBuildings(buildings)

			// Event listeners...
			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
	}
}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}

	useEffect(() => {
		if (!walletConnected) {
		// Assign the Web3Modal class to the reference object by setting it's `current` value
		// The `current` value is persisted throughout as long as this page is open
		web3ModalRef.current = new Web3Modal({
		  network: "mumbai",
		  providerOptions: {},
		  disableInjectedProvider: false,
		});}
	loadBlockchainData()
}, [account])

	const buyHandler = async (_id) => {
		try {
			const signer = await getProviderOrSigner(true);
    
			const landContract = new Contract(
			landAddress,
			landABI,
			signer
			);

			await landContract.methods.mint(_id).send({ from: account, value: '1000000000000000000' })

			const buildings = await landContract.methods.getBuildings().call()
			setBuildings(buildings)

			setLandName(buildings[_id - 1].name)
			setLandOwner(buildings[_id - 1].owner)
			setHasOwner(true)
		} catch (error) {
			window.alert('Error occurred when buying')
		}
	}

	return (
		<>

			<div className="bg-primary w-full overflow-hidden">
			<div className={`${styles.paddingX} ${styles.flexCenter}`}>
			<div className={`${styles.boxWidth}`}>
				<Navbar />
			</div>
			</div>

			<div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      			<div className={`${styles.boxWidth}`}>
			
			<Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
				<Suspense fallback={null}>
					<Sky distance={450000} sunPosition={[1, 10, 0]} inclination={0} azimuth={0.25} />

					<ambientLight intensity={0.5} />

					

					{/* Load in each cell */}
					<Physics>
						{buildings && buildings.map((building, index) => {
							console.log(building);
							if (building.owner === '0x0000000000000000000000000000000000000000') {
								return (
									<>
									<Plot
										key={index}
										position={[building.posX, building.posY, 0.1]}
										size={[building.sizeX, building.sizeY]}
										landId={index + 1}
										landInfo={building}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasOwner={setHasOwner}
										setLandId={setLandId}
									/>
									</>
								)
							} else {
								return (
									<Building
										key={index}
										position={[building.posX, building.posY, 0.1]}
										size={[building.sizeX, building.sizeY, building.sizeZ]}
										landId={index + 1}
										landInfo={building}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasOwner={setHasOwner}
										setLandId={setLandId}
									/>
								)
							}
						})}
					</Physics>

					<Plane />
				</Suspense>
				<MapControls />
			</Canvas>
			</div>
			</div>

			{landId && (
				<div className="info">
					<h1 className="flex">{landName}</h1>

					<div className='flex-left'>
						<div className='info--id'>
							<h2>ID</h2>
							<p>{landId}</p>
						</div>

						<div className='info--owner'>
							<h2>Owner</h2>
							<p>{landOwner}</p>
						</div>

						{!hasOwner && (
							<div className='info--owner'>
								<h2>Cost</h2>
								<p>{`${cost} ETH`}</p>
							</div>
						)}
					</div>

					{!hasOwner && (
						<button onClick={() => buyHandler(landId)} className='button info--buy'>Buy Property</button>
					)}
				</div>
			)}
		</div>
		</>
	);
}


export default Apps;
