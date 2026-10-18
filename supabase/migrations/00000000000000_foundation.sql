create schema if not exists private;

create table if not exists private.foundation_metadata (
  key text primary key,
  value jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

revoke all on schema private from public, anon, authenticated;
revoke all on private.foundation_metadata from public, anon, authenticated;
