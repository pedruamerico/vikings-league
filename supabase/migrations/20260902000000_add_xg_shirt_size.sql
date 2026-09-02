alter table public.registrations
  drop constraint registrations_shirt_size_allowed;

alter table public.registrations
  add constraint registrations_shirt_size_allowed check (
    shirt_size in ('PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG')
  );
