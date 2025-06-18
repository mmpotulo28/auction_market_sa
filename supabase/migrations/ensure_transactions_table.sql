-- Grant execute permission to postgres and anon for the ensure_transactions_table function
GRANT EXECUTE ON FUNCTION public.ensure_transactions_table() TO postgres;
GRANT EXECUTE ON FUNCTION public.ensure_transactions_table() TO anon;
