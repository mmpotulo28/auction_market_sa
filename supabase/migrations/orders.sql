CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255) UNIQUE, 
    order_status VARCHAR(32) NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    price NUMERIC(12,2) NOT NULL,
    user_email VARCHAR(255),
    user_first_name VARCHAR(255),
    user_last_name VARCHAR(255),
    meta JSONB
);
