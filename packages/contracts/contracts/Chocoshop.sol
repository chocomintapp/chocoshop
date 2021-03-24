// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./extentions/IHasSecondarySaleFees.sol";

import "hardhat/console.sol";

contract Chocoshop is IERC721Receiver {
    struct Sale {
        address nftContractAddress;
        address payable from;
        uint256 tokenId;
        uint256 price;
    }

    bytes32[] private _allSales;
    mapping(uint256 => uint256) private _allSalesIndex;
    mapping(address => mapping(uint256 => bytes32)) private _shopSales;
    mapping(uint256 => uint256) private _shopSalesIndex;

    mapping(bytes32 => Sale) public sales;

    function hashNft(address _nftContractAddress, uint256 _tokenId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_nftContractAddress, _tokenId));
    }

    function purchase(address _nftContractAddress, uint256 _tokenId) public payable {
        bytes32 hashedNft = hashNft(_nftContractAddress, _tokenId);
        Sale memory sale = sales[hashedNft];
        require(msg.value == sale.price, "invalid msg value");
        delete sales[hashedNft];
        IERC721(_nftContractAddress).transferFrom(address(this), msg.sender, _tokenId);
        sale.from.transfer(sale.price);
    }

    function onERC721Received(
        address,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) public override returns (bytes4) {
        //TODO: validation
        address nftContractAddress = msg.sender;
        bytes32 hashedNft = hashNft(nftContractAddress, _tokenId);
        uint256 price = abi.decode(_data, (uint256));
        Sale memory sale = Sale(nftContractAddress, payable(_from), _tokenId, price);
        sales[hashedNft] = sale;
        return type(IERC721Receiver).interfaceId;
    }
}
