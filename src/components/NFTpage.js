import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import PopupMessage from './PopupMessage';
// Defining and exporting a functional component
export default function NFTPage(props) {

    // Initializing state variables using useState hook
    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [currAddress, updateCurrAddress] = useState("0x");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Using the useParams hook from react-router-dom to get the tokenId from the URL parameters
    const params = useParams();
    const tokenId = params.tokenId;

    // Using the useEffect hook to get NFT data when the component mounts
    useEffect(() => {
        if (!dataFetched)
            getNFTData(tokenId);
    }, [dataFetched])
    const { enqueueSnackbar } = useSnackbar();
    async function getNFTData(tokenId) {
        const ethers = require('ethers');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Creating an instance of the Marketplace contract using the contract address and ABI from Marketplace.json
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        // Getting the tokenURI and listedToken information for the given tokenId
        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);

        // Retrieving the metadata of the NFT from IPFS
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        // Creating an object with relevant NFT data
        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        // Updating the data state with the NFT data
        updateData(item);
    }

    // Function to execute a purchase of an NFT
    async function buyNFT(tokenId) {
        try {
            const ethers = require('ethers');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Creating an instance of the Marketplace contract using the contract address and ABI from Marketplace.json
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

            // Parsing the sale price in ether and executing the sale transaction
            const salePrice = ethers.utils.parseUnits(data.price, 'ether');
            let transaction = await contract.executeSale(tokenId, { value: salePrice });
            await transaction.wait();

            setSuccessMessage('You successfully bought the NFT!', { autoHideDuration: 3000 });
        } catch (e) {
            setErrorMessage(`Upload Error ${e}`, { autoHideDuration: 3000 });
        }
    }

    // Returning the JSX code for the NFT page
    return (
        <div style={{ minHeight: "100vh" }}>
            <Navbar />
            <div className="flex justify-center items-center mt-20">
                <div className="w-full max-w-lg p-6 space-y-6 bg-gray-600 rounded-lg shadow-lg">
                    <img src={data.image} alt="" className="w-full h-72 object-cover rounded-md" />
                    <div className="text-white mt-6">
                        <div className="text-xl font-bold mb-2">{data.name}</div>
                        <div className="text-sm mb-2">{data.description}</div>
                        <div className="text-sm text-gray-400 mb-2">Price: <span className="text-green-400">{data.price} ETH</span></div>
                        <div className="text-sm text-gray-400 mb-2">Owner: {data.owner}</div>
                        <div className="text-sm text-gray-400 mb-2">Seller: {data.seller}</div>
                    </div>
                    <div>
                        {!data.name || !data.description || !data.price || !data.owner || !data.seller ? (
                            <button className="bg-gray-400 cursor-not-allowed text-white font-bold py-2 px-4 rounded text-sm opacity-50" disabled>
                                Buy this NFT
                            </button>
                        ) : currAddress == data.owner || currAddress == data.seller ? (
                            <div className="text-emerald-700">You are the owner of this NFT</div>
                        ) : (
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>
                                Buy this NFT
                            </button>
                            
                        )}
                        <br></br>
                    <PopupMessage
                        message={errorMessage || successMessage}
                        isOpen={!!errorMessage || !!successMessage}
                        onRequestClose={() => {
                            setErrorMessage('');
                            setSuccessMessage('');
                        }}
                    />
                        <div className="text-green-400 text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>

        </div>

    )
}