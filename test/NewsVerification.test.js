const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes } = ethers;

describe("NewsVerification", function () {
  let NewsVerification;
  let newsVerification;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    NewsVerification = await ethers.getContractFactory("NewsVerification");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    newsVerification = await NewsVerification.deploy();
  });

  describe("Article Management", function () {
    it("Should add a new article", async function () {
      const articleContent = "Test article content";
      const articleTitle = "Test Title";
      const ipfsHash = "QmTest123";
      
      // Create article ID and content hash using imported utilities
      const articleId = keccak256(toUtf8Bytes(articleContent + articleTitle));
      const contentHash = keccak256(toUtf8Bytes(articleContent));

      await newsVerification.addArticle(articleId, contentHash, articleTitle, ipfsHash);

      const article = await newsVerification.getArticle(articleId);
      expect(article.contentHash).to.equal(contentHash);
      expect(article.title).to.equal(articleTitle);
      expect(article.ipfsHash).to.equal(ipfsHash);
      expect(article.isDeleted).to.equal(false);
    });

    it("Should not allow adding duplicate articles", async function () {
      const articleContent = "Test article content";
      const articleTitle = "Test Title";
      const ipfsHash = "QmTest123";
      
      const articleId = keccak256(toUtf8Bytes(articleContent + articleTitle));
      const contentHash = keccak256(toUtf8Bytes(articleContent));

      await newsVerification.addArticle(articleId, contentHash, articleTitle, ipfsHash);

      await expect(
        newsVerification.addArticle(articleId, contentHash, articleTitle, ipfsHash)
      ).to.be.revertedWith("Article already exists");
    });

    it("Should update an existing article", async function () {
      const articleContent = "Test article content";
      const articleTitle = "Test Title";
      const ipfsHash = "QmTest123";
      
      const articleId = keccak256(toUtf8Bytes(articleContent + articleTitle));
      const contentHash = keccak256(toUtf8Bytes(articleContent));

      await newsVerification.addArticle(articleId, contentHash, articleTitle, ipfsHash);

      const newContent = "Updated content";
      const newContentHash = keccak256(toUtf8Bytes(newContent));
      const newIpfsHash = "QmTest456";

      await newsVerification.updateArticle(articleId, newContentHash, newIpfsHash);

      const article = await newsVerification.getArticle(articleId);
      expect(article.contentHash).to.equal(newContentHash);
      expect(article.ipfsHash).to.equal(newIpfsHash);
    });

    it("Should mark article as deleted", async function () {
      const articleContent = "Test article content";
      const articleTitle = "Test Title";
      const ipfsHash = "QmTest123";
      
      const articleId = keccak256(toUtf8Bytes(articleContent + articleTitle));
      const contentHash = keccak256(toUtf8Bytes(articleContent));

      await newsVerification.addArticle(articleId, contentHash, articleTitle, ipfsHash);
      await newsVerification.markArticleAsDeleted(articleId);

      const article = await newsVerification.getArticle(articleId);
      expect(article.isDeleted).to.equal(true);
    });

    it("Should maintain article history", async function () {
      const articleContent = "Test article content";
      const articleTitle = "Test Title";
      const ipfsHash = "QmTest123";
      
      const articleId = keccak256(toUtf8Bytes(articleContent + articleTitle));
      const contentHash = keccak256(toUtf8Bytes(articleContent));

      await newsVerification.addArticle(articleId, contentHash, articleTitle, ipfsHash);

      const newContent = "Updated content";
      const newContentHash = keccak256(toUtf8Bytes(newContent));
      const newIpfsHash = "QmTest456";

      await newsVerification.updateArticle(articleId, newContentHash, newIpfsHash);

      const history = await newsVerification.getArticleHistory(articleId);
      expect(history.length).to.equal(1);
      expect(history[0]).to.equal(contentHash);
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to pause and unpause", async function () {
      await newsVerification.pause();
      expect(await newsVerification.paused()).to.equal(true);

      await newsVerification.unpause();
      expect(await newsVerification.paused()).to.equal(false);
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(
        newsVerification.connect(addr1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});