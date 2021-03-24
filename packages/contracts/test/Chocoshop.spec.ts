import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { deployChocoshop } from "../helpers/migrations";
import { MockNft } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("Letters", function () {
  let seller, buyer;
  let shopContract, mockNftContract;

  const firstTokenId = 0;

  this.beforeEach("initialization.", async function () {
    [seller, buyer] = await ethers.getSigners();
    shopContract = await deployChocoshop();
    const MockNftContract = await ethers.getContractFactory("MockNft");
    mockNftContract = (await MockNftContract.deploy()) as MockNft;
  });

  it.skip("interface check", async function () {
    console.log("TBD");
  });

  it("getSales", async function () {
    const value = "10000";
    await mockNftContract.connect(seller).mint(seller.address);
    await mockNftContract
      .connect(seller)
      ["safeTransferFrom(address,address,uint256,bytes)"](
        seller.address,
        shopContract.address,
        firstTokenId,
        ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
      );
    const result = await shopContract.getSales(mockNftContract.address);
    const { from, tokenId, price } = result[0];
    expect(from).to.equal(seller.address);
    expect(tokenId.toString()).to.equal(firstTokenId.toString());
    expect(price.toString()).to.equal(value);
  });

  it("purchase", async function () {
    const value = "10000";
    await mockNftContract.connect(seller).mint(seller.address);
    await mockNftContract
      .connect(seller)
      ["safeTransferFrom(address,address,uint256,bytes)"](
        seller.address,
        shopContract.address,
        firstTokenId,
        ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
      );
    await shopContract.connect(buyer).purchase(mockNftContract.address, firstTokenId, { value });
    expect(await mockNftContract.ownerOf(firstTokenId)).to.equal(buyer.address);
  });

  it("cancel", async function () {
    const value = "10000";
    await mockNftContract.connect(seller).mint(seller.address);
    await mockNftContract
      .connect(seller)
      ["safeTransferFrom(address,address,uint256,bytes)"](
        seller.address,
        shopContract.address,
        firstTokenId,
        ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
      );
    await shopContract.connect(seller).cancel(mockNftContract.address, firstTokenId);
    expect(await mockNftContract.ownerOf(firstTokenId)).to.equal(seller.address);
  });

  it("purchase: not on sale", async function () {
    const value = "10000";
    await mockNftContract.connect(seller).mint(seller.address);
    await mockNftContract
      .connect(seller)
      ["safeTransferFrom(address,address,uint256,bytes)"](
        seller.address,
        shopContract.address,
        firstTokenId,
        ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
      );
    await shopContract.connect(buyer).purchase(mockNftContract.address, firstTokenId, { value });
    expect(await mockNftContract.ownerOf(firstTokenId)).to.equal(buyer.address);

    await expect(
      shopContract.connect(buyer).purchase(mockNftContract.address, firstTokenId, { value })
    ).to.revertedWith("not on sale");
  });

  it("purchase: invalid msg value", async function () {
    const value = "10000";

    await mockNftContract.connect(seller).mint(seller.address);
    await mockNftContract
      .connect(seller)
      ["safeTransferFrom(address,address,uint256,bytes)"](
        seller.address,
        shopContract.address,
        firstTokenId,
        ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
      );
    await expect(shopContract.connect(buyer).purchase(mockNftContract.address, firstTokenId)).to.revertedWith(
      "invalid msg value"
    );
  });

  it("cancel: not on sale", async function () {
    const value = "10000";
    await mockNftContract.connect(seller).mint(seller.address);
    await mockNftContract
      .connect(seller)
      ["safeTransferFrom(address,address,uint256,bytes)"](
        seller.address,
        shopContract.address,
        firstTokenId,
        ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
      );
    await shopContract.connect(seller).cancel(mockNftContract.address, firstTokenId);

    await expect(shopContract.connect(seller).cancel(mockNftContract.address, firstTokenId)).to.revertedWith(
      "not on sale"
    );
  });

  it("cancel: invalid msg sender", async function () {
    const value = "10000";
    await mockNftContract.connect(seller).mint(seller.address);
    await mockNftContract
      .connect(seller)
      ["safeTransferFrom(address,address,uint256,bytes)"](
        seller.address,
        shopContract.address,
        firstTokenId,
        ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
      );
    await expect(shopContract.connect(buyer).cancel(mockNftContract.address, firstTokenId)).to.revertedWith(
      "invalid msg sender"
    );
  });
});
