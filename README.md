# Pinata_IPFS

This code is built on [alchemy](https://alchemy.com) and [pinata](https://www.pinata.cloud).

To deploy the smart contract on Goerli
```bash
npx hardhat run --network goerli scripts/deploy.js
``` 

To set up the repository and run the marketplace locally
First create a account on [alchemy](https://alchemy.com) and [pinata](https://www.pinata.cloud) and create a `.env` file and store the 
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
npm start
```


## Problem being solved: 
- Traceability: When photos are uploaded, there is a CID attached to that photo such that no one else can claim your work as their own.
- Storage limits: If your local storage is limited, you can upload your info to a different node and utilize that storage (cannot choose which node to store it on). 25gb upload per pin. 
- Understandability: You can upload data with additional information such as a summary, title, ect. 

## Testing:
- General functionality testing (ie. of each function) 
- Error checks for corrupt files 
- Error check for Pinnata being online 

## Frontend Features:





## Frontend ideas: 
To view all your photos in a similar format to below
