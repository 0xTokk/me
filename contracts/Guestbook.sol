// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Guestbook {
    uint256 public guestCount;
    uint256 private seed;

    event NewGuest(address indexed from, uint256 timestamp, string message);

    struct Guest {
        address wallet;
        uint timestamp;
        string message;
    }

    Guest[] guestbook;

    mapping(address => uint256) public lastSignedAt;

    constructor() payable {
        console.log("The Guestbook contract has been constructed.");
        // generate a random number
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function sign(string memory _message) public {
        require(
            lastSignedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        lastSignedAt[msg.sender] = block.timestamp;

        guestCount += 1;
        console.log("%s says '%s'", msg.sender, _message);

        guestbook.push(Guest(msg.sender, block.timestamp, _message));
        // Generate a new seed for the next user that signs the gb
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random number generated: %d", seed);
        // Give a 50% chance that the user wins the prize.
        if (seed < 16) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewGuest(msg.sender, block.timestamp, _message);
    }

    function getGuestbook() public view returns (Guest[] memory) {
        return guestbook;
    }

    function getGuestCount() public view returns (uint256) {
        return guestCount;
    }
}