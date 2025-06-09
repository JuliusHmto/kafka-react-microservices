-- Migration: Add missing columns to transactions table
-- This migration adds columns that the Transaction entity expects but are missing from the database

-- Add external_reference column
ALTER TABLE transactions 
ADD COLUMN external_reference VARCHAR(100);

-- Add updated_at column with trigger for auto-update
ALTER TABLE transactions 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add failure_reason column  
ALTER TABLE transactions 
ADD COLUMN failure_reason VARCHAR(1000);

-- Create trigger for auto-updating updated_at timestamp
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_transactions_external_reference ON transactions(external_reference);
CREATE INDEX idx_transactions_updated_at ON transactions(updated_at);

-- Add comments for documentation
COMMENT ON COLUMN transactions.external_reference IS 'External reference for the transaction from third-party systems';
COMMENT ON COLUMN transactions.updated_at IS 'Timestamp when the transaction was last updated';
COMMENT ON COLUMN transactions.failure_reason IS 'Reason for transaction failure if status is FAILED'; 