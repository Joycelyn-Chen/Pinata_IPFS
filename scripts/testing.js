// Import the Marketplace contract instance from the JSON file
const Marketplace =  require("../src/Marketplace.json");

// Define an async function to get the list of NFTs from the deployed contract
async function getNFts () {
// Get the NFTMarketplace contract factory instance using Hardhat ethers  
const MyContract = await ethers.getContractFactory("NFTMarketplace");
// Attach the deployed contract instance to the factory instance
const contract = await MyContract.attach(
  Marketplace.address
);

// Call the getListPrice function of the contract to get a list of NFTs and their prices
var vals = await contract.getListPrice();
console.log(vals);

/*const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();
const addrsign = await signer.getAddress();

let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
let transaction = await contract.getAllNFTs()
console.log(transaction);*/
}

getNFts();


