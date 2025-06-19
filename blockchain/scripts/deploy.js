const hre = require("hardhat");

async function main() {
  const EvidenceManager = await hre.ethers.getContractFactory("EvidenceManager");
  const contract = await EvidenceManager.deploy();
  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
