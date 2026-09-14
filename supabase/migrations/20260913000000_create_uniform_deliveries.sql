begin;

create table if not exists public.uniform_deliveries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  game_id text not null,
  whatsapp text not null,
  discord text not null,
  postal_code text not null,
  street text not null,
  address_number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  created_at timestamptz not null default now(),
  constraint uniform_deliveries_name_length check (char_length(btrim(name)) between 2 and 120),
  constraint uniform_deliveries_game_id_length check (char_length(btrim(game_id)) between 2 and 64),
  constraint uniform_deliveries_whatsapp_format check (whatsapp ~ '^[1-9][0-9]{9,14}$'),
  constraint uniform_deliveries_discord_format check (discord ~ '^[a-z0-9._]{2,32}$'),
  constraint uniform_deliveries_postal_code_format check (postal_code ~ '^[0-9]{8}$'),
  constraint uniform_deliveries_street_length check (char_length(btrim(street)) between 2 and 160),
  constraint uniform_deliveries_address_number_length check (char_length(btrim(address_number)) between 1 and 20),
  constraint uniform_deliveries_complement_length check (complement is null or char_length(complement) <= 120),
  constraint uniform_deliveries_neighborhood_length check (char_length(btrim(neighborhood)) between 2 and 120),
  constraint uniform_deliveries_city_length check (char_length(btrim(city)) between 2 and 120),
  constraint uniform_deliveries_state_allowed check (
    state in (
      'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA',
      'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
    )
  )
);

create unique index if not exists uniform_deliveries_game_id_lower_unique
  on public.uniform_deliveries (lower(game_id));

create unique index if not exists uniform_deliveries_whatsapp_unique
  on public.uniform_deliveries (whatsapp);

create unique index if not exists uniform_deliveries_discord_unique
  on public.uniform_deliveries (discord);

create index if not exists uniform_deliveries_created_at_idx
  on public.uniform_deliveries (created_at desc);

alter table public.uniform_deliveries enable row level security;
alter table public.uniform_deliveries force row level security;

revoke all privileges on table public.uniform_deliveries from public, anon, authenticated;
grant select, insert, update, delete on table public.uniform_deliveries to service_role;

commit;
