create table if not exists auction_item_requests (
	id serial primary key,
	auction_name text not null,
	item_name text not null,
	item_description text not null,
	item_images jsonb,
	condition text,
	requester_name text not null,
	requester_email text not null,
	requester_user_id text,
	created_at timestamp with time zone default now()
);
