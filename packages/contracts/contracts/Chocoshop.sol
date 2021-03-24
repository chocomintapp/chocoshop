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
        uint256 updatedAt;
    }

    Sale[] private _salesMemory;
    mapping(bytes32 => bool) private _salesExists;
    mapping(bytes32 => uint256) private _salesIndex;

    function getSales() public view returns (Sale[] memory) {
        return _salesMemory;
    }

    function getSale(bytes32 _key) public view returns (Sale memory) {
        uint256 index = _salesIndex[_key];
        return _salesMemory[index];
    }

    function getSaleKey(address _nftContractAddress, uint256 _tokenId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_nftContractAddress, _tokenId));
    }

    function purchase(address _nftContractAddress, uint256 _tokenId) public payable {
        bytes32 saleKey = getSaleKey(_nftContractAddress, _tokenId);
        require(_salesExists[saleKey], "not on sale");
        Sale memory sale = getSale(saleKey);
        require(msg.value == sale.price, "invalid msg value");
        _removeFromSaleList(saleKey);
        IERC721(_nftContractAddress).transferFrom(address(this), msg.sender, _tokenId);
        sale.from.transfer(sale.price);
    }

    function update(
        address _nftContractAddress,
        uint256 _tokenId,
        uint256 _price
    ) public {
        bytes32 saleKey = getSaleKey(_nftContractAddress, _tokenId);
        require(_salesExists[saleKey], "not on sale");
        Sale memory sale = getSale(saleKey);
        require(sale.from == msg.sender, "invalid msg sender");
        sale.price = _price;
        sale.updatedAt = block.timestamp;
        _salesMemory[_salesIndex[saleKey]] = sale;
    }

    function cancel(address _nftContractAddress, uint256 _tokenId) public {
        bytes32 saleKey = getSaleKey(_nftContractAddress, _tokenId);
        require(_salesExists[saleKey], "not on sale");
        uint256 index = _salesIndex[saleKey];
        Sale memory sale = _salesMemory[index];
        require(sale.from == msg.sender, "invalid msg sender");
        IERC721(_nftContractAddress).transferFrom(address(this), sale.from, _tokenId);
        _removeFromSaleList(saleKey);
    }

    function onERC721Received(
        address,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) public override returns (bytes4) {
        address nftContractAddress = msg.sender;
        bytes32 saleKey = getSaleKey(nftContractAddress, _tokenId);
        require(!_salesExists[saleKey], "already on sale");
        require(IERC721(nftContractAddress).ownerOf(_tokenId) == address(this), "nft is not transferred");
        uint256 price = abi.decode(_data, (uint256));
        Sale memory sale = Sale(nftContractAddress, payable(_from), _tokenId, price, block.timestamp);
        _addToSaleList(saleKey, sale);
        return type(IERC721Receiver).interfaceId;
    }

    function _addToSaleList(bytes32 _key, Sale memory _sale) internal {
        uint256 allShopLength = _salesMemory.length;
        _salesIndex[_key] = allShopLength;
        _salesMemory.push(_sale);
        _salesExists[_key] = true;
    }

    function _removeFromSaleList(bytes32 _key) internal {
        uint256 lastSalesIndex = _salesMemory.length - 1;
        uint256 removingSalesIndex = _salesIndex[_key];
        Sale memory lastSale = _salesMemory[lastSalesIndex];
        _salesMemory[removingSalesIndex] = lastSale;
        delete _salesIndex[_key];
        _salesExists[_key] = false;
        _salesMemory.pop();
    }
}
