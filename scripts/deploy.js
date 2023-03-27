// Importing packages
const { ethers } = require("hardhat"); // ethers library to interact with Ethereum contracts
const hre = require("hardhat"); // Hardhat Runtime Environment package
const fs = require("fs"); // Node.js file system package

// Define an async function to deploy the NFT marketplace contract
async function main() {
  const [deployer] = await ethers.getSigners(); // Get the signer account (deployer) from Hardhat network
  const balance = await deployer.getBalance(); // Get the account balance of the deployer

  // Get the NFTMarketplace contract factory instance using Hardhat ethers
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await Marketplace.deploy(); // Deploy the NFTMarketplace contract

  await marketplace.deployed(); // Wait for the contract deployment to complete

  // Store the contract address and ABI in a JSON object
  const data = {
    address: marketplace.address,
    abi: JSON.parse(marketplace.interface.format('json'))
  }

  // Write the contract address and ABI to a JSON file (Marketplace.json)
  fs.writeFileSync('./src/Marketplace.json', JSON.stringify(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
