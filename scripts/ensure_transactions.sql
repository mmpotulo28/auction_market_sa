create or replace function ensure_transactions_table()
returns void as $$
begin
    if not exists (
        select from information_schema.tables 
        where table_name = 'transactions'
    ) then
        create table transactions (
            id serial primary key,
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
    end if;
end;
$$ language plpgsql;