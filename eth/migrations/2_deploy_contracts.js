var W3Certs = artifacts.require("./W3Certs.sol");

module.exports = function(deployer) {
  deployer.deploy(W3Certs, "Monsters' University");
};
