import { TbBusinessplan } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants/index.js';
// import { connectWallet } from '../services/blockchain'
// import { truncate, useGlobalState } from '../store'

const Header = () => {
//   const [connectedAccount] = useGlobalState('connectedAccount')
 //CONNECT WALLET
 const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
  console.log('provider', provider)
  console.log('web3Provider', web3Provider)
    // If user is not connected to the OP network, let them know and throw an error
    const OP_CHAINID=11155420;
    const LOCAL_HOST_CHAINID= 31337;
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== OP_CHAINID) {
      window.alert("Change the network to OP_CHAINID");
      throw new Error("Change the network to OP_CHAINID");
    }
    console.log('chainId', chainId)
  
    if (needSigner) {
      const signer = web3Provider.getSigner();
      console.log('signer', signer)
     
      return signer;
      
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress(); 
const truncatedAddress = address.slice(0, 6) + '...' + address.slice(38, 42);
setAddress(truncatedAddress);
    console.log('address', address)
    return web3Provider;

  };
  
  
  useEffect(() => {
    getProposals();
    getProviderOrSigner();
  }, [walletConnected, renderHandler]);
  return (
    <header
      className="flex justify-between items-center
        p-5 bg-white shadow-lg fixed top-0 left-0 right-0"
    >
      <Link
        to="/"
        className="flex justify-start items-center
      text-xl text-black space-x-1"
      >
        <span>Genesis</span>
        <TbBusinessplan />
      </Link>

      <div className="flex space-x-2 justify-center">
        {connectedAccount ? (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-green-600
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
          >
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-green-600
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
