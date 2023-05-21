// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

contract TransferContract {
    address public contractCreator;
    uint256 public percentage; //seller get the percentage
    uint256 public sellerBalance;

    struct WalletAddressValue {
        address walletAddress;
        uint256 balance;
    }

    constructor(uint256 initPercentage) {
        contractCreator = msg.sender;
        sellerBalance = 0;
        percentage = initPercentage;
    }

     //key is the buyer and value is {address,100eth}
    mapping(address => mapping(address => uint256)) public list;

    function transferToContract(address agentAddress) public payable {
        require(msg.value > 0, "Amount should be > 0");

        uint256 creatorAmount = (msg.value * percentage) / 100;
        uint256 agentAmount = (msg.value * (100 - percentage)) / 100;
        sellerBalance += creatorAmount;

        payable(contractCreator).transfer(creatorAmount);
        payable(agentAddress).transfer(agentAmount);

        list[msg.sender][agentAddress] += agentAmount;
    }

    /* function getValue(address buyer, address agent) public view returns (uint256 Storage) {
        return list[buyer][agent] ? list[buyer][agent] : 0;
    }
    
    receive() external payable {
    
    } */
}