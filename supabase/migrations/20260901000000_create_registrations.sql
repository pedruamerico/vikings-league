begin;

create extension if not exists pgcrypto;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  idempotency_key uuid not null,
  photo_object_path text not null,
  photo_mime_type text not null,
  photo_size_bytes integer not null,
  name text not null,
  game_id text not null,
  instagram text not null,
  whatsapp text not null,
  shirt_size text not null,
  shirt_number smallint not null,
  position_1 text not null,
  position_2 text not null,
  position_3 text not null,
  created_at timestamptz not null default now(),
  constraint registrations_idempotency_key_unique unique (idempotency_key),
  constraint registrations_photo_object_path_unique unique (photo_object_path),
  constraint registrations_name_length check (char_length(btrim(name)) between 2 and 120),
  constraint registrations_game_id_length check (char_length(btrim(game_id)) between 2 and 64),
  constraint registrations_instagram_format check (
    instagram = lower(instagram) and instagram ~ '^[a-z0-9._]{1,30}$'
  ),
  constraint registrations_whatsapp_format check (whatsapp ~ '^[1-9][0-9]{9,14}$'),
  constraint registrations_shirt_size_allowed check (
    shirt_size in ('PP', 'P', 'M', 'G', 'GG', 'XGG')
  ),
  constraint registrations_shirt_number_range check (shirt_number between 1 and 99),
  constraint registrations_photo_mime_type_allowed check (
    photo_mime_type in ('image/jpeg', 'image/png', 'image/webp')
  ),
  constraint registrations_photo_size_range check (photo_size_bytes between 1 and 5242880),
  constraint registrations_photo_path_format check (
    photo_object_path ~ '^registrations/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$'
  ),
  constraint registrations_position_1_allowed check (
    position_1 in ('GK', 'RB', 'CB', 'LB', 'RWB', 'LWB', 'CDM', 'CM', 'CAM', 'RM', 'LM', 'RW', 'LW', 'CF', 'ST')
  ),
  constraint registrations_position_2_allowed check (
    position_2 in ('GK', 'RB', 'CB', 'LB', 'RWB', 'LWB', 'CDM', 'CM', 'CAM', 'RM', 'LM', 'RW', 'LW', 'CF', 'ST')
  ),
  constraint registrations_position_3_allowed check (
    position_3 in ('GK', 'RB', 'CB', 'LB', 'RWB', 'LWB', 'CDM', 'CM', 'CAM', 'RM', 'LM', 'RW', 'LW', 'CF', 'ST')
  ),
  constraint registrations_positions_distinct check (
    position_1 <> position_2 and position_1 <> position_3 and position_2 <> position_3
  )
);

create unique index if not exists registrations_game_id_lower_unique
  on public.registrations (lower(game_id));

create unique index if not exists registrations_whatsapp_unique
  on public.registrations (whatsapp);

create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

alter table public.registrations enable row level security;
alter table public.registrations force row level security;

revoke all privileges on table public.registrations from public, anon, authenticated;
grant select, insert, update, delete on table public.registrations to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'registration-photos',
  'registration-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

commit;
