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

  it("purchase", async function () {
    const value = "10000";
    await mockNftContract.mint(seller.address);
    await mockNftContract["safeTransferFrom(address,address,uint256,bytes)"](
      seller.address,
      shopContract.address,
      firstTokenId,
      ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
    );
    await shopContract.connect(buyer).purchase(mockNftContract.address, firstTokenId, { value });
    expect(await mockNftContract.ownerOf(firstTokenId)).to.equal(buyer.address);
  });
});
