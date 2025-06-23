const hre = require("hardhat");

async function main() {
  const CaseManager = await hre.ethers.getContractFactory("CaseManager");
  const contract = await CaseManager.deploy();
  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
