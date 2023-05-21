const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
// Connect to the Polygon testnet
const web3 = new Web3('https://rpc-mumbai.maticvigil.com');

// Example test function
async function test() {
    // Get the latest block number
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Latest block number:', blockNumber);

    // Get the balance of an address
    const address = '0xA643969BCF5a3891f4E51c14F8Aa3491C2189918';
    const balance = await web3.eth.getBalance(address);
    console.log('Balance of address', address, ':', web3.utils.fromWei(balance, 'ether'), 'MATIC');
}

// Run the test function
//test().catch(console.error);
const fileName = "TransferContract";
// read souce file
const contractFile = fs.readFileSync(`../solidity/${fileName}.sol`, 'utf-8');

// define input
const input = {
    language: 'Solidity',
    sources: {
        [`${fileName}.sol`]: {
        content: contractFile,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };
  
// compile contract
const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

  //get abi and byte code
const contractABI = compiledContract.contracts[`${fileName}.sol`][`${fileName}`].abi;
const contractBytecode = compiledContract.contracts[`${fileName}.sol`][`${fileName}`].evm.bytecode.object;

console.log('Contract ABI:', contractABI);
console.log('Contract Bytecode:', contractBytecode);