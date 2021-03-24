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

    bytes32[] private _saleList;
    mapping(bytes32 => uint256) private _saleListIndex;
    mapping(bytes32 => Sale) public sales;

    function getSaleKey(address _nftContractAddress, uint256 _tokenId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_nftContractAddress, _tokenId));
    }

    function purchase(address _nftContractAddress, uint256 _tokenId) public payable {
        bytes32 saleKey = getSaleKey(_nftContractAddress, _tokenId);
        Sale memory sale = sales[saleKey];
        require(msg.value == sale.price, "invalid msg value");
        _removeFromSaleList(saleKey);
        delete sales[saleKey];
        IERC721(_nftContractAddress).transferFrom(address(this), msg.sender, _tokenId);
        sale.from.transfer(sale.price);
    }

    function onERC721Received(
        address,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) public override returns (bytes4) {
        address nftContractAddress = msg.sender;
        bytes32 saleKey = getSaleKey(nftContractAddress, _tokenId);
        require(sales[saleKey].nftContractAddress == address(0x0), "already on sale");
        uint256 price = abi.decode(_data, (uint256));
        Sale memory sale = Sale(nftContractAddress, payable(_from), _tokenId, price);
        _addToSaleList(saleKey);
        sales[saleKey] = sale;
        return type(IERC721Receiver).interfaceId;
    }

    function _addToSaleList(bytes32 _saleKey) internal {
        uint256 allShopLength = _saleList.length;
        _saleListIndex[_saleKey] = allShopLength;
        _saleList.push(_saleKey);
    }

    function _removeFromSaleList(bytes32 _saleKey) internal {
        uint256 lastAllSalesIndex = _saleList.length - 1;
        uint256 allSalesIndex = _saleListIndex[_saleKey];
        bytes32 lastAllSaleKey = _saleList[lastAllSalesIndex];
        _saleList[allSalesIndex] = lastAllSaleKey;
        _saleList[lastAllSalesIndex] = _saleKey;
        delete _saleListIndex[lastAllSaleKey];
        _saleList.pop();
    }
}
