create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null default '',
  nip text default '',
  kelas_binaan text default '',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama) values (new.id, coalesce(new.raw_user_meta_data->>'nama', split_part(new.email,'@',1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.siswa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  nis text default '', nama text not null, kelas text default '', jenis_kelamin text default '',
  alamat text default '', nama_ortu text default '', telepon text default '',
  created_at timestamptz not null default now()
);
create table public.daftar_hadir (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(),
  tanggal date not null default current_date, siswa_id uuid references public.siswa(id) on delete cascade,
  kegiatan text default '', status text default 'Hadir', keterangan text default '',
  created_at timestamptz not null default now()
);
create table public.kunjungan (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(),
  tanggal date not null default current_date, siswa_id uuid references public.siswa(id) on delete cascade,
  keperluan text default '', tindak_lanjut text default '', created_at timestamptz not null default now()
);
create table public.konseling_individu (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(),
  tanggal date not null default current_date, siswa_id uuid references public.siswa(id) on delete cascade,
  bidang text default '', masalah text default '', tindakan text default '', hasil text default '',
  created_at timestamptz not null default now()
);
create table public.konseling_kelompok (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(),
  tanggal date not null default current_date, topik text not null, bidang text default '',
  anggota text default '', hasil text default '', created_at timestamptz not null default now()
);
create table public.pelanggaran (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(),
  tanggal date not null default current_date, siswa_id uuid references public.siswa(id) on delete cascade,
  jenis text default '', poin int default 0, pembinaan text default '', status text default 'Proses',
  created_at timestamptz not null default now()
);
create table public.program_bk (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(),
  jenis text default 'Program Tahunan', judul text not null, bidang text default '', kelas text default '',
  waktu text default '', tujuan text default '', keterangan text default '', created_at timestamptz not null default now()
);
create table public.akpd (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(),
  tanggal date not null default current_date, siswa_id uuid references public.siswa(id) on delete cascade,
  bidang_prioritas text default '', butir_masalah text default '', catatan text default '',
  created_at timestamptz not null default now()
);
create table public.dokumen (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(),
  tanggal date not null default current_date, judul text not null, kategori text default '',
  file_path text default '', keterangan text default '', created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['siswa','daftar_hadir','kunjungan','konseling_individu','konseling_kelompok','pelanggaran','program_bk','akpd','dokumen'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own select" on public.%I for select to authenticated using (auth.uid() = user_id)', t);
    execute format('create policy "own insert" on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
    execute format('create policy "own update" on public.%I for update to authenticated using (auth.uid() = user_id)', t);
    execute format('create policy "own delete" on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
  end loop;
end $$;

create policy "own files select" on storage.objects for select to authenticated using (bucket_id='dokumen-bk' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own files insert" on storage.objects for insert to authenticated with check (bucket_id='dokumen-bk' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own files delete" on storage.objects for delete to authenticated using (bucket_id='dokumen-bk' and (storage.foldername(name))[1] = auth.uid()::text);