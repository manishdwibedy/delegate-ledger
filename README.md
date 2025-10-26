# DelegateX

A non-custodial delegated trading platform that enables users to grant limited trading authority while maintaining full asset control. All trades and performance metrics are recorded immutably on the Ethereum blockchain.

## Overview

DelegateX is a delegated trading platform that enables clients to grant limited, non-custodial trading authority to managers, with performance results recorded immutably on the Ethereum blockchain. The platform addresses the challenge of verifiable delegated management of assets when trading execution occurs off-chain via centralized brokerage APIs, while storing only performance metrics on-chain.

### Original Vision: Delegated Trading Platform Architecture Roadmap (V1.0 - V3.0)
- **V1.0**: Hackathon MVP proving core concepts of delegated authority (ERC-20 approve/permit) and on-chain performance tracking
- **V2.0**: Integration with real brokerage APIs and traditional assets
- **V3.0**: Full production platform with advanced features

### Current Status: v0.8 (Hackathon MVP - Proof of Concept)
This version proves the core concepts with mock ERC-20 tokens, ERC-20 approve() delegation, and on-chain performance tracking via stubbed off-chain engine.

#### ✅ Completed Features (v0.8)
- **Non-Custodial Trading**: Assets remain in user wallets at all times
- **On-Chain Trade Logging**: All trades recorded via Ethereum smart contract (TradeLogger.sol)
- **P&L Calculation**: Automatic profit/loss computation for completed trading cycles
- **Portfolio Sharing**: Shareable portfolio views with unique hashes
- **Mock Delegation**: Simulated delegation interface using ERC-20 approve() mechanism
- **Performance Analytics**: Charts and statistics for trade performance
- **Multi-Database Support**: Switch between Supabase and MongoDB backends
- **Wallet Integration**: Connect Ethereum wallets for on-chain interactions
- **ERC-20 Delegation**: Client uses ERC-20 approve() to delegate spending limits to manager wallet
- **On-Chain Performance Tracking**: PerformanceTracker.sol contract for recording metrics

#### 🚧 Planned for v0.9 (Enhanced MVP)
- **Off-Chain Engine Integration**: Replace stubbed P&L with basic FastAPI simulation engine
- **Improved Delegation UI**: Enhanced delegation setup with clearer permission controls
- **Real-Time Performance Updates**: Live updates from off-chain engine to on-chain contracts
- **Basic Risk Management**: Position size limits and basic stop-loss simulation
- **Enhanced Testing**: Comprehensive smart contract test suite

#### 🎯 Roadmap to v1.0 (Production Ready)
- **Real Brokerage Integration**: Connect to actual brokerage APIs (Alpaca, Interactive Brokers)
- **Traditional Asset Support**: Enable trading of equities and fiat currencies
- **Advanced Delegation Controls**: Granular permissions (max position sizes, asset restrictions, time limits)
- **Production Smart Contracts**: Audited contracts with multi-sig controls
- **Institutional Features**: White-label options, compliance tools, enterprise APIs
- **Multi-Chain Support**: Ethereum mainnet + Layer 2 solutions

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Recharts** for data visualization

### Backend & Database
- **Supabase** for authentication and real-time database
- **MongoDB** for alternative database option
- **React Query** for state management

### Blockchain
- **Hardhat** for smart contract development and testing
- **Ethers.js** for blockchain interactions
- **Solidity 0.8.4** for smart contracts

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **PostCSS** and **Autoprefixer** for CSS processing

## Architecture

### Smart Contract (TradeLogger.sol)
The core smart contract handles:
- Logging buy/sell trades with timestamps and prices
- Tracking open positions per user and token
- Calculating P&L on position closures
- Emitting events for transparency

### Frontend Components
- **Auth**: User authentication via Supabase
- **TradeForm**: Input form for logging trades (supports PyUSD stablecoin)
- **TradesList**: Display of logged trades
- **PnLDisplay**: Profit/loss calculations and history
- **DelegationPanel**: Mock interface for delegation setup with PyUSD recommendations
- **PyUSDFeatures**: Dedicated component showcasing PyUSD benefits for delegated trading
- **PerformanceChart**: Visual representation of trading performance
- **Wallet**: Ethereum wallet connection and display

### Database Schema
Supports both Supabase (PostgreSQL) and MongoDB with tables/collections for:
- Users
- Trades
- P&L results
- Delegations (future)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Ethereum wallet (MetaMask recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd delegate-ledger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_MONGODB_URI=your_mongodb_uri
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Smart Contract Development**
   ```bash
   # Install Hardhat dependencies
   npm install --save-dev @nomiclabs/hardhat-ethers @nomiclabs/hardhat-waffle chai ethereum-waffle

   # Run tests
   npx hardhat test
   ```

### Building for Production
```bash
npm run build
```

### Deployment
The app can be deployed to any static hosting service (Vercel, Netlify, etc.) or via Lovable's publish feature.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Auth.tsx        # Authentication component
│   ├── TradeForm.tsx   # Trade logging form (PyUSD enabled)
│   ├── DelegationPanel.tsx # Delegation with PyUSD features
│   ├── PyUSDFeatures.tsx   # PyUSD benefits showcase
│   ├── TradesList.tsx  # Trades display
│   └── ...
├── pages/              # Route components
│   ├── Index.tsx       # Main dashboard
│   ├── PortfolioView.tsx # Public portfolio view
│   └── NotFound.tsx    # 404 page
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utilities and configurations
│   ├── database.ts     # Database abstraction layer
│   ├── contract.ts     # Smart contract interactions
│   └── utils.ts        # Helper functions
└── hooks/              # Custom React hooks

smart_contracts/
└── TradeLogger.sol     # Main smart contract

supabase/
└── migrations/         # Database migrations
```

## Smart Contract Details

### TradeLogger Contract
- **Solidity Version**: ^0.8.0
- **Functions**:
  - `logTrade()`: Logs a trade and updates positions/P&L
  - `getTotalTrades()`: Returns total trade count
  - `getTotalPnLResults()`: Returns total P&L records
- **Events**:
  - `TradeLogged`: Emitted on each trade
  - `PnLCalculated`: Emitted when P&L is calculated

### Testing
Run smart contract tests with:
```bash
npx hardhat test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## PyUSD Integration

DelegateX now supports PayPal's PyUSD stablecoin to demonstrate advanced stablecoin features in delegated trading:

### PyUSD Benefits for Delegation
- **Price Stability**: Maintains $1.00 peg, perfect for setting predictable delegation limits
- **PayPal Backing**: Institutional-grade security and regulatory compliance
- **Yield Opportunities**: Earn yield through PayPal's ecosystem while delegating
- **Fast Settlements**: Near-instant transfers ideal for active trading strategies
- **PayPal Integration**: Seamless connection for instant transfers, merchant payments, and wallet bridging
- **Advanced Yield**: Enhanced earnings through staking, lending pools, and ecosystem rewards
- **Enhanced Security**: KYC compliance, audit trails, and multi-signature support
- **Instant Liquidity**: Real-time fiat conversion through PayPal's network

### Advanced PyUSD Features
#### PayPal Integration Features
- Direct transfers between PayPal accounts and PyUSD wallets
- Merchant payment processing with instant settlement
- Seamless bridging for cross-border transactions
- Automated reconciliation with PayPal statements

#### Advanced Yield Opportunities
- Staking rewards through PayPal's liquidity pools
- Lending protocols with competitive APYs
- Ecosystem incentives for long-term holding
- Automated yield farming strategies

#### Security & Compliance
- Integrated KYC verification for all transactions
- Immutable audit trails for regulatory reporting
- Multi-signature support for institutional delegations
- Real-time compliance monitoring and alerts

### Enhanced Delegation Advantages
- Instant fiat conversion for emergency withdrawals
- Multi-signature approvals for large delegation amounts
- Automated yield compounding on delegated funds
- Real-time compliance monitoring and reporting

### Use Cases
- **Stable Delegation Limits**: Set $10,000 PyUSD delegation that remains $10,000 worth
- **Risk Management**: Use PyUSD for stop-loss and position sizing controls
- **Performance Tracking**: Accurate P&L calculations in stable dollars
- **Portfolio Stability**: Maintain purchasing power during market volatility
- **Advanced Trading Strategies**: Leverage yield and liquidity for sophisticated delegation scenarios

### Components
- **PyUSDFeatures**: Dedicated showcase of PyUSD benefits for delegated trading
- **Enhanced DelegationPanel**: Recommends PyUSD for delegation with stability highlights
- **TradeForm**: PyUSD added to supported assets for trading and logging

## Disclaimer

This is a hackathon MVP for educational purposes only. Not intended for production use without thorough security audits and testing.
