require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: process.env.ETH_NODE_API_URL,
      accounts: [`0x${process.env.ETH_DEPLOY_PRIVATE_KEY}`]
    }
  }
};
