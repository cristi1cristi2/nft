const Color = artifacts.require("Color");
const CristiToken = artifacts.require("CristiToken");
const EduChain = artifacts.require("EduChain");

module.exports = function(deployer) {
  deployer.deploy(CristiToken, 1000000);
  deployer.deploy(Color);
  deployer.deploy(EduChain, "v0.1");
};
