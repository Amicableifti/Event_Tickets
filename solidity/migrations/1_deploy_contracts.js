const EventContract = artifacts.require("EventContract");

module.exports = async function (deployer, network, accounts) {
  try {
    await deployer.deploy(EventContract);
    const deployedContract = await EventContract.deployed()
    console.log(deployedContract);
  } catch (err) {
    console.log(err);
  }
};
