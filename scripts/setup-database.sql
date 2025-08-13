-- CopyTrade Syndicate Database Schema
-- Production-ready database setup with realistic trading data

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    subscription VARCHAR(20) DEFAULT 'free',
    broker_connected BOOLEAN DEFAULT FALSE,
    total_pnl DECIMAL(10,2) DEFAULT 0.00,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Traders table (signal providers)
CREATE TABLE IF NOT EXISTS traders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    display_name VARCHAR(100) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    total_followers INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    total_signals INTEGER DEFAULT 0,
    avg_risk DECIMAL(4,2) DEFAULT 2.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trading signals table
CREATE TABLE IF NOT EXISTS signals (
    id SERIAL PRIMARY KEY,
    trader_id INTEGER REFERENCES traders(id),
    pair VARCHAR(20) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('BUY', 'SELL')),
    entry_price DECIMAL(10,5) NOT NULL,
    stop_loss DECIMAL(10,5) NOT NULL,
    take_profit DECIMAL(10,5) NOT NULL,
    risk_percentage DECIMAL(4,2) DEFAULT 2.00,
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
    analysis TEXT,
    pnl DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- User positions table
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    signal_id INTEGER REFERENCES signals(id),
    pair VARCHAR(20) NOT NULL,
    action VARCHAR(10) NOT NULL,
    size DECIMAL(8,2) NOT NULL,
    entry_price DECIMAL(10,5) NOT NULL,
    current_price DECIMAL(10,5),
    pnl DECIMAL(10,2) DEFAULT 0.00,
    pnl_percentage DECIMAL(6,3) DEFAULT 0.000,
    status VARCHAR(20) DEFAULT 'open',
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    price DECIMAL(8,2) NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    stripe_subscription_id VARCHAR(255)
);

-- Broker connections table
CREATE TABLE IF NOT EXISTS broker_connections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    broker_name VARCHAR(100) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    account_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'connected',
    last_sync TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for production testing
INSERT INTO traders (display_name, verified, total_followers, win_rate, total_signals, avg_risk) VALUES
('ProTrader_Mike', TRUE, 1247, 78.5, 342, 2.3),
('FX_Master_John', TRUE, 892, 82.1, 198, 1.8),
('CryptoKing_Alex', TRUE, 2156, 71.2, 567, 3.1),
('ForexGuru_Sarah', TRUE, 1534, 85.7, 289, 2.0),
('TechAnalyst_David', TRUE, 967, 76.3, 445, 2.7);

-- Insert sample signals with realistic data
INSERT INTO signals (trader_id, pair, action, entry_price, stop_loss, take_profit, risk_percentage, confidence, analysis, pnl) VALUES
(1, 'EUR/USD', 'BUY', 1.0875, 1.0825, 1.0925, 2.5, 85, 'Strong bullish momentum with ECB dovish stance', 127.50),
(2, 'GBP/JPY', 'SELL', 189.45, 190.20, 188.70, 1.8, 92, 'Bearish divergence on 4H chart, BoJ intervention risk', -45.20),
(3, 'BTC/USD', 'BUY', 43250.00, 42800.00, 44100.00, 3.2, 78, 'Bitcoin breaking resistance, institutional buying', 892.30),
(4, 'USD/CAD', 'SELL', 1.3520, 1.3570, 1.3470, 2.0, 88, 'CAD strength on oil price rally', 156.80),
(5, 'XAU/USD', 'BUY', 2045.50, 2035.00, 2065.00, 2.8, 81, 'Gold bullish on inflation concerns', 234.70);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_signals_trader_id ON signals(trader_id);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON signals(created_at);
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_signal_id ON positions(signal_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
