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
     
    function Example() {
      return (
        <div style={{ backgroundColor: 'white', width: '500px' }}>
          This is the content of the pop-up.
        </div>
      );
    }
    async function OnChangeFile(e) {
        // Check if price is greater than 0.01 ETH
        const price = parseFloat(formParams.price);
        if (price < 0.01) {
            updateMessage('Price must be at least 0.01 ETH');
            return;
        }
    
        // Additional check for the price field
        if (isNaN(price)) {
            updateMessage('Price must be a number');
            return;
        }
        updateMessage(`Uploading file to IPFS.........`);
        var file = e.target.files[0];
        try {
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                const message = `Uploaded image to pinata: ${response.pinataURL}`;
                updateMessage(message);
                setTimeout(() => {
                    updateMessage('');
                }, 3000);
                setFileURL(response.pinataURL);
            }
            else {
                updateMessage('');
            }
        }
        catch (e) {
            const message = `Error during file upload ${e}`;
            updateMessage(message);
            setTimeout(() => {
                updateMessage('');
            }, 2000);
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

        // Check if price is greater than 0.01 ETH
        const price = parseFloat(formParams.price);
        if (price < 0.01) {
            updateMessage('Price must be at least 0.01 ETH');
            return;
        }

        // Additional check for the price field
        if (isNaN(price)) {
            updateMessage('Price must be a number');
            return;
        }

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
            const weiPrice = ethers.utils.parseUnits(price.toString(), 'ether');

            // Check if user has sufficient balance to pay for gas
            const gasLimit = await contract.estimateGas.createToken(metadataURL, weiPrice, { value: 0 });
            const gasPrice = await provider.getGasPrice();
            const gasCost = gasLimit.mul(gasPrice);
            const balance = await provider.getBalance(signer.getAddress());
            if (balance.lt(gasCost)) {
                updateMessage('Insufficient balance to pay for gas');
                return;
            }

            // Get listing price from marketplace contract
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            // Create the NFT and list it for sale on the marketplace
            let transaction = await contract.createToken(metadataURL, weiPrice, { value: listingPrice, gasLimit: gasLimit });
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
                    <h3 className="text-center font-bold text-purple-500 mb-8">
                        Upload your NFT to the marketplace
                    </h3>
                    <div className="mb-4">
                        <label
                            className="block text-purple-500 text-sm font-bold mb-2"
                            htmlFor="name"
                        >
                            NFT Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Axie#4563"
                            onChange={(e) =>
                                updateFormParams({ ...formParams, name: e.target.value })
                            }
                            value={formParams.name}
                        ></input>
                        {!formParams.name && (
                            <div className="text-red-500 text-sm">Please enter a name.</div>
                        )}
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-purple-500 text-sm font-bold mb-2"
                            htmlFor="description"
                        >
                            NFT Description
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            cols="40"
                            rows="5"
                            id="description"
                            type="text"
                            placeholder="Axie Infinity Collection"
                            value={formParams.description}
                            onChange={(e) =>
                                updateFormParams({ ...formParams, description: e.target.value })
                            }
                        ></textarea>
                        {!formParams.description && (
                            <div className="text-red-500 text-sm">
                                Please enter a description.
                            </div>
                        )}
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-purple-500 text-sm font-bold mb-2"
                            htmlFor="price"
                        >
                            Price (in ETH)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            placeholder="Min 0.01 ETH"
                            step="0.01"
                            value={formParams.price}
                            onChange={(e) =>
                                updateFormParams({ ...formParams, price: e.target.value })
                            }
                        ></input>
                        {!formParams.price && (
                            <div className="text-red-500 text-sm">
                                Please enter a price.
                            </div>
                        )}
                    </div>
                    <div>
                        <label
                            className="block text-purple-500 text-sm font-bold mb-2"
                            htmlFor="image"
                        >
                            Upload Image
                        </label>
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
                    <button
                        disabled={!formParams.name || !formParams.description || !formParams.price}
                        onClick={listNFT}
                        className={`font-bold mt-10 w-full rounded p-2 shadow-lg 
    ${(!formParams.name || !formParams.description || !formParams.price) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-700 hover:text-white focus:outline-none focus:shadow-outline'}`}
                    >
                        List NFT
                    </button>
                </form>
            </div>
        </div>
    )
}