const hre = require("hardhat");
const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes } = ethers;
const { utils } = ethers;

async function main() {
  // Get the contract instance
  const NewsVerification = await hre.ethers.getContractFactory("NewsVerification");
  const contract = await NewsVerification.attach("0x3e185e45A3aF55115ad01A9d7011feDe15040418"); // Replace with your actual deployed contract address

  // Example: Add an article
  const articleContent = "Test article content";
  const articleTitle = "Test Title";
  const ipfsHash = "QmTest123";
  
  const articleId = keccak256(toUtf8Bytes(articleContent + articleTitle));
  const contentHash = keccak256(toUtf8Bytes(articleContent));

  const tx = await contract.addArticle(articleId, contentHash, articleTitle, ipfsHash);
  await tx.wait();

  console.log("Article added successfully!");

  // Get the article details
  const article = await contract.getArticle(articleId);
  console.log("Article details:", article);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });