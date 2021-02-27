const Migrations = artifacts.require("./HTLC.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
