const main = async () => {
  // grab the address of the contract owner + a random address
  const [owner, randomPerson] = await hre.ethers.getSigners();
  /* Compile the contract and generate the necessary files we need to work 
     with the contract under the `artifacts` directory.*/
  const guestbookContractFactory = await hre.ethers.getContractFactory("Guestbook");
  // Wait until our contract is officially deployed to our local blockchain.
  const guestbookContract = await guestbookContractFactory.deploy();
  await guestbookContract.deployed();
  /* Once it's deployed `waveContract.address` will
     give us the address of the contract. */
  console.log("Contract deployed to:", guestbookContract.address);
  console.log("Contract deployed by:", owner.address);
  // test function calls in the contract
  await guestbookContract.getGuestCount();

  const firstSignTxn = await guestbookContract.sign('Hello');
  await firstSignTxn.wait();

  await guestbookContract.getGuestCount();

  const secondSignTxn = await guestbookContract.connect(randomPerson).sign('Hola');
  await secondSignTxn.wait();

  await guestbookContract.getGuestCount();
  const guestbook = await guestbookContract.getGuests();
  console.log({guestbook})
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