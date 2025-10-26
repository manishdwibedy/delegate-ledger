import pkg from 'hardhat';
const { ethers } = pkg;
import { expect } from "chai";

describe("PerformanceTracker", function () {
  let PerformanceTracker;
  let performanceTracker;
  let owner;
  let manager1;
  let manager2;
  let nonManager;

  beforeEach(async function () {
    [owner, manager1, manager2, nonManager] = await ethers.getSigners();

    PerformanceTracker = await ethers.getContractFactory("PerformanceTracker");
    performanceTracker = await PerformanceTracker.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await performanceTracker.owner()).to.equal(owner.address);
    });
  });

  describe("Adding Managers", function () {
    it("Should allow owner to add a manager", async function () {
      await performanceTracker.addManager(manager1.address);
      expect(await performanceTracker.isManager(manager1.address)).to.be.true;
    });

    it("Should emit ManagerAdded event when adding a manager", async function () {
      await expect(performanceTracker.addManager(manager1.address))
        .to.emit(performanceTracker, "ManagerAdded")
        .withArgs(manager1.address);
    });

    it("Should not allow non-owner to add a manager", async function () {
      await expect(
        performanceTracker.connect(manager1).addManager(manager2.address)
      ).to.be.revertedWith("Only owner can add managers");
    });
  });

  describe("Recording Performance", function () {
    beforeEach(async function () {
      await performanceTracker.addManager(manager1.address);
    });

    it("Should allow manager to record performance", async function () {
      const netPnl = 1000;
      const tvl = 50000;

      await expect(performanceTracker.connect(manager1).recordPerformance(netPnl, tvl))
        .to.emit(performanceTracker, "PerformanceRecorded")
        .withArgs(manager1.address, netPnl, tvl, await ethers.provider.getBlock("latest").then(b => b.timestamp));

      const totalRecords = await performanceTracker.getTotalRecords();
      expect(totalRecords).to.equal(1);

      const record = await performanceTracker.getRecord(0);
      expect(record.netPnl).to.equal(netPnl);
      expect(record.tvl).to.equal(tvl);
      expect(record.manager).to.equal(manager1.address);
    });

    it("Should not allow non-manager to record performance", async function () {
      await expect(
        performanceTracker.connect(nonManager).recordPerformance(1000, 50000)
      ).to.be.revertedWith("Only authorized managers can record performance");
    });
  });

  describe("Retrieving Records", function () {
    beforeEach(async function () {
      await performanceTracker.addManager(manager1.address);
      await performanceTracker.connect(manager1).recordPerformance(1000, 50000);
      await performanceTracker.connect(manager1).recordPerformance(2000, 60000);
    });

    it("Should return the correct total number of records", async function () {
      expect(await performanceTracker.getTotalRecords()).to.equal(2);
    });

    it("Should return the correct record by index", async function () {
      const record = await performanceTracker.getRecord(1);
      expect(record.netPnl).to.equal(2000);
      expect(record.tvl).to.equal(60000);
      expect(record.manager).to.equal(manager1.address);
    });

    it("Should revert if index is out of bounds", async function () {
      await expect(performanceTracker.getRecord(2)).to.be.revertedWith("Index out of bounds");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero values in performance recording", async function () {
      await performanceTracker.addManager(manager1.address);
      await performanceTracker.connect(manager1).recordPerformance(0, 0);

      const record = await performanceTracker.getRecord(0);
      expect(record.netPnl).to.equal(0);
      expect(record.tvl).to.equal(0);
    });

    it("Should allow multiple managers to record performance", async function () {
      await performanceTracker.addManager(manager1.address);
      await performanceTracker.addManager(manager2.address);

      await performanceTracker.connect(manager1).recordPerformance(1000, 50000);
      await performanceTracker.connect(manager2).recordPerformance(2000, 60000);

      expect(await performanceTracker.getTotalRecords()).to.equal(2);

      const record1 = await performanceTracker.getRecord(0);
      expect(record1.manager).to.equal(manager1.address);

      const record2 = await performanceTracker.getRecord(1);
      expect(record2.manager).to.equal(manager2.address);
    });
  });
});
