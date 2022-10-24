const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const guestbookContractFactory = await hre.ethers.getContractFactory("Guestbook");
  const guestbookContract = await guestbookContractFactory.deploy();
  await guestbookContract.deployed();

  console.log("Contract deployed to:", guestbookContract.address);
  console.log("Contract deployed by:", owner.address);

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