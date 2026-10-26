CREATE TABLE public.layanan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  tanggal date not null default CURRENT_DATE,
  kategori text not null default 'Layanan Dasar',
  jenis text not null default 'Konsultasi',
  judul text not null,
  peserta text default '',
  deskripsi text default '',
  tindak_lanjut text default '',
  created_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.layanan TO authenticated;
GRANT ALL ON public.layanan TO service_role;

ALTER TABLE public.layanan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own select" ON public.layanan FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.layanan FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.layanan FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.layanan FOR DELETE TO authenticated USING (auth.uid() = user_id);