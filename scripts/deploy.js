import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("Deploying TradeLogger contract...");

  const TradeLogger = await ethers.getContractFactory("TradeLogger");
  const tradeLogger = await TradeLogger.deploy();

  await tradeLogger.waitForDeployment();

  console.log("TradeLogger deployed to:", await tradeLogger.getAddress());

  // Test a trade
  console.log("Logging a test trade...");
  const tx = await tradeLogger.logTrade("ETH", 100, 2000, true);
  await tx.wait();
  console.log("Trade logged successfully");

  const totalTrades = await tradeLogger.getTotalTrades();
  console.log("Total trades:", totalTrades.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
