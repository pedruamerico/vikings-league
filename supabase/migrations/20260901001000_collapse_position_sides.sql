begin;

alter table public.registrations
  drop constraint if exists registrations_position_1_allowed,
  drop constraint if exists registrations_position_2_allowed,
  drop constraint if exists registrations_position_3_allowed;

update public.registrations
set position_1 = case
  when position_1 in ('RB', 'LB') then 'FB'
  when position_1 in ('RWB', 'LWB', 'RM', 'LM') then 'WB'
  when position_1 in ('RW', 'LW') then 'W'
  else position_1
end
where position_1 in ('RB', 'LB', 'RWB', 'LWB', 'RM', 'LM', 'RW', 'LW');

update public.registrations
set position_2 = case
  when position_2 in ('RB', 'LB') then 'FB'
  when position_2 in ('RWB', 'LWB', 'RM', 'LM') then 'WB'
  when position_2 in ('RW', 'LW') then 'W'
  else position_2
end
where position_2 in ('RB', 'LB', 'RWB', 'LWB', 'RM', 'LM', 'RW', 'LW');

update public.registrations
set position_3 = case
  when position_3 in ('RB', 'LB') then 'FB'
  when position_3 in ('RWB', 'LWB', 'RM', 'LM') then 'WB'
  when position_3 in ('RW', 'LW') then 'W'
  else position_3
end
where position_3 in ('RB', 'LB', 'RWB', 'LWB', 'RM', 'LM', 'RW', 'LW');

alter table public.registrations
  add constraint registrations_position_1_allowed
    check (position_1 in ('GK', 'CB', 'FB', 'WB', 'CDM', 'CM', 'CAM', 'W', 'CF', 'ST')),
  add constraint registrations_position_2_allowed
    check (position_2 in ('GK', 'CB', 'FB', 'WB', 'CDM', 'CM', 'CAM', 'W', 'CF', 'ST')),
  add constraint registrations_position_3_allowed
    check (position_3 in ('GK', 'CB', 'FB', 'WB', 'CDM', 'CM', 'CAM', 'W', 'CF', 'ST'));

commit;
