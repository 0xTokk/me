import { ethers } from "ethers";
import abi from "./guestbook.json";
import {GUESTBOOK_CONTRACT_ADDRESS} from '../constants'

export const contractABI = abi.abi;

function getContract() {
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

      return guestbookContract

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
} 

async function signGuestbook(message: string) {
  try {
    const guestbookContract = await getContract();

    if (guestbookContract) {
      let count = await guestbookContract.getGuestCount();
      console.log("Retrieved total guest count...", count.toNumber());

      // actually write to the blockchain
      const signTxn = await guestbookContract.sign(message);
      console.log("Mining...", signTxn.hash);

      await signTxn.wait();
      console.log("Mined -- ", signTxn.hash);

      count = await guestbookContract.getGuestCount();
      console.log("Retrieved total guest count...", count.toNumber());

    } else {
      console.log('guestbookContract not found')
    }
  } catch (error) {
    console.log(error);
  }
}

async function getGuestbook() {
  try {
    const guestbookContract = getContract();

    if (guestbookContract) {
      let guests = await guestbookContract.getGuests();
      console.log("Retrieved guests...", guests);
      return guests;
      
    } else {
      console.log('guestbookContract not found')
    }
  } catch (error) {
    console.log(error);
  }
}

export {signGuestbook, getGuestbook}