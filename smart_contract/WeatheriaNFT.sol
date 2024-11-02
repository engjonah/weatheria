// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WeatheriaNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping to store metadata URI for each token
    mapping(uint256 => string) private _tokenURIs;

    // Event to log NFT minting with metadata URI
    event MintedWithURI(address indexed minter, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("WeatheriaNFT", "WNFT") Ownable(msg.sender) {}

    /**
     * @dev Mints a new NFT with the given metadata URI.
     * @param to Address to receive the minted NFT.
     * @param uri Metadata URI for the generated image.
     */
    function mintNFT(address to, string memory uri) public onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit MintedWithURI(to, tokenId, uri);
        return tokenId;
    }

    /**
     * @dev Returns the metadata URI for a given tokenId.
     * @param tokenId ID of the token.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Internal function to set the token URI for a given token.
     * @param tokenId ID of the token.
     * @param uri Metadata URI to assign.
     */
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = uri;
    }
}
