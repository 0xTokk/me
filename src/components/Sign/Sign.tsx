import { createSignal, createEffect, onCleanup } from 'solid-js';
import { ethers } from "ethers";
import abi from "../../utils/Guestbook.json";

declare global {
  interface Window {
    ethereum: any
  }
}

const getEthereumObject = () => window.ethereum;
/*
 * findMetaMaskAccount returns the first linked account found.
 * If there is no account linked, it will return null.
 */
async function findMetaMaskAccount() {
  try {
    const ethereum = getEthereumObject();
    // First make sure we have access to the Ethereum object.
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
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
	const [currentAccount, setCurrentAccount] = createSignal();

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

	async function signGuestbook(message: string) {
		const contractAddress = "0x53108575ba608C2EaedB93Ea3e42406cf506A21E"
		const contractABI = abi.abi;

		try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const guestbookContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await guestbookContract.getGuestCount();
        console.log("Retrieved total guest count...", count.toNumber());
        /*
        * Execute the actual sign from your smart contract
        */
        const signTxn = await guestbookContract.sign(message);
        console.log("Mining...", signTxn.hash);

        await signTxn.wait();
        console.log("Mined -- ", signTxn.hash);

        count = await guestbookContract.getGuestCount();
        console.log("Retrieved total guest count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
	}

	createEffect(async () => {
		const account = await findMetaMaskAccount();
		if (account !== null) {
			setCurrentAccount(account);
		}
	});

	return (
		<div>
			{currentAccount() ? 
				<button onClick={() => signGuestbook('hello')}>Sign guestbook</button>
				:
				<button onClick={connectWallet}>Connect wallet</button>
			}
		</div>
	);
}