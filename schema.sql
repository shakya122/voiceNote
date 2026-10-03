-- Run this in your database's SQL editor (Neon: SQL Editor in the dashboard).
-- Safe to re-run: existing tables/columns are left alone, missing ones are added.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  avatar_data_url text,
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table notes add column if not exists title text not null default 'Untitled note';

create index if not exists notes_user_id_idx on notes(user_id);
