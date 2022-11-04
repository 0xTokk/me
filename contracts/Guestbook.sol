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

    constructor() {
        console.log("Welcome to the Guestbook.");
    }

    function sign(string memory _message) public {
        guestCount += 1;
        console.log("%s says '%s'", msg.sender, _message);
        guestbook.push(Guest(msg.sender, block.timestamp, _message));
        emit NewGuest(msg.sender, block.timestamp, _message);
    }

    function getGuestbook() public view returns (Guest[] memory) {
        return guestbook;
    }

    function getGuestCount() public view returns (uint256) {
        console.log("We have %d total guests!", guestCount);
        return guestCount;
    }
}