-- Banking System Database Initialization
-- This script creates the database structure and ensures proper user authentication

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User management table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP
);

-- Account types as VARCHAR with constraints (Hibernate-friendly)
-- CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'BUSINESS', 'JOINT', 'STUDENT', 'PREMIUM');
-- CREATE TYPE account_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED', 'FROZEN');

-- Accounts table - Updated for better Hibernate compatibility
CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('CHECKING', 'SAVINGS', 'BUSINESS', 'JOINT', 'STUDENT', 'PREMIUM')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED', 'FROZEN')),
    balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    available_currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    daily_limit DECIMAL(15,2) DEFAULT 5000.00,
    monthly_limit DECIMAL(15,2) DEFAULT 50000.00
);

-- Transaction types and status as VARCHAR with constraints
-- CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'REFUND');
-- CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PROCESSING');

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_reference VARCHAR(50) UNIQUE NOT NULL,
    from_account_id UUID REFERENCES accounts(id),
    to_account_id UUID REFERENCES accounts(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'REFUND')),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PROCESSING')),
    description TEXT,
    user_id UUID NOT NULL REFERENCES users(id),
    external_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    failure_reason VARCHAR(1000),
    metadata JSONB,
    
    -- Constraints
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT valid_accounts CHECK (
        (transaction_type = 'DEPOSIT' AND from_account_id IS NULL AND to_account_id IS NOT NULL) OR
        (transaction_type = 'WITHDRAWAL' AND from_account_id IS NOT NULL AND to_account_id IS NULL) OR
        (transaction_type IN ('TRANSFER', 'PAYMENT') AND from_account_id IS NOT NULL AND to_account_id IS NOT NULL) OR
        (transaction_type = 'REFUND')
    )
);

-- Audit log for all events
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES users(id),
    event_data JSONB NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    correlation_id UUID,
    source_service VARCHAR(50) NOT NULL
);

-- Fraud detection alerts
-- CREATE TYPE fraud_status AS ENUM ('PENDING', 'CONFIRMED', 'FALSE_POSITIVE', 'INVESTIGATING');

CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id),
    user_id UUID REFERENCES users(id),
    alert_type VARCHAR(50) NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'FALSE_POSITIVE', 'INVESTIGATING')),
    description TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    metadata JSONB
);

-- Notifications table
-- CREATE TYPE notification_type AS ENUM ('EMAIL', 'SMS', 'PUSH', 'IN_APP');
-- CREATE TYPE notification_status AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'READ')),
    subject VARCHAR(200),
    content TEXT NOT NULL,
    recipient VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    metadata JSONB
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_number ON accounts(account_number);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_transactions_from_account ON transactions(from_account_id);
CREATE INDEX idx_transactions_to_account ON transactions(to_account_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_reference ON transactions(transaction_reference);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_events_timestamp ON audit_events(timestamp);
CREATE INDEX idx_fraud_alerts_transaction ON fraud_alerts(transaction_id);
CREATE INDEX idx_fraud_alerts_user ON fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone_number) VALUES
('b061f043-07b3-4006-be9f-b75e90631b96', 'john.doe', 'john.doe@bank.com', '$2a$10$dummy.hash.for.testing', 'John', 'Doe', '+1234567890'),
('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'jane.smith', 'jane.smith@bank.com', '$2a$10$dummy.hash.for.testing', 'Jane', 'Smith', '+1234567891'),
('c2ggde99-9c0b-4ef8-bb6d-6bb9bd380a33', 'admin', 'admin@bank.com', '$2a$10$dummy.hash.for.testing', 'System', 'Administrator', '+1234567892');

-- Sample accounts with explicit UUIDs
INSERT INTO accounts (id, account_number, user_id, account_type, status, balance, available_balance) VALUES
('d3hhef99-9c0b-4ef8-bb6d-6bb9bd380a44', 'CHK001000001', 'b061f043-07b3-4006-be9f-b75e90631b96', 'CHECKING', 'ACTIVE', 5000.00, 5000.00),
('e4iifg99-9c0b-4ef8-bb6d-6bb9bd380a55', 'SAV001000001', 'b061f043-07b3-4006-be9f-b75e90631b96', 'SAVINGS', 'ACTIVE', 15000.00, 15000.00),
('f5jjgh99-9c0b-4ef8-bb6d-6bb9bd380a66', 'CHK001000002', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'CHECKING', 'ACTIVE', 3000.00, 3000.00),
('g6kkhi99-9c0b-4ef8-bb6d-6bb9bd380a77', 'SAV001000002', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'SAVINGS', 'ACTIVE', 8000.00, 8000.00);

-- Sample transactions for testing
INSERT INTO transactions (id, transaction_reference, from_account_id, to_account_id, transaction_type, amount, currency, status, description, user_id, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'TXN001000001', NULL, 'd3hhef99-9c0b-4ef8-bb6d-6bb9bd380a44', 'DEPOSIT', 1000.00, 'USD', 'COMPLETED', 'Initial deposit', 'b061f043-07b3-4006-be9f-b75e90631b96', NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'TXN001000002', 'd3hhef99-9c0b-4ef8-bb6d-6bb9bd380a44', NULL, 'WITHDRAWAL', 200.00, 'USD', 'COMPLETED', 'ATM withdrawal', 'b061f043-07b3-4006-be9f-b75e90631b96', NOW() - INTERVAL '1 day'),
('33333333-3333-3333-3333-333333333333', 'TXN001000003', 'd3hhef99-9c0b-4ef8-bb6d-6bb9bd380a44', 'e4iifg99-9c0b-4ef8-bb6d-6bb9bd380a55', 'TRANSFER', 500.00, 'USD', 'COMPLETED', 'Transfer to savings', 'b061f043-07b3-4006-be9f-b75e90631b96', NOW() - INTERVAL '1 hour'),
('44444444-4444-4444-4444-444444444444', 'TXN001000004', NULL, 'f5jjgh99-9c0b-4ef8-bb6d-6bb9bd380a66', 'DEPOSIT', 500.00, 'USD', 'COMPLETED', 'Payroll deposit', 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', NOW() - INTERVAL '6 hours'); 