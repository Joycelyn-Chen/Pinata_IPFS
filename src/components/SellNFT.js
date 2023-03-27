import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";
import { useSnackbar } from 'notistack';
import { ColorRing } from 'react-loader-spinner'
export default function SellNFT() {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: '' });
    const [fileURL, setFileURL] = useState(null);

    // Import ethers.js library and initialize message state variable
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');

    // Get current URL location
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    // upload NFT image to IPFS
    async function OnChangeFile(e) {
        updateMessage(`Uploading file to IPFS.........`);
        var file = e.target.files[0];
        try {
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                enqueueSnackbar(`Uploaded image to pinata: ${response.pinataURL}`, { autoHideDuration: 2000 });
                setFileURL(response.pinataURL);
            }
        updateMessage('');   
        }
        catch (e) {
            enqueueSnackbar(`Error during file upload ${e}`);
        }
    }

    // Function to upload NFT metadata to IPFS
    async function uploadMetadataToIPFS() {
        const { name, description, price } = formParams;
        // Check if form fields are empty
        if (!name || !description || !price || !fileURL)
            return null;
        // Create JSON object with NFT metadata
        const nftJSON = {
            name, description, price, image: fileURL
        };
        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                enqueueSnackbar(`Uploaded JSON to Pinata: ${response.pinataURL}`, { autoHideDuration: 2000 });
                return response.pinataURL;
            }
        }
        catch (e) {
            enqueueSnackbar(`error uploading JSON metadata: ${e}`, { autoHideDuration: 2000 });
            return null;
        }
    }

    // Function to list NFT for sale on the marketplace
    async function listNFT(e) {
        e.preventDefault();

        // Upload NFT metadata to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            if (metadataURL == null) {
                updateMessage(`Please check all fields filled`);
                return;
            }
            // Get provider and signer from Web3 provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage(`Please wait... uploading`);

            // Initialize marketplace contract using address and ABI from JSON file
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);

            // Convert NFT price to wei using ethers.js utility function
            const price = ethers.utils.parseUnits(formParams.price, 'ether');

            // Get listing price from marketplace contract
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            // Create the NFT and list it for sale on the marketplace
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice });
            await transaction.wait();

            enqueueSnackbar('Successfuly listed your NFT!', { autoHideDuration: 3000 });
            updateMessage('');
            updateFormParams({
                name: '', description: '', price: ''
            });
            window.location.replace('/');
        }
        catch (e) {
            enqueueSnackbar(`Upload error ${e}`, { autoHideDuration: 3000 });
        }
    }

    // Render the form
    return (
        <div className="">
            <Navbar />
            <div className="flex flex-col place-items-center mt-10" id="nftForm">
                <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
                    <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, name: e.target.value })} value={formParams.name}></input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
                        <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Axie Infinity Collection" value={formParams.description} onChange={e => updateFormParams({ ...formParams, description: e.target.value })}></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({ ...formParams, price: e.target.value })}></input>
                    </div>
                    <div>
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image</label>
                        <input type={"file"} onChange={OnChangeFile}></input>
                    </div>
                    <br></br>
                    {message ? <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    /> :
                        null}
                    <div className="text-green text-center">{message}</div>
                    <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                        List NFT
                    </button>
                </form>
            </div>
        </div>
    )
}