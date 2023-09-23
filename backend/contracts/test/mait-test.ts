import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTCollection__factory } from "../../typechain-types";
import { from } from "rxjs";

describe("NFTCollection", function() {
  let nftCollection: NFTCollection__factory;
  let contractAddress: string;
  from(ethers.getContractFactory("NFTCollection")).subscribe(contract => nftCollection = contract);


  it("Should deployed", async function() {
    const nft = await nftCollection.deploy("TestCollection", "TST");

    const tx = await nft.deploymentTransaction();
    const confirmedTx = await tx.wait(8);
    contractAddress = await nft.getAddress();


    expect(confirmedTx).to.be.an("object");
    expect(confirmedTx.hash).to.be.an("string");
  });

  it("Should Minted", async function() {
    const nft = await ethers.getContractAt("NFTCollection", contractAddress);
    const tx = await nft.safeMint("0xa9bb29CeAba32302BCC9Cb33d6CF2d368Fd0211a", "1", "https://i.pinimg.com/564x/ca/ce/1d/cace1d24d16101782878da47bc4632bb.jpg");
    const confirmedTx = await tx.wait(8);


    expect(confirmedTx).to.be.an("object");
    expect(confirmedTx.hash).to.be.an("string");
  });
});
