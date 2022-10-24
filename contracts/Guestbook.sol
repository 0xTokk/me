// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Guestbook {
    struct Guest {
        uint256 id;
        address wallet;
        string message;
        bool signed;
    }
    mapping (uint256 => Guest) public guestbook;
    event guestEvent(uint256 indexed _id); 
    uint256 public guestCount;

    constructor() {
        console.log("Welcome to the Guestbook.");
    }

    function sign(string memory _message) public {
        guestbook[guestCount] = Guest(
            guestCount, 
            msg.sender, 
            _message, 
            true
        );
        guestCount++;

        console.log("%s has signed the guestbook!", msg.sender);
    }

    function getGuestCount() public view returns (uint256) {
        console.log("We have %d total guests!", guestCount);
        return guestCount;
    }

    function getGuest(uint256 _id) public view returns (Guest memory) {
        return guestbook[_id];
    }

    function getGuests() public view returns (Guest[] memory) {
        Guest[] memory guests = new Guest[](guestCount);

        for (uint256 i = 0; i < guestCount; i++) {
            Guest storage guestbookEntry = guestbook[i];
            guests[i] = guestbookEntry;
        }

        return guests;
    }
}