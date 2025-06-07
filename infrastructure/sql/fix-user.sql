-- Fix banking_user authentication
-- Ensure the user exists and has the correct password
ALTER USER banking_user WITH PASSWORD 'banking_pass';
-- Grant all necessary privileges
GRANT ALL PRIVILEGES ON DATABASE banking_db TO banking_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO banking_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO banking_user;
GRANT USAGE ON SCHEMA public TO banking_user; 