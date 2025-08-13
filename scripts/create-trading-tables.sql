-- Create signals table to store all generated signals
CREATE TABLE IF NOT EXISTS signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pair VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  entry_price DECIMAL(20, 8) NOT NULL,
  stop_loss DECIMAL(20, 8) NOT NULL,
  take_profit DECIMAL(20, 8) NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  analysis TEXT NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'HIT_SL', 'HIT_TP', 'CANCELLED')),
  actual_exit_price DECIMAL(20, 8),
  actual_pnl DECIMAL(10, 4),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Create signal_performance table to track outcomes
CREATE TABLE IF NOT EXISTS signal_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('WIN', 'LOSS', 'BREAKEVEN', 'EXPIRED')),
  pnl_percentage DECIMAL(10, 4) NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_signal_tracking table to track which signals users followed
CREATE TABLE IF NOT EXISTS user_signal_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  position_size DECIMAL(20, 8),
  actual_entry_price DECIMAL(20, 8),
  user_exit_price DECIMAL(20, 8),
  user_pnl DECIMAL(10, 4),
  status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED'))
);

-- Create performance_metrics table for aggregated statistics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  date DATE NOT NULL,
  total_signals INTEGER DEFAULT 0,
  winning_signals INTEGER DEFAULT 0,
  losing_signals INTEGER DEFAULT 0,
  win_rate DECIMAL(5, 2) DEFAULT 0,
  avg_pnl DECIMAL(10, 4) DEFAULT 0,
  total_pnl DECIMAL(10, 4) DEFAULT 0,
  max_drawdown DECIMAL(10, 4) DEFAULT 0,
  sharpe_ratio DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(period, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON signals(created_at);
CREATE INDEX IF NOT EXISTS idx_signals_pair ON signals(pair);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE INDEX IF NOT EXISTS idx_signal_performance_signal_id ON signal_performance(signal_id);
CREATE INDEX IF NOT EXISTS idx_user_signal_tracking_user_id ON user_signal_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_signal_tracking_signal_id ON user_signal_tracking(signal_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_period_date ON performance_metrics(period, date);
