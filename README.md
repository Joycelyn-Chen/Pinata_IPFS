# Pinata_IPFS
With [Alchemy](https://alchemy.com) and [Pinata](https://www.pinata.cloud) powering the backend, the Crypto Emporium delivers a robust and reliable platform for artists and collectors to engage with the exciting world of NFTs, empowering creators and enabling collectors to own unique digital assets securely.

Collectors can easily browse and discover NFTs on the app's marketplace, powered by Alchemy's scalable and high-performance API. The app also provides a seamless buying and selling experience, with secure transactions facilitated by Alchemy's blockchain infrastructure, ensuring transparency and security.

To deploy the smart contract on Goerli TestNet
```bash
npx hardhat run --network goerli scripts/deploy.js
``` 

To set up the repository and run the app locally follow the steps below:
First create a account on [alchemy](https://alchemy.com) and [pinata](https://www.pinata.cloud) and create a `.env` file in the root directory of the repository to store the secrets
```
REACT_APP_PINATA_KEY=
REACT_APP_PINATA_SECRET=
REACT_APP_ALCHEMY_API_URL=
REACT_APP_PRIVATE_KEY=
```
run the below command
```bash
git clone https://github.com/Joycelyn-Chen/Pinata_IPFS.git
cd Pinata_IPFS
npm install
npm install react-modal
npm start
```

## Problem being solved: 
- Traceability: When photos are uploaded, there is a CID attached to that photo such that no one else can claim your work as their own.
- Storage limits: If your local storage is limited, you can upload your info to a different node and utilize that storage (cannot choose which node to store it on). 25gb upload per pin. 
- Understandability: You can upload data with additional information such as a summary, title, etc. 
- Secure and Decentralized File Hosting: Pinata's decentralized file hosting ensures that artists' digital artwork remains secure and accessible even if their original files are removed or lost. This solves the problem of reliance on centralized file hosting services that may pose risks of data loss or censorship.
- Transparent and Secure Transactions: The app's integration with Alchemy's blockchain infrastructure ensures transparent and secure transactions, eliminating the risk of fraud or counterfeit NFTs.
- Personalized NFT Wallet: The app's integrated wallet allows users to manage their NFT collection, track ownership, and view transaction history, solving the problem of fragmented NFT management across multiple platforms. It provides a unified and convenient solution for users to organize and manage their digital assets.
## Testing:
- General functionality testing: Jest testing framework is used for writing unit tests to verify the correctness of individual functions or components within the app, such as the minting process, transaction handling, and wallet management.
- Error checks for corrupt files
- Error check for Pinnata being online 
- Integration tests have been done that verify the interactions between different components of the app, such as the integration of Alchemy and Pinata APIs with the frontend components.

## Frontend Features:
- Create a new NFT token by connecting to Goerli TestNet in MarketPlace
- Buy an existing NFT token from the marketplace 

## Bugs
- Environment Specific: Sometimes the .env variables are not set properly which might lead to failing of API calls in such cases just directly enter the secrets in `pinata.js` file.
- UI bug: This is also happening in the local environment (won't be a problem in deployed env), even when the MetaMask wallet isn't connected to the app the button shows connected. Currently this is work in progress but one can still connect the wallet by clicking on the button.


## Future Enhancement: 
- Enhanced Security Measures: Strengthening the security measures of the app by implementing additional layers of encryption, authentication, and authorization to safeguard user data, transactions, and assets.
- Integration with Other Blockchain Networks: Exploring opportunities to integrate with other blockchain networks, apart from the ones supported by Alchemy, to provide more options for users to mint and trade NFTs.
- Implementing End-to-End (E2E) Testing: Jest can be used to write E2E tests that simulate user interactions with the app, covering scenarios such as creating NFTs, buying and selling NFTs on the marketplace, and managing the NFT wallet.
- Dockerizing the app 
- Enhanced Marketplace Features: Implementing advanced marketplace features such as auctions, bidding, and offers to provide more flexibility and options for users to buy and sell NFTs.


# Contributions
- This is an extension work from the github source: https://github.com/SoftTalents/PetDog_NFT_Marketplace.
- The code owners from above have directly given us permission to use, and modify their code.
