-- Migration: Add user_id column to transactions table
-- This migration adds a user_id column to enable direct user-based transaction queries

-- Add user_id column to transactions table
ALTER TABLE transactions 
ADD COLUMN user_id UUID REFERENCES users(id);

-- Create index for performance on user_id queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- Update existing transactions to set user_id based on account ownership
-- For transactions with from_account_id, use the user_id from that account
UPDATE transactions 
SET user_id = (
    SELECT user_id 
    FROM accounts 
    WHERE accounts.id = transactions.from_account_id
)
WHERE from_account_id IS NOT NULL;

-- For deposit transactions (where from_account_id is NULL), use the user_id from to_account_id
UPDATE transactions 
SET user_id = (
    SELECT user_id 
    FROM accounts 
    WHERE accounts.id = transactions.to_account_id
)
WHERE from_account_id IS NULL AND to_account_id IS NOT NULL;

-- Make user_id NOT NULL after populating existing data
ALTER TABLE transactions 
ALTER COLUMN user_id SET NOT NULL;

-- Add comment to the column for documentation
COMMENT ON COLUMN transactions.user_id IS 'ID of the user who initiated this transaction'; 