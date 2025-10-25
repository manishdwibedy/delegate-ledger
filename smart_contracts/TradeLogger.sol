// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TradeLogger {
    // A structure to hold the details of a single trade.
    struct Trade {
        address user;
        string tokenSymbol;
        uint256 amount;
        uint256 price; // Price per token/coin at the time of trade (e.g., in USD or ETH)
        uint256 timestamp;
        bool isBuy; // true for a BUY, false for a SELL
    }

    // A structure to hold the P/L details for a completed trading pair.
    struct PnLResult {
        uint256 totalBuyCost;
        uint256 totalSellRevenue;
        int256 netProfitOrLoss; // Use int256 to allow negative values (loss)
        uint256 capitalDeployed; // Max capital committed for the completed buy/sell cycle
        uint256 buyTimestamp;
        uint256 sellTimestamp;
        uint256 buyAmount;
        uint256 sellAmount;
        string tokenSymbol;
    }

    // Array to store all logged trades.
    Trade[] public trades;

    // Mapping to store trade data specific to an address and token,
    // to track open positions for P/L calculation.
    // userAddress => tokenSymbol => { totalAmount, totalCost }
    mapping(address => mapping(string => uint256)) public openPositionsAmount;
    mapping(address => mapping(string => uint256)) public openPositionsCost;

    // Array to store all calculated P/L results.
    PnLResult[] public pnlHistory;

    // Events for transparent logging and off-chain monitoring.
    event TradeLogged(
        address indexed user,
        string indexed tokenSymbol,
        uint256 amount,
        uint256 price,
        bool isBuy,
        uint256 timestamp
    );

    event PnLCalculated(
        address indexed user,
        string indexed tokenSymbol,
        int256 netProfitOrLoss,
        uint256 capitalDeployed
    );

    /**
     * @dev Logs a trade to the blockchain and attempts to calculate P/L if a position is closed.
     * @param _tokenSymbol The symbol of the coin/token (e.g., "ETH").
     * @param _amount The quantity of the token traded.
     * @param _price The price per unit of the token (e.g., in USD or ETH).
     * @param _isBuy True if it's a BUY trade, False if it's a SELL trade.
     */
    function logTrade(
        string memory _tokenSymbol,
        uint256 _amount,
        uint256 _price,
        bool _isBuy
    ) public {
        // 1. Log trade
        trades.push(Trade({
            user: msg.sender,
            tokenSymbol: _tokenSymbol,
            amount: _amount,
            price: _price,
            timestamp: block.timestamp,
            isBuy: _isBuy
        }));

        emit TradeLogged(
            msg.sender,
            _tokenSymbol,
            _amount,
            _price,
            _isBuy,
            block.timestamp
        );

        // 2. Update open position or capture P/L
        uint256 tradeValue = _amount * _price;

        if (_isBuy) {
            // A. BUY: Increase open position
            openPositionsAmount[msg.sender][_tokenSymbol] += _amount;
            openPositionsCost[msg.sender][_tokenSymbol] += tradeValue;
        } else {
            // B. SELL: Check if a matching position exists and calculate P/L
            uint256 currentAmount = openPositionsAmount[msg.sender][_tokenSymbol];
            uint256 currentCost = openPositionsCost[msg.sender][_tokenSymbol];

            if (currentAmount > 0) {
                if (_amount >= currentAmount) {
                    // C. Position CLOSED or OVER-CLOSED
                    // Assume FIFO (First-In, First-Out) for simplicity and full P/L capture
                    
                    // Total cost of the bought tokens being closed
                    uint256 costBasis = currentCost;
                    
                    // Total revenue from selling the position.
                    // For a full close, this is the current sell trade value.
                    // If over-closed, the extra sell amount is not included in this simple P/L
                    // calculation, as it assumes we are closing the *existing* buy position.
                    // A proper margin or short-selling contract would handle the excess.
                    // For simplicity, we only capture P/L up to the amount of the buy position.
                    
                    uint256 totalSellRevenue = tradeValue;

                    // Net P/L calculation
                    int256 netProfitOrLoss = int256(totalSellRevenue) - int256(costBasis);

                    // Add P/L result to history
                    pnlHistory.push(PnLResult({
                        totalBuyCost: costBasis,
                        totalSellRevenue: totalSellRevenue,
                        netProfitOrLoss: netProfitOrLoss,
                        capitalDeployed: costBasis, // Capital is the cost to acquire
                        buyTimestamp: 0, // Simplified: actual timestamp needs deeper logic
                        sellTimestamp: block.timestamp,
                        buyAmount: currentAmount,
                        sellAmount: _amount,
                        tokenSymbol: _tokenSymbol
                    }));

                    emit PnLCalculated(
                        msg.sender,
                        _tokenSymbol,
                        netProfitOrLoss,
                        costBasis
                    );

                    // Reset open position for the token
                    openPositionsAmount[msg.sender][_tokenSymbol] = 0;
                    openPositionsCost[msg.sender][_tokenSymbol] = 0;

                } else {
                    // D. Position PARTIALLY CLOSED (Advanced logic omitted for simplicity)
                    // For a partial close, we'd need to calculate the proportional cost basis
                    // and update the remaining open position amount and cost.
                    // For this basic contract, we only calculate P/L on a *full* close.
                    // For a partial sell, we only update the position *in theory*
                    // but do not log a P/L event.

                    // Update remaining position (simple average cost basis assumed)
                    uint256 remainingAmount = currentAmount - _amount;
                    uint256 partialCost = (_amount * currentCost) / currentAmount;
                    uint256 remainingCost = currentCost - partialCost;

                    openPositionsAmount[msg.sender][_tokenSymbol] = remainingAmount;
                    openPositionsCost[msg.sender][_tokenSymbol] = remainingCost;
                }
            }
        }
    }

    /**
     * @dev Returns the total number of trades logged.
     */
    function getTotalTrades() public view returns (uint256) {
        return trades.length;
    }

    /**
     * @dev Returns the total number of P/L records.
     */
    function getTotalPnLResults() public view returns (uint256) {
        return pnlHistory.length;
    }
}