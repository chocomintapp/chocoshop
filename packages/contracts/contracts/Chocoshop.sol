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

    Sale[] private _salesMemory;
    mapping(bytes32 => uint256) private _salesIndex;

    function getSale(uint256 _index) public view returns (Sale memory) {
        return _salesMemory[_index];
    }

    function getSales() public view returns (Sale[] memory) {
        return _salesMemory;
    }

    function getSaleKey(address _nftContractAddress, uint256 _tokenId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_nftContractAddress, _tokenId));
    }

    function purchase(address _nftContractAddress, uint256 _tokenId) public payable {
        console.log("1");
        bytes32 saleKey = getSaleKey(_nftContractAddress, _tokenId);
        uint256 index = _salesIndex[saleKey];
        console.log("2");
        Sale memory sale = _salesMemory[index];
        require(msg.value == sale.price, "invalid msg value");
        console.log("3");
        _removeFromSaleList(saleKey);
        console.log("4");
        IERC721(_nftContractAddress).transferFrom(address(this), msg.sender, _tokenId);
        sale.from.transfer(sale.price);
    }

    function onERC721Received(
        address,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) public override returns (bytes4) {
        console.log("a");
        address nftContractAddress = msg.sender;
        bytes32 saleKey = getSaleKey(nftContractAddress, _tokenId);
        uint256 index = _salesIndex[saleKey];
        if (index > 0) {
            require(_salesMemory[index].nftContractAddress == address(0x0), "already on sale");
        }
        console.log("b-2");
        uint256 price = abi.decode(_data, (uint256));
        console.log("c");
        Sale memory sale = Sale(nftContractAddress, payable(_from), _tokenId, price);
        console.log("d");
        _addToSaleList(saleKey, sale);
        return type(IERC721Receiver).interfaceId;
    }

    function _addToSaleList(bytes32 _key, Sale memory _sale) internal {
        uint256 allShopLength = _salesMemory.length;
        _salesIndex[_key] = allShopLength;
        _salesMemory.push(_sale);
    }

    function _removeFromSaleList(bytes32 _key) internal {
        uint256 lastSalesIndex = _salesMemory.length - 1;
        uint256 removingSalesIndex = _salesIndex[_key];
        Sale memory lastSale = _salesMemory[lastSalesIndex];
        _salesMemory[removingSalesIndex] = lastSale;
        delete _salesIndex[_key];
        _salesMemory.pop();
    }
}
