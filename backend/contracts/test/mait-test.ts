import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("NFTCollection", function () {
  it("Should set the right unlockTime", async function () {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // deploy a lock contract where funds can be withdrawn
    // one year in the future
    const nftCollection = await ethers.deployContract("NFTCollection", [unlockTime], {
      value: lockedAmount,
    });

    // assert that the value is correct
    expect(await nftCollection.unlockTime()).to.equal(unlockTime);
  });
});
