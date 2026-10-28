ALTER TABLE public.profiles ADD COLUMN kepala_sekolah text NOT NULL DEFAULT 'Mulasih, S.Pd.', ADD COLUMN nip_kepala_sekolah text NOT NULL DEFAULT '19740301 200501 2 009';
ALTER TABLE public.siswa ADD COLUMN nisn text;
ALTER TABLE public.konseling_individu ADD COLUMN kelas text, ADD COLUMN waktu text, ADD COLUMN tempat text, ADD COLUMN fungsi_layanan text, ADD COLUMN semester text, ADD COLUMN tahun_pelajaran text;
ALTER TABLE public.konseling_kelompok ADD COLUMN nama_konseli text, ADD COLUMN kelas text, ADD COLUMN waktu text, ADD COLUMN tempat text, ADD COLUMN fungsi_layanan text, ADD COLUMN semester text, ADD COLUMN tahun_pelajaran text;
UPDATE public.konseling_individu k SET kelas = s.kelas FROM public.siswa s WHERE s.id = k.siswa_id AND k.kelas IS NULL;
UPDATE public.konseling_kelompok SET nama_konseli = anggota WHERE nama_konseli IS NULL;