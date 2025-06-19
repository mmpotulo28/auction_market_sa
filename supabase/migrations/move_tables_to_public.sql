BEGIN;

-- Ensure the public schema exists
CREATE SCHEMA IF NOT EXISTS public;

-- Grant necessary permissions on dbo tables before moving
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE dbo.auctions TO CURRENT_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE dbo.items TO CURRENT_USER;

-- Move auctions table from dbo to public schema
ALTER TABLE dbo.auctions SET SCHEMA public;

-- Move items table from dbo to public schema
ALTER TABLE dbo.items SET SCHEMA public;

-- Revoke permissions from dbo schema if no longer needed
REVOKE USAGE ON SCHEMA dbo FROM anon, postgres;

COMMIT;
