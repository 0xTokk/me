import { createSignal, createEffect } from 'solid-js';
import { ethers } from "ethers";
import {contractABI} from "../../helpers/guestbook";
import {GUESTBOOK_CONTRACT_ADDRESS} from '../../constants'
import type {Guest} from "../../types"

const getEthereumObject = () => window.ethereum;
// findMetaMaskAccount returns the first linked account found.
async function findMetaMaskAccount() {
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

export default function Sign() {
	const [currentAccount, setCurrentAccount] = createSignal<string | null>();
  const [guests, setGuests] = createSignal<Guest[] | null>();

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
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

function getGuestbookContract() {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const guestbookContract = new ethers.Contract(GUESTBOOK_CONTRACT_ADDRESS, contractABI, signer);

        return guestbookContract
 
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  } 

	async function signGuestbook(event: Event) {

    event.preventDefault();
    //@ts-ignore
    const message = (event.currentTarget as HTMLFormElement).elements.message.value;
  
		try {
      const guestbookContract = getGuestbookContract();

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

        const guests = await getGuests();
        setGuests(guests);

      } else {
        console.log('guestbookContract not found')
      }
    } catch (error) {
      console.log(error);
    }
	}

  async function getGuests() {
    
    try {
      const guestbookContract = getGuestbookContract();

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

	createEffect(async () => {
		const account = await findMetaMaskAccount();
    const guests = await getGuests();

		if (account !== null) setCurrentAccount(account);
    if (guests !== null) setGuests(guests);
	});

	return (
		<div>
			{currentAccount() 
				?
        <form onSubmit={signGuestbook}>
          <label for="message">Message: </label>
          <input type='text' placeholder="Leave a message" id="message" name="message" />
          <button type="submit">Sign guestbook</button>
        </form>
				:
				<button onClick={() => connectWallet()}>Connect wallet</button>
			}
      {guests()?.map(guest => 
        <p>{guest.wallet.slice(0,4)}...{guest.wallet.slice(-4)} says "{guest.message}"</p>
      )}
		</div>
	);
}