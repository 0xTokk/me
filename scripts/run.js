const main = async () => {
  /* Compile the contract and generate the necessary files we need to work 
     with the contract under the `artifacts` directory.*/
  const guestbookContractFactory = await hre.ethers.getContractFactory("Guestbook");
  // Wait until our contract is officially deployed to our local blockchain.
  const guestbookContract = await guestbookContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await guestbookContract.deployed();
  console.log("Contract address:", guestbookContract.address);
  // Get contract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    guestbookContract.address
  );
  console.log(
    "Contract balance:", 
    hre.ethers.utils.formatEther(contractBalance)
  );
  // test sign function
  const signTxn1 = await guestbookContract.sign('Hello');
  await signTxn1.wait();

  const signTxn2 = await guestbookContract.sign('Hola');
  await signTxn2.wait();
  // check balance to make sure it is deducted
  contractBalance = await hre.ethers.provider.getBalance(guestbookContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  // test getGuestCount function
  const guestCount = await guestbookContract.getGuestCount();
  console.log(guestCount.toNumber());
  // test getGuestbook function
  const guestbook = await guestbookContract.getGuestbook();
  console.log('guestbook', guestbook);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();