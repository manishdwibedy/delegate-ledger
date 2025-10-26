-- Add transaction_hash column to trades table
ALTER TABLE public.trades ADD COLUMN transaction_hash TEXT;

-- Add index for transaction_hash for better query performance
CREATE INDEX idx_trades_transaction_hash ON public.trades(transaction_hash);
