import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { enqueueSnackbar, useSnackbar } from 'notistack';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

export default function Marketplace() {
    const sampleData = [
        {
            "name": "NFT#1",
            "description": "Cute Dog",
            "website": "http://axieinfinity.io",
            "image": "https://gateway.pinata.cloud/ipfs/QmTcQR1wMsnxakNikzePPJee77NxDtuRBkzvWeHva9vmfq",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "name": "NFT#2",
            "description": "Fantastic Dog",
            "website": "http://axieinfinity.io",
            "image": "https://gateway.pinata.cloud/ipfs/QmdUXeAUvjiwmS3htSYECxrr6ewjF27B3FYhuLfF33W1Bq",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "name": "NFT#3",
            "description": "Next Generation of Dog",
            "website": "http://axieinfinity.io",
            "image": "https://gateway.pinata.cloud/ipfs/QmbkEvueGNBbHduz3DAUX4vVzcYn8M4CVfitzQP1nw9tRG",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
    ];
    const [data, updateData] = useState(sampleData);
    const [dataFetched, updateFetched] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    useEffect(() => {
        if (!dataFetched)
            getAllNFTs();

    }, [dataFetched])

    async function getAllNFTs() {
        const ethers = require('ethers');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        let transaction = await contract.getAllNFTs();

        // Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {

            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI,{  headers: {
                'Accept': 'text/plain'
              }});
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
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
        })).catch(err => { enqueueSnackbar(err, { autoHideDuration: 1000 }) })



        updateFetched(true);
        updateData(items);
    }


    return (
        <div>
            <Navbar></Navbar>
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    MOST POPULAR PIXELS
                </div>

                <div className="flex mt-5 flex-wrap max-w-screen-xl text-center">

                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}

                </div>
            </div>
        </div>
    );

};