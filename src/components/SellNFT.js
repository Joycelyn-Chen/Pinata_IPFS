import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useSnackbar } from 'notistack';
import PopupMessage from './PopupMessage';
export default function SellNFT() {


    const [formParams, updateFormParams] = useState({ name: '', description: '', price: '' });
    const [fileURL, setFileURL] = useState(null);

    // Import ethers.js library and initialize message state variable
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { enqueueSnackbar } = useSnackbar();
    // upload NFT image to IPFS

    async function OnChangeFile(e) {
        const price = parseFloat(formParams.price);
        if (price < 0.01) {
            setErrorMessage('Price must be at least 0.01 ETH');
            e.target.value = '';
            return;
        }

        if (isNaN(price)) {
            setErrorMessage('Price must be a number');
            e.target.value = '';
            return;
        }

        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('File type not supported. Please upload a JPEG or PNG image.');
            e.target.value = '';
            return;
        }

        setSuccessMessage('Uploading file to IPFS.........');
        try {
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                setSuccessMessage('Uploaded image to pinata');
                setFileURL(response.pinataURL);
            } else {
                setErrorMessage('Error during file upload');
                e.target.value = '';
            }
        } catch (e) {
            setErrorMessage(`Error during file upload ${e}`);
            e.target.value = '';
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
                setSuccessMessage(`Uploaded JSON to Pinata: ${response.pinataURL}`, { autoHideDuration: 2000 });
                return response.pinataURL;
            }
        }
        catch (e) {
            setErrorMessage(`error uploading JSON metadata: ${e}`, { autoHideDuration: 2000 });
            return null;
        }
    }

    // Function to list NFT for sale on the marketplace
    async function listNFT(e) {
        e.preventDefault();

        // Check if price is greater than 0.01 ETH
        const price = parseFloat(formParams.price);
        if (price < 0.01) {
            setErrorMessage('Price must be at least 0.01 ETH');
            return;
        }

        // Additional check for the price field
        if (isNaN(price)) {
            setErrorMessage('Price must be a number');
            return;
        }

        // Upload NFT metadata to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            if (metadataURL == null) {
                setErrorMessage(`Please check all fields filled`);
                return;
            }
            // Get provider and signer from Web3 provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            setSuccessMessage(`Please wait... uploading`);

            // Initialize marketplace contract using address and ABI from JSON file
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
            // Convert NFT price to wei using ethers.js utility function
            const price = ethers.utils.parseUnits(formParams.price, 'ether');
            // Get listing price from marketplace contract
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            // actually create the NFT
            // Create the NFT and list it for sale on the marketplace
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice });
            await transaction.wait();

            alert('Successfuly listed your NFT!');
            updateMessage('');
            updateFormParams({
                name: '', description: '', price: ''
            });
            window.location.replace('/');
        }
        catch (e) {
            setErrorMessage(`Upload error ${e}`, { autoHideDuration: 3000 });
            updateFormParams({
                name: '', description: '', price: ''
              });
              fileURL="";
              

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
                            placeholder="NFT#2345"
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
                            placeholder="Crypto Emporium Collection"
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
                            min="0.01"
                            value={formParams.price}
                            onChange={(e) =>
                                updateFormParams({ ...formParams, price: e.target.value })
                            }
                        />
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
                        <input type={"file"} accept="image/*" capture="camera" onChange={OnChangeFile}></input>
                    </div>
                    <br></br>
                    <PopupMessage
                        message={errorMessage || successMessage}
                        isOpen={!!errorMessage || !!successMessage}
                        onRequestClose={() => {
                            setErrorMessage('');
                            setSuccessMessage('');
                        }}
                    />
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