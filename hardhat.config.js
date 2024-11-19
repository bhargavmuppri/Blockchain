require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.0",
  networks: {
    development: {
      url: "http://127.0.0.1:7545",
      accounts: ["0x37943d23e66a67ef7238d119276088b27285fde579d4511a6d2f8203ce91dc2e"]
    }
  }
};
