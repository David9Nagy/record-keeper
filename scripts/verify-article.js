const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes } = ethers;

async function verifyArticle(contractAddress, articleContent, articleTitle) {
  const NewsVerification = await ethers.getContractFactory("NewsVerification");
  const contract = await NewsVerification.attach(contractAddress);

  const articleId = keccak256(toUtf8Bytes(articleContent + articleTitle));
  const article = await contract.getArticle(articleId);

  const calculatedHash = keccak256(toUtf8Bytes(articleContent));
  
  console.log("Article Details:");
  console.log("Title:", article.title);
  console.log("Stored Hash:", article.contentHash);
  console.log("Calculated Hash:", calculatedHash);
  console.log("Match:", article.contentHash === calculatedHash);
  console.log("Is Deleted:", article.isDeleted);
  
  return article.contentHash === calculatedHash;
}

// Example usage
async function main() {
  const contractAddress = "0x3e185e45A3aF55115ad01A9d7011feDe15040418";
  const articleContent = "Test article content";
  const articleTitle = "Test Title";

  await verifyArticle(contractAddress, articleContent, articleTitle);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });