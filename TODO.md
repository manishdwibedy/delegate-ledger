# TODO: Implement Smart Contract Interactions

- [x] Create contract interaction service with ABI and address
- [x] Add trade logging to TradeForm component
- [x] Create PnLDisplay component to show P/L history from contract
- [x] Integrate P/L display into dashboard
- [x] Test contract interactions on Sepolia testnet
- [x] Add transaction_hash column to trades table
- [x] Update TradeForm to store transaction hash when logging to blockchain
- [x] Add transaction hash links to TradesList component
- [x] Set up local MongoDB with Docker
- [x] Create database abstraction layer for Supabase/MongoDB switching
- [x] Update Auth component to use database adapter
- [x] Update TradeForm component to use database adapter
- [x] Update TradesList component to use database adapter
- [x] Update Index page to use database adapter
- [x] Add DatabaseSwitcher component to UI

# TODO: Add Database Switching Capability

- [x] Create database abstraction layer
- [x] Add MongoDB integration (disabled for browser compatibility - requires backend API)
- [x] Add configuration to switch between Supabase and MongoDB
- [x] Update Auth component to work with both databases
- [x] Update TradeForm to work with both databases
- [x] Update TradesList to work with both databases
- [x] Add database switcher UI component
- [x] Fix MongoDBAdapter in src/lib/database.ts: Import ObjectId, improve getCurrentUser, add password hashing
- [x] Update TradesList.tsx to pass userId to getTrades
- [x] Update TradeForm.tsx to update transaction_hash for MongoDB
- [x] Test switching between databases
