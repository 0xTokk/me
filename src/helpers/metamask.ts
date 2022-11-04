// getAccount returns the first linked account found.
async function getAccount() {
  try {
    const {ethereum} = window;
    // First make sure we have access to the Ethereum object.
    if (!ethereum) {
      console.error("Make sure you have Metamask installed!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ 
      method: "eth_accounts" 
    });

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
    const {ethereum} = window;

    if (!ethereum) {
      console.error("Make sure you have Metamask installed!");
      return null;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected", accounts[0]);
    return accounts[0];

  } catch (error) {
    console.error(error);
    return null;
  }
};

export {getAccount, connectWallet}