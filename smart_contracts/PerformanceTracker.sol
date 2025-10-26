// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PerformanceTracker {
    // Structure to hold performance metrics
    struct PerformanceRecord {
        uint256 netPnl; // Net Profit and Loss
        uint256 tvl;    // Total Value Locked
        uint256 timestamp;
        address manager;
    }

    // Array to store all performance records
    PerformanceRecord[] public performanceHistory;

    // Mapping to track authorized manager wallets
    mapping(address => bool) public isManager;

    // Owner of the contract
    address public owner;

    // Events for transparent logging
    event PerformanceRecorded(
        address indexed manager,
        uint256 netPnl,
        uint256 tvl,
        uint256 timestamp
    );

    event ManagerAdded(address indexed manager);

    // Modifier to restrict access to managers
    modifier onlyManager() {
        require(isManager[msg.sender], "Only authorized managers can record performance");
        _;
    }

    // Modifier to restrict access to owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can add managers");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Adds a new manager wallet that can record performance metrics.
     * @param _manager The address of the manager to authorize.
     */
    function addManager(address _manager) public onlyOwner {
        isManager[_manager] = true;
        emit ManagerAdded(_manager);
    }

    /**
     * @dev Records performance metrics. Only callable by authorized managers.
     * @param _netPnl The net profit and loss value.
     * @param _tvl The total value locked.
     */
    function recordPerformance(uint256 _netPnl, uint256 _tvl) public onlyManager {
        performanceHistory.push(PerformanceRecord({
            netPnl: _netPnl,
            tvl: _tvl,
            timestamp: block.timestamp,
            manager: msg.sender
        }));

        emit PerformanceRecorded(msg.sender, _netPnl, _tvl, block.timestamp);
    }

    /**
     * @dev Returns the total number of performance records.
     */
    function getTotalRecords() public view returns (uint256) {
        return performanceHistory.length;
    }

    /**
     * @dev Returns a specific performance record by index.
     * @param _index The index of the record to retrieve.
     */
    function getRecord(uint256 _index) public view returns (PerformanceRecord memory) {
        require(_index < performanceHistory.length, "Index out of bounds");
        return performanceHistory[_index];
    }
}
