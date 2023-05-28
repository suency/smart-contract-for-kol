// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
//pragma solidity >=0.8.2 <0.9.0;
// pragma solidity ^0.8.19;
/* 
general idea:
user make a transaction with 100 for example, seller can get 90 and agent can get 10, 
if contract create set the percentage is 90%
*/

// please compile the contract using 0.8.19 solc.js if you want to compatible with polygon
contract TransferContract {
    address public contractCreator;
    uint256 public percentage; //seller set the percentage
    uint256 public sellerBalance; //seller balance in this contract

    uint256 public contractBalance;
    // wallet address => balance of this address in this contract
    struct WalletAddressValue {
        address walletAddress;
        uint256 balance;
    }

    struct DataType {
        address key1;
        address key2;
        uint256 value;
    }

    DataType[] public dataArr;
    // these two attrs are used for retrive data in the future, especially
    address[] public key1List;
    mapping(address => address[]) public key2List;

    event TransferValueEvent(address indexed sender, uint256 v1, uint256 v2, uint256 v3);

    constructor(uint256 initPercentage) {
        require(initPercentage >= 0 && initPercentage <=100 , "Amount should be >= 0 and <= 100");
        contractCreator = msg.sender; // contract creator address = seller address
        sellerBalance = 0; // seller balance in this contract
        percentage = initPercentage; // the portion of tokens that seller get, value from (0-100)
        contractBalance = 0;
    }

     //key is the buyer address, value is map for {key:agent address, value is balance of tokens received}
    mapping(address => mapping(address => uint256)) public list;

    function transferToContract(address agentAddress) public payable {
        require(msg.value > 0, "Amount should be > 0");

        // token allocations
        uint256 creatorAmount = (msg.value * percentage) / 100;
        uint256 agentAmount = (msg.value * (100 - percentage)) / 100;
        sellerBalance += creatorAmount; // update seller balance

        payable(contractCreator).transfer(creatorAmount); // pay to seller
        payable(agentAddress).transfer(agentAmount); // pay to agent

        // keep commission data for specific buyer -> multiple agents
        list[msg.sender][agentAddress] += agentAmount; // update balance in list (buyer and agent)

        // wirte data to dataArr
        DataType memory temp;
        temp.key1 = msg.sender;
        temp.key2 = agentAddress;
        temp.value = agentAmount;
        dataArr.push(temp);

        emit TransferValueEvent(msg.sender, msg.value, creatorAmount, agentAmount);
    }

    // retrieve all recording commisson data on chain
    function getAllData() public view returns (DataType[] memory) {
        return dataArr;
    }

    // get data from list when knowing specific buyer and agent addresses
    function getList(address buyerAddress, address agentAddress) public view returns(uint256) {
        return list[buyerAddress][agentAddress];
    }

    // get percentage from list
    function getPercentage() public view returns(uint256) {
        return percentage;
    }

    // get contract balance
    function getContractBalance() public view returns(uint256) {
        return contractBalance;
    }

    //contract creator can withdraw if there is contract balance
    function withdrawBalance() public {
        require(msg.sender == contractCreator, "Only the contract creator can withdraw");
        uint256 balance = contractBalance;
        contractBalance = 0;
        payable(contractCreator).transfer(balance);
    }

    //contract can receive tokens
    receive() external payable {
        contractBalance += msg.value;
    }
}