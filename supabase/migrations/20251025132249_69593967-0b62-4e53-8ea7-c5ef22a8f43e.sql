-- Create enum for trade types
CREATE TYPE public.trade_type AS ENUM ('buy', 'sell');

-- Create enum for crypto assets
CREATE TYPE public.crypto_asset AS ENUM ('BTC', 'ETH', 'SOL', 'USDC', 'USDT', 'MATIC', 'AVAX', 'DOT', 'LINK', 'UNI', 'AAVE', 'other');

-- Create trades table
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  asset crypto_asset NOT NULL,
  trade_type trade_type NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  price_usd DECIMAL(20, 8) NOT NULL,
  total_value_usd DECIMAL(20, 8) NOT NULL,
  fee_usd DECIMAL(10, 8) DEFAULT 0,
  notes TEXT,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_snapshots table for sharing
CREATE TABLE public.portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  snapshot_hash TEXT UNIQUE NOT NULL,
  total_value_usd DECIMAL(20, 8) NOT NULL,
  total_pnl_usd DECIMAL(20, 8) NOT NULL,
  total_pnl_percent DECIMAL(10, 4) NOT NULL,
  holdings JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- Trades policies
CREATE POLICY "Users can view their own trades"
  ON public.trades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades"
  ON public.trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades"
  ON public.trades FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades"
  ON public.trades FOR DELETE
  USING (auth.uid() = user_id);

-- Portfolio snapshots policies
CREATE POLICY "Users can view their own snapshots"
  ON public.portfolio_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public snapshots"
  ON public.portfolio_snapshots FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can create their own snapshots"
  ON public.portfolio_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snapshots"
  ON public.portfolio_snapshots FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snapshots"
  ON public.portfolio_snapshots FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_executed_at ON public.trades(executed_at DESC);
CREATE INDEX idx_snapshots_hash ON public.portfolio_snapshots(snapshot_hash);
CREATE INDEX idx_snapshots_public ON public.portfolio_snapshots(is_public) WHERE is_public = TRUE;