// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Guestbook {

    event NewGuest(address indexed from, uint256 timestamp, string message);

    struct Guest {
        address wallet;
        uint timestamp;
        string message;
    }

    Guest[] guestbook;
    uint256 public guestCount;

    constructor() payable {
        console.log("The Guestbook contract has been constructed.");
    }

    function sign(string memory _message) public {
        guestCount += 1;
        console.log("%s says '%s'", msg.sender, _message);
        guestbook.push(Guest(msg.sender, block.timestamp, _message));
        emit NewGuest(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getGuestbook() public view returns (Guest[] memory) {
        return guestbook;
    }

    function getGuestCount() public view returns (uint256) {
        console.log("We have %d total guests!", guestCount);
        return guestCount;
    }
}