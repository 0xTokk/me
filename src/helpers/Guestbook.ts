import { ethers } from "ethers";
import abi from "./guestbook.json";
import {GUESTBOOK_CONTRACT_ADDRESS} from '../constants'
import type {Guest} from '../types'

export const contractABI = abi.abi;

function getContract(): ethers.Contract | null {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const guestbookContract = new ethers.Contract(
        GUESTBOOK_CONTRACT_ADDRESS, 
        contractABI, 
        signer
      );

      return guestbookContract;

    } else {
      console.log("Ethereum object doesn't exist!");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function signGuestbook(message: string): Promise<void> {
  try {
    const guestbookContract = await getContract();

    if (guestbookContract) {
      let count = await guestbookContract.getGuestCount();
      console.log("signGuestbook: Guest count...", count.toNumber());

      // actually write to the blockchain
      const signTxn = await guestbookContract.sign(message);
      console.log("Mining...", signTxn.hash);

      await signTxn.wait();
      console.log("Mined -- ", signTxn.hash);

      count = await guestbookContract.getGuestCount();
      console.log("signGuestbook: Guest count...", count.toNumber());

    } else {
      console.log('guestbookContract not found');
    }
  } catch (error) {
    console.log(error);
  }
}

async function getGuestbook(): Promise<Guest[]| null> {
  try {
    const guestbookContract = getContract();

    if (guestbookContract) {
      let guests = await guestbookContract.getGuestbook();
      console.log("getGuestbook: Retrieved guests...", guests);

      if (!guests.length) {
        return guests;
      }

      return guests.map((guest: Guest) => ({
          wallet: guest.wallet,
          timestamp: new Date(Number(guest.timestamp) * 1000).toDateString(),
          message: guest.message
      }));

    } else {
      console.log('guestbookContract not found');
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export {signGuestbook, getGuestbook}