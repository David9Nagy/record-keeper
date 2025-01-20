// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract NewsVerification is Ownable, Pausable {
    struct Article {
        bytes32 contentHash;
        string title;
        uint256 timestamp;
        string ipfsHash;
        bool isDeleted;
        address submitter;
    }

    mapping(bytes32 => Article) public articles;
    mapping(bytes32 => bytes32[]) public articleHistory;
    
    event ArticleAdded(bytes32 indexed articleId, string title, uint256 timestamp);
    event ArticleUpdated(bytes32 indexed articleId, bytes32 newHash);
    event ArticleDeleted(bytes32 indexed articleId);

    constructor() {
        // Constructor logic if needed
    }

    function addArticle(
        bytes32 _articleId,
        bytes32 _contentHash,
        string memory _title,
        string memory _ipfsHash
    ) external whenNotPaused {
        require(articles[_articleId].timestamp == 0, "Article already exists");
        
        articles[_articleId] = Article({
            contentHash: _contentHash,
            title: _title,
            timestamp: block.timestamp,
            ipfsHash: _ipfsHash,
            isDeleted: false,
            submitter: msg.sender
        });

        emit ArticleAdded(_articleId, _title, block.timestamp);
    }

    function updateArticle(
        bytes32 _articleId,
        bytes32 _newContentHash,
        string memory _newIpfsHash
    ) external whenNotPaused {
        require(articles[_articleId].timestamp != 0, "Article does not exist");
        
        // Store the old hash in history
        articleHistory[_articleId].push(articles[_articleId].contentHash);
        
        // Update with new hash
        articles[_articleId].contentHash = _newContentHash;
        articles[_articleId].ipfsHash = _newIpfsHash;
        
        emit ArticleUpdated(_articleId, _newContentHash);
    }

    function markArticleAsDeleted(bytes32 _articleId) external whenNotPaused {
        require(articles[_articleId].timestamp != 0, "Article does not exist");
        articles[_articleId].isDeleted = true;
        emit ArticleDeleted(_articleId);
    }

    function getArticle(bytes32 _articleId) external view returns (
        bytes32 contentHash,
        string memory title,
        uint256 timestamp,
        string memory ipfsHash,
        bool isDeleted,
        address submitter
    ) {
        Article memory article = articles[_articleId];
        return (
            article.contentHash,
            article.title,
            article.timestamp,
            article.ipfsHash,
            article.isDeleted,
            article.submitter
        );
    }

    function getArticleHistory(bytes32 _articleId) external view returns (bytes32[] memory) {
        return articleHistory[_articleId];
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}