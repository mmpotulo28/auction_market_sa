-- 1. Allow the anon and service_role roles to execute the function
GRANT EXECUTE ON FUNCTION public.ensure_transactions_table() TO anon;
GRANT EXECUTE ON FUNCTION public.ensure_transactions_table() TO service_role;

-- 2. Allow the function to create tables by running it as a superuser or with elevated privileges
-- This is done by marking the function as SECURITY DEFINER and setting the owner to a superuser (usually postgres)
-- You must be a superuser to do this

-- Example: (run as a superuser)
ALTER FUNCTION public.ensure_transactions_table() OWNER TO postgres;

-- If your function is not already SECURITY DEFINER, recreate it as such:
-- (Replace the function body with your actual function code)

CREATE OR REPLACE FUNCTION public.ensure_transactions_table()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'transactions'
    ) THEN
        CREATE TABLE transactions (
            id serial PRIMARY KEY,
            m_payment_id varchar,
            pf_payment_id varchar,
            payment_status varchar,
            item_name varchar,
            item_description varchar,
            amount_gross numeric,
            amount_fee numeric,
            amount_net numeric,
            custom_str1 varchar,
            custom_str2 varchar,
            custom_str3 varchar,
            custom_str4 varchar,
            custom_str5 varchar,
            custom_int1 integer,
            custom_int2 integer,
            custom_int3 integer,
            custom_int4 integer,
            custom_int5 integer,
            name_first varchar,
            name_last varchar,
            email_address varchar,
            merchant_id varchar,
            signature varchar,
            created_at timestamp default now()
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. (Optional) Restrict table creation to only this function by revoking CREATE on schema public from other roles if needed:
-- REVOKE CREATE ON SCHEMA public FROM PUBLIC;
-- REVOKE CREATE ON SCHEMA public FROM anon;
-- REVOKE CREATE ON SCHEMA public FROM service_role;
