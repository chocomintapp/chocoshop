import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { deployChocoshop } from "../helpers/migrations";

chai.use(solidity);
const { expect } = chai;

describe("Letters", function () {
  let signer;
  let shopContract;

  this.beforeEach("initialization.", async function () {
    [signer] = await ethers.getSigners();
    shopContract = await deployChocoshop();
  });

  it("deploy check", async function () {
    console.log("TBD");
  });

  it("interface check", async function () {
    console.log("TBD");
  });

  it("mint", async function () {
    console.log("TBD");
  });
});
