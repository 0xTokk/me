import abi from "./guestbook.json";
import { ethers } from "ethers";
import {GUESTBOOK_CONTRACT_ADDRESS} from '../constants'

export const contractABI = abi.abi;

const getEthereumObject = () => window.ethereum;

// findMetaMaskAccount returns the first linked account found.
async function getMetaMaskAccount() {
  try {
    const ethereum = getEthereumObject();
    // First make sure we have access to the Ethereum object.
    if (!ethereum) {
      console.error("Make sure you have Metamask installed!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;

    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

async function connectWallet() {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      alert("You need to install MetaMask!");
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected", accounts[0]);
    return accounts[0];

  } catch (error) {
    console.error(error);
  }
};

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
    const guestbookContract = getContract();

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

async function getGuestsList() {

  try {
    const guestbookContract = getContract();

    if (guestbookContract) {
      let guests = await guestbookContract.getGuests();
      console.log("Retrieved guests...", {guests});
      return guests;
      
    } else {
      console.log('guestbookContract not found')
    }
  } catch (error) {
    console.log(error);
  }
}