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
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(address => Sale[]) _salesMemory;
    mapping(address => mapping(uint256 => uint256)) private _salesIndex;
    mapping(address => mapping(uint256 => bool)) private _salesExists;

    function getSales(address _nftContractAddress) public view returns (Sale[] memory) {
        return _salesMemory[_nftContractAddress];
    }

    function getSale(address _nftContractAddress, uint256 _tokenId) public view returns (Sale memory) {
        uint256 index = _salesIndex[_nftContractAddress][_tokenId];
        return _salesMemory[_nftContractAddress][index];
    }

    function isExist(address _nftContractAddress, uint256 _tokenId) public view returns (bool) {
        return _salesExists[_nftContractAddress][_tokenId];
    }

    function purchase(address _nftContractAddress, uint256 _tokenId) public payable {
        require(isExist(_nftContractAddress, _tokenId), "not on sale");
        Sale memory sale = getSale(_nftContractAddress, _tokenId);
        require(msg.value == sale.price, "invalid msg value");
        _removeFromSaleList(_nftContractAddress, _tokenId);
        IERC721(_nftContractAddress).transferFrom(address(this), msg.sender, _tokenId);
        sale.from.transfer(sale.price);
    }

    function cancel(address _nftContractAddress, uint256 _tokenId) public {
        require(isExist(_nftContractAddress, _tokenId), "not on sale");
        Sale memory sale = getSale(_nftContractAddress, _tokenId);
        require(sale.from == msg.sender, "invalid msg sender");
        IERC721(_nftContractAddress).transferFrom(address(this), sale.from, _tokenId);
        _removeFromSaleList(_nftContractAddress, _tokenId);
    }

    function onERC721Received(
        address,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) public override returns (bytes4) {
        address nftContractAddress = msg.sender;
        require(!isExist(nftContractAddress, _tokenId), "already on sale");
        require(IERC721(nftContractAddress).ownerOf(_tokenId) == address(this), "nft is not transferred");
        uint256 price = abi.decode(_data, (uint256));
        Sale memory sale = Sale(nftContractAddress, payable(_from), _tokenId, price, block.timestamp, block.timestamp);
        _addToSaleList(nftContractAddress, _tokenId, sale);
        return type(IERC721Receiver).interfaceId;
    }

    function _addToSaleList(
        address _nftContractAddress,
        uint256 _tokenId,
        Sale memory _sale
    ) internal {
        _salesIndex[_nftContractAddress][_tokenId] = _salesMemory[_nftContractAddress].length;
        _salesMemory[_nftContractAddress].push(_sale);
        _salesExists[_nftContractAddress][_tokenId] = true;
    }

    function _removeFromSaleList(address _nftContractAddress, uint256 _tokenId) internal {
        uint256 lastSalesIndex = _salesMemory[_nftContractAddress].length - 1;
        uint256 removingSalesIndex = _salesIndex[_nftContractAddress][_tokenId];
        Sale memory lastSale = _salesMemory[_nftContractAddress][lastSalesIndex];
        _salesMemory[_nftContractAddress][removingSalesIndex] = lastSale;
        delete _salesIndex[_nftContractAddress][_tokenId];
        _salesExists[_nftContractAddress][_tokenId] = false;
        _salesMemory[_nftContractAddress].pop();
    }
}
