import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("TradeLogger", function () {
  let TradeLogger;
  let tradeLogger;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    TradeLogger = await ethers.getContractFactory("TradeLogger");
    tradeLogger = await TradeLogger.deploy();
    await tradeLogger.waitForDeployment();
  });

  it("Should log a buy trade", async function () {
    await tradeLogger.logTrade("ETH", 100, 2000, true);
    const totalTrades = await tradeLogger.getTotalTrades();
    expect(totalTrades).to.equal(1);
  });

  it("Should log a sell trade and calculate P/L", async function () {
    // Buy 100 ETH at $2000
    await tradeLogger.logTrade("ETH", 100, 2000, true);
    // Sell 100 ETH at $2500
    await tradeLogger.logTrade("ETH", 100, 2500, false);

    const totalTrades = await tradeLogger.getTotalTrades();
    expect(totalTrades).to.equal(2);

    const totalPnL = await tradeLogger.getTotalPnLResults();
    expect(totalPnL).to.equal(1);
  });

  it("Should handle partial sell without P/L calculation", async function () {
    // Buy 100 ETH at $2000
    await tradeLogger.logTrade("ETH", 100, 2000, true);
    // Sell 50 ETH at $2500 (partial)
    await tradeLogger.logTrade("ETH", 50, 2500, false);

    const totalTrades = await tradeLogger.getTotalTrades();
    expect(totalTrades).to.equal(2);

    const totalPnL = await tradeLogger.getTotalPnLResults();
    expect(totalPnL).to.equal(0); // No full close, so no P/L
  });
});
