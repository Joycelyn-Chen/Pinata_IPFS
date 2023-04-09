import fullLogo from '../app_logo.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useLocation
} from "react-router-dom";
import { useEffect, useState } from 'react';

function Navbar() {

  // Define state variables
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState('0x');

  // Function to get the user's Ethereum address
  async function getAddress() {
    const ethers = require('ethers');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  // Function to update the "Connect Wallet" button style based on the connection status
  function updateButton(status = true) {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    toggleConnect(status);
    if (status) {
      ethereumButton.classList.remove('bg-blue-500');
      ethereumButton.classList.add('bg-green-600');
    } else {
      ethereumButton.classList.remove('bg-green-600');
      ethereumButton.classList.add('bg-blue-500');
    }
  }

  // Function to connect the website to the user's MetaMask wallet
  async function connectWebsite() {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId'
    });
    if (chainId !== '0x5') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }]
      })
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(async () => {
        await getAddress();
        updateButton();
        window.location.replace(location.pathname);
      });
  }

  // Use the useEffect hook to check if the user is connected to MetaMask
  useEffect(() => {
    // Check if the user is using MetaMask
    if (!window.ethereum.isMetaMask)
      return;

    // Set the Ethereum provider to MetaMask
    if (window.ethereum.providers !== undefined) {
      window.ethereum = window.ethereum.providers.find(provider => provider.isMetaMask === true);
    }

    let val = window.ethereum.isConnected();

    if (val) {
      // If the user is connected, get their address and update the "Connect Wallet" button
      getAddress();
      updateButton(val);
    }
    
    // Add an event listener for when the user changes accounts in MetaMask
    window.ethereum.on('accountsChanged', function(accounts){
      window.location.replace(location.pathname)
    })
  });
  // Return the navbar component with the appropriate links and button
  
  return (
    <div className="min-w-screen bg-blue-500 bg-opacity-20">
      <nav className="w-screen" style={{ width: "100%" }}>
        <ul className="flex flex-wrap items-center justify-between py-3 bg-transparent text-white pr-5">
          <li className="flex items-center ml-5 pb-2">
            <Link to="/">
              <img src={fullLogo} alt="" width={70} height={70} className="inline-block -mt-2 animate-pulse" />
              <div className="inline-block font-bold text-xl ml-2 tracking-widest">
                Crypto Emporium
              </div>
            </Link>
          </li>
          <li className="w-full lg:w-auto">
            <div className="flex flex-wrap justify-center lg:justify-end">
              <ul className="lg:flex justify-between font-bold text-lg mr-10">
                {location.pathname === "/" ? (
                  <li className="border-b-2 hover:pb-0 p-2">
                    <Link to="/">Marketplace</Link>
                  </li>
                ) : (
                  <li className="hover:border-b-2 hover:pb-0 p-2">
                    <Link to="/">Marketplace</Link>
                  </li>
                )}
                {location.pathname === "/sellNFT" ? (
                  <li className="border-b-2 hover:pb-0 p-2">
                    <Link to="/sellNFT">Add My NFT</Link>
                  </li>
                ) : (
                  <li className="hover:border-b-2 hover:pb-0 p-2">
                    <Link to="/sellNFT">Add My NFT</Link>
                  </li>
                )}
                {location.pathname === "/profile" ? (
                  <li className="border-b-2 hover:pb-0 p-2">
                    <Link to="/profile">Profile</Link>
                  </li>
                ) : (
                  <li className="hover:border-b-2 hover:pb-0 p-2">
                    <Link to="/profile">Profile</Link>
                  </li>
                )}
                <li>
                  <button className={`enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-all duration-300 ease-in-out ${connected ? "bg-green-500" : "bg-yellow-500 hover:bg-yellow-600"}`} onClick={connectWebsite}>
                    {connected ? "Connected" : "Connect Wallet"}
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
      <div className="flex justify-center lg:justify-end mr-10">
        <div className={`text-white font-bold text-sm text-center lg:text-right ${currAddress !== "0x" ? "animate-bounce" : ""}`}>
          {currAddress !== "0x" ? `Connected to ${currAddress.substring(0, 15)}...` : "Not Connected. Please agin login to view NFTs"}
        </div>
      </div>
    </div>
  );
            }
export default Navbar;