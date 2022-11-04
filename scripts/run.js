const main = async () => {
  /* Compile the contract and generate the necessary files we need to work 
     with the contract under the `artifacts` directory.*/
  const guestbookContractFactory = await hre.ethers.getContractFactory("Guestbook");
  // Wait until our contract is officially deployed to our local blockchain.
  const guestbookContract = await guestbookContractFactory.deploy();
  await guestbookContract.deployed();

  let guestCount;
  guestCount = await guestbookContract.getGuestCount();
  console.log(guestCount.toNumber());
  
  // test functionality of the contract
  let signTxn = await guestbookContract.sign('Hello');
  await signTxn.wait(); // Wait for the transaction to be mined

  const [_, randomPerson] = await hre.ethers.getSigners();
  signTxn = await guestbookContract.connect(randomPerson).sign('Hola');
  await signTxn.wait(); // Wait for the transaction to be mined

  guestCount = await guestbookContract.getGuestCount();
  console.log(guestCount.toNumber());

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