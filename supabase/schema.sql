-- Axloxo schema. Run in Supabase SQL Editor.
-- Safe to re-run (idempotent).

create extension if not exists "pgcrypto";

-- Products catalog
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  description text not null default '',
  colors text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  sold_out boolean not null default true,
  image_path text,             -- key inside the product-images bucket, nullable
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_sort_idx on products (sort_order, name);

-- Custom bracelet requests
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  colors text not null,
  size text,
  occasion text,
  notes text,
  status text not null default 'received'
    check (status in ('received','quoted','paid','shipped','cancelled')),
  quoted_cents integer,
  payment_link text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists requests_status_idx on requests (status, created_at desc);
create index if not exists requests_created_idx on requests (created_at desc);

-- Auto-update updated_at
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at before update on products
  for each row execute function set_updated_at();

drop trigger if exists requests_set_updated_at on requests;
create trigger requests_set_updated_at before update on requests
  for each row execute function set_updated_at();

-- Row-level security: public reads for products, no public writes;
-- requests are locked to service-role only (admin).
alter table products enable row level security;
alter table requests enable row level security;

drop policy if exists "products readable by anyone" on products;
create policy "products readable by anyone"
  on products for select
  using (true);

-- (No RLS policies for requests means only the service role can see them.)

-- Storage bucket for product images. Public-read so <img src> works directly.
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do update set public = excluded.public;
