const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
const cors = require('cors');
const contractData = require('./TransferContract.json');
const express = require('express');
const app = express();
app.use(cors());
const port = 33333;
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
    // evmVersion:'london'
  },
};

function getCompileContract() {
  // compile contract
  const contractABI = contractData.abi;
  const contractBytecode = contractData.bytecode;
  console.log('Contract ABI:', contractABI);
  console.log('Contract Bytecode:', contractBytecode);
  return {
    contractABI,
    contractBytecode
  }
}



// 定义 GET 请求的接口
app.get('/api/compileContract', (req, res) => {
  // 处理请求逻辑，返回数据
  const data = { message: 'Hello, World!' };
  res.json(getCompileContract());
  // res.json(data);
});

// 启动服务器监听指定端口
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});