import fullLogo from '../app_logo.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

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
      ethereumButton.classList.remove('hover:bg-blue-70');
      ethereumButton.classList.remove('bg-blue-500');
      ethereumButton.classList.add('hover:bg-green-70');
      ethereumButton.classList.add('bg-green-500');
    } else {
      ethereumButton.classList.remove('hover:bg-green-70');
      ethereumButton.classList.remove('bg-green-500');
      ethereumButton.classList.add('hover:bg-blue-70');
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
    if (!window.ethereum.isMetaMask)
      return;

    if (window.ethereum.providers !== undefined) {
      window.ethereum = window.ethereum.providers.find(provider => provider.isMetaMask === true);
    }

    let val = window.ethereum.isConnected();

    if (val) {
      console.log("here");
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
    <div className="">
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='flex items-end ml-5 pb-2'>
            <Link to="/">
              <img src={fullLogo} alt="" width={70} height={70} className="inline-block -mt-2" />
              <div className='inline-block font-bold text-xl ml-2'>
                Pixel Emporium
              </div>
            </Link>
          </li>
          <li className='w-2/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
              {location.pathname === "/" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/">Emporium</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/">Marketplace</Link>
                </li>
              }
              {location.pathname === "/sellNFT" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/sellNFT">Add My NFT</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/sellNFT">Add My NFT</Link>
                </li>
              }
              {location.pathname === "/profile" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/profile">Profile</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/profile">Profile</Link>
                </li>
              }
              <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>{connected ? "Connected" : "Connect Wallet"}</button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className='text-white text-bold text-right mr-10 text-sm'>
        {currAddress !== "0x" ? "Connected to" : "Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0, 15) + '...') : ""}
      </div>
    </div>
  );
}

export default Navbar;