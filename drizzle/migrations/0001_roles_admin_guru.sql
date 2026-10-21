create type public.app_role as enum ('admin', 'guru_bk');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Read-only for users: they see their own roles; admins see all. No insert/update/delete
-- policies, so nobody can change roles from the app; changes go through server code only.
create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admin reads roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "admin reads profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama) values (new.id, coalesce(new.raw_user_meta_data->>'nama', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'guru_bk') on conflict do nothing;
  return new;
end;
$$;

insert into public.user_roles (user_id, role) select id, 'guru_bk' from auth.users on conflict do nothing;
