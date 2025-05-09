BEGIN;

-- Ensure the dbo schema exists
CREATE SCHEMA IF NOT EXISTS dbo;

-- Grant permissions to anon and postgres users for the schema
GRANT USAGE ON SCHEMA dbo TO anon, postgres;

-- Grant permissions to anon and postgres users for all tables in the schema
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA dbo TO anon, postgres;

-- Create auctions table
CREATE TABLE IF NOT EXISTS dbo.auctions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    items_count INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration INT NOT NULL, -- in minutes
    re_open_count INT NOT NULL,
    description TEXT,
    date_created TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL
);

-- Create items table
CREATE TABLE IF NOT EXISTS dbo.items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    auction_id INT NOT NULL REFERENCES dbo.auctions(id) ON DELETE CASCADE
);

COMMIT;
