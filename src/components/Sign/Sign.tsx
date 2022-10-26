import { createSignal, createEffect, onCleanup } from 'solid-js';

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

createEffect(async () => {
	const account = await findMetaMaskAccount();
	if (account !== null) {
		setCurrentAccount(account);
	}

  onCleanup (() => {
   console.log('🧹 cleaned up!')
  });
});

	return (
		<div>
			{!currentAccount() && <button onClick={connectWallet}>Sign</button>}
		</div>
	);
}