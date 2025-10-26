import { ethers } from "ethers";

// Contract address on Sepolia testnet
export const CONTRACT_ADDRESS = "0xdD2e335b9F51b9C4dE0bFd9756ff3375De41669b";

// Sepolia Etherscan URLs
export const ETHERSCAN_BASE_URL = "https://sepolia.etherscan.io";

export const getContractEtherscanUrl = () => {
  return `${ETHERSCAN_BASE_URL}/address/${CONTRACT_ADDRESS}`;
};

export const getTransactionEtherscanUrl = (txHash: string) => {
  return `${ETHERSCAN_BASE_URL}/tx/${txHash}`;
};

// Contract ABI
export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_tokenSymbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_isBuy",
        "type": "bool"
      }
    ],
    "name": "logTrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalTrades",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalPnLResults",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "trades",
    "outputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isBuy",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pnlHistory",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalBuyCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalSellRevenue",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "netProfitOrLoss",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "capitalDeployed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "buyTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sellTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "buyAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sellAmount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "openPositionsAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "openPositionsCost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isBuy",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "TradeLogged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "netProfitOrLoss",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "capitalDeployed",
        "type": "uint256"
      }
    ],
    "name": "PnLCalculated",
    "type": "event"
  }
];

// Types
export interface Trade {
  user: string;
  tokenSymbol: string;
  amount: bigint;
  price: bigint;
  timestamp: bigint;
  isBuy: boolean;
}

export interface PnLResult {
  totalBuyCost: bigint;
  totalSellRevenue: bigint;
  netProfitOrLoss: bigint;
  capitalDeployed: bigint;
  buyTimestamp: bigint;
  sellTimestamp: bigint;
  buyAmount: bigint;
  sellAmount: bigint;
  tokenSymbol: string;
}

// Contract interaction functions
export class TradeLoggerContract {
  private contract: ethers.Contract | null = null;

  constructor(provider?: ethers.Provider, signer?: ethers.Signer) {
    if (provider && signer) {
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
  }

  // Initialize contract with provider and signer
  initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  // Log a trade to the smart contract
  async logTrade(tokenSymbol: string, amount: number, price: number, isBuy: boolean): Promise<ethers.TransactionResponse> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    // Convert amount to wei (18 decimals), price to USD cents (2 decimals)
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    const priceCents = ethers.parseUnits(price.toString(), 2);

    console.log('Logging trade to contract:', {
      tokenSymbol,
      amount: amountWei.toString(),
      price: priceCents.toString(),
      isBuy
    });

    const tx = await this.contract.logTrade(tokenSymbol, amountWei, priceCents, isBuy);
    console.log('Trade logged, transaction:', tx.hash);
    return tx;
  }

  // Get all P/L results
  async getPnLHistory(): Promise<PnLResult[]> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    const totalPnL = await this.contract.getTotalPnLResults();
    const pnlResults: PnLResult[] = [];

    for (let i = 0; i < totalPnL; i++) {
      const pnl = await this.contract.pnlHistory(i);
      pnlResults.push({
        totalBuyCost: pnl[0],
        totalSellRevenue: pnl[1],
        netProfitOrLoss: pnl[2],
        capitalDeployed: pnl[3],
        buyTimestamp: pnl[4],
        sellTimestamp: pnl[5],
        buyAmount: pnl[6],
        sellAmount: pnl[7],
        tokenSymbol: pnl[8]
      });
    }

    return pnlResults;
  }

  // Get user's P/L results (filter by connected wallet address)
  async getUserPnLHistory(userAddress: string): Promise<PnLResult[]> {
    const allPnL = await this.getPnLHistory();
    // Note: The contract doesn't store user address in PnLResult, so we can't filter here
    // This would need to be implemented differently in the contract
    return allPnL;
  }

  // Get total number of trades
  async getTotalTrades(): Promise<number> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }
    const total = await this.contract.getTotalTrades();
    return Number(total);
  }

  // Get total number of P/L results
  async getTotalPnLResults(): Promise<number> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }
    const total = await this.contract.getTotalPnLResults();
    return Number(total);
  }
}

// Singleton instance
export const tradeLoggerContract = new TradeLoggerContract();
