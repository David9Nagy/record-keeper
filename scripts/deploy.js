const hre = require("hardhat");

async function main() {
  console.log("Deploying NewsVerification contract...");

  // Deploy the contract
  const NewsVerification = await hre.ethers.getContractFactory("NewsVerification");
  const newsVerification = await NewsVerification.deploy();
  await newsVerification.waitForDeployment();

  console.log("NewsVerification deployed to:", await newsVerification.getAddress());

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await newsVerification.deploymentTransaction().wait(6);

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...");
  await hre.run("verify:verify", {
    address: await newsVerification.getAddress(),
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });