export const SCHOOL = {
  name: "SEKOLAH MENENGAH PERTAMA NEGERI 3 TEMPEL",
  address: "Alamat: Pondokrejo, Tempel, Sleman, Yogyakarta 55552 Telp. 081 1295 8830",
  contact: "E-mail: smpn3tempel@gmail.com Website: www.smpn3tempel.sch.id",
};
export const PRINCIPAL = { nama: "Mulasih, S.Pd.", nip: "19740301 200501 2 009" };
export function studentIdentity(row: { siswa?: { nama?: string; kelas?: string; nisn?: string; nis?: string }; nama_konseli?: string; anggota?: string; nama?: string; kelas?: string; nisn?: string; semester?: string; tahun_pelajaran?: string }) {
  return {
    nama: row.siswa?.nama || row.nama_konseli || row.anggota || row.nama || "-",
    kelas: row.kelas || row.siswa?.kelas || "-",
    nisn: row.siswa?.nisn || row.nisn || "-",
    semester: row.semester || "-",
    tahun: row.tahun_pelajaran || "-",
  };
}