// Importing required dependencies
import Navbar from "./Navbar"; 
import { useLocation, useParams } from 'react-router-dom'; // Importing hooks from react-router-dom
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios"; // Importing Axios for making HTTP requests
import { useEffect, useState } from "react";
import NFTTile from "./NFTTile";

// Declaring the Profile component
export default function Profile () {

    // Initializing state variables
    const [data, updateData] = useState([]); // NFT data array
    const [address, updateAddress] = useState("0x"); // Wallet address
    const [totalPrice, updateTotalPrice] = useState("0"); // Total value of NFTs
    const [dataFetched, updateFetched] = useState(false); // Boolean flag to check if data is fetched
    const params = useParams(); // Retrieving route parameters
    useEffect(()=>{
        
         const tokenId = params.tokenId;
        if (!dataFetched)
        getNFTData(tokenId);
    
    },[dataFetched])

    // Async function to fetch NFT data
    async function getNFTData(tokenId) {
        const ethers = require('ethers'); // Importing ethers.js library
        let sumPrice = 0;

        // Initializing provider and signer objects
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress(); // Retrieving wallet address

        // Initializing contract object
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        // Retrieving NFTs for the user
        let transaction = await contract.getMyNFTs();

        // Fetching NFT metadata for each NFT
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {

                // Extracting required data from the metadata
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            sumPrice += Number(price);
            return item;
        }))

        // Updating state variables with fetched data
        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    // Rendering the Profile component
    return (
        <div className="profileClass" style={{ minHeight: "100vh" }}>
          <Navbar />
          <div className="profileClass flex flex-col items-center mt-11 text-white">
            <div className="flex flex-col text-center mb-5 md:text-2xl">
              <h2 className="font-bold">Wallet Address</h2>
              {address}
            </div>
            <div className="flex flex-col text-center mb-5 md:text-2xl">
              <h2 className="font-bold">No. of NFTs</h2>
              {data.length}
            </div>
            <div className="flex flex-col text-center mb-10 md:text-2xl">
              <h2 className="font-bold">Total Value</h2>
              {totalPrice} ETH
            </div>
            <div className="flex flex-col text-center w-full">
              <h2 className="font-bold">Your NFTs</h2>
              <div className="flex flex-wrap justify-center w-full max-w-screen-xl">
                {data.map((value, index) => {
                  return <NFTTile data={value} key={index}></NFTTile>;
                })}
              </div>
              <div className="mt-10 text-xl">
                {data.length == 0 ? "Oops, No NFT data to display (Are you logged in?)" : ""}
              </div>
            </div>
          </div>
        </div>
      );
      
};