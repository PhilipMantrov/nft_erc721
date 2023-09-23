pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721, ERC721URIStorage, Ownable {


    event CollectionCreated(address indexed collection, string name, string symbol);
    event TokenMinted(address indexed collection, address indexed recipient, uint256 tokenId, string tokenUri);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        name = name;
        symbol = symbol;
        emit CollectionCreated(address(this), name, symbol);
    }

    function safeMint(address recipient, uint256 tokenId, string memory uri) public onlyOwner
    {
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);
        emit TokenMinted(address(this), recipient, tokenId, uri);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
