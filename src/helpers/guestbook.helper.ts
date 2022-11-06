import { ethers } from "ethers";
import abi from "./guestbook.abi.json";
import {GUESTBOOK_CONTRACT_ADDRESS} from '../constants'

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

export {getContract}