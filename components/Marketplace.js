import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useEffect,useState } from "react";

export default function Marketplace() {

// Sample data used for testing purposes
const sampleData = [
    {
        "name": "NFT#1",
        "description": "Cute Dog",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmTcQR1wMsnxakNikzePPJee77NxDtuRBkzvWeHva9vmfq",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#2",
        "description": "Fantastic Dog",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmdUXeAUvjiwmS3htSYECxrr6ewjF27B3FYhuLfF33W1Bq",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#3",
        "description": "Next Generation of Dog",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmbkEvueGNBbHduz3DAUX4vVzcYn8M4CVfitzQP1nw9tRG",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
];

// useState hooks to manage component state
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

// useEffect hook to fetch NFT data from the contract when the component mounts
useEffect(()=>{
    if (!dataFetched)
    getAllNFTs();

},[dataFetched])

// function to fetch all the NFTs from the smart contract
async function getAllNFTs() {
    const ethers = require('ethers');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // attach the NFT marketplace contract
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
    // fetch all the NFTs listed in the contract
    let transaction = await contract.getAllNFTs();

    console.log(transaction);
    // Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        // Fetch metadata from IPFS for each NFT
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        // Format the price to human-readable format
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        // create a new object with all the required details
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}


return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Top NFTs
            </div>
            <div className="flex mt-5 flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}