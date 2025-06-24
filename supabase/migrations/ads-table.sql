create table ads (
	id uuid primary key default gen_random_uuid(),
	variant text not null,
	title text not null,
	description text not null,
	imageUrl text not null,
	linkUrl text not null,
	cta text not null,
	created_at timestamp with time zone default now()
);

-- Indexes for quick searching/filtering
create index idx_ads_variant on ads(variant);
create index idx_ads_title on ads(title);
create index idx_ads_created_at on ads(created_at);
