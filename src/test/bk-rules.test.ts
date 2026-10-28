import { describe, expect, it } from "vitest";
import { FUNGSI_LAYANAN, JENIS_PER_KATEGORI, KATEGORI_LAYANAN, getModule } from "@/lib/modules";
import { PRINCIPAL, studentIdentity } from "@/lib/print";

describe("Ketentuan lampiran BK", () => {
  it("menyediakan enam fungsi pada kedua layanan konseling", () => {
    const values = ["Pemahaman", "Fasilitasi", "Penyesuaian", "Penyaluran", "Adaptasi", "Pencegahan"];
    expect(FUNGSI_LAYANAN).toEqual(values);
    for (const slug of ["konseling-individu", "konseling-kelompok"]) {
      expect(getModule(slug)?.fields.find((f) => f.name === "fungsi_layanan")?.options).toEqual(values);
    }
  });
  it("memuat identitas sesi dan periode pada kedua jenis konseling", () => {
    for (const slug of ["konseling-individu", "konseling-kelompok"]) {
      expect(getModule(slug)?.fields.map((f) => f.name)).toEqual(expect.arrayContaining(["kelas", "tanggal", "waktu", "tempat", "semester", "tahun_pelajaran"]));
    }
  });
  it("memisahkan empat komponen program tanpa membuat penyimpanan ganda", () => {
    expect(KATEGORI_LAYANAN).toEqual(["Layanan Dasar", "Layanan Peminatan dan Perencanaan Individual", "Layanan Responsif", "Dukungan Sistem"]);
    expect(getModule("layanan-dasar")?.category).toBe("Layanan Dasar");
    expect(getModule("peminatan")?.category).toBe("Layanan Peminatan dan Perencanaan Individual");
    expect(getModule("dukungan-sistem")?.category).toBe("Dukungan Sistem");
    for (const slug of ["layanan-dasar", "peminatan", "dukungan-sistem"]) expect(getModule(slug)?.table).toBe("layanan");
  });
  it("mencakup seluruh alat asesmen yang diminta", () => {
    expect(JENIS_PER_KATEGORI["Layanan Dasar"]).toEqual(expect.arrayContaining(["Pedoman Wawancara", "Pedoman Observasi", "Angket Sosiometri", "Daftar Hadir Peserta Didik/Konseli", "Leger", "Inventori Tugas-tugas Perkembangan (ITP)", "Psikotes", "Alat Ungkap Masalah (AUM)"]));
  });
  it("mempertahankan layanan lama dan menambahkan referral", () => {
    expect(JENIS_PER_KATEGORI["Layanan Responsif"]).toEqual(expect.arrayContaining(["Konsultasi", "Konferensi Kasus", "Kolaborasi", "Home Visit", "Alih Tangan Kasus (Referral)"]));
  });
  it("memuat empat jenis dukungan sistem", () => {
    expect(JENIS_PER_KATEGORI["Dukungan Sistem"]).toEqual(["Konsultasi", "Program Kerjasama", "Perencanaan dan Pelaksanaan Kegiatan Satuan Pendidikan", "Penelitian dan Pengembangan"]);
  });
  it("memuat seluruh tahapan peminatan dan pendampingan", () => {
    expect(JENIS_PER_KATEGORI["Layanan Peminatan dan Perencanaan Individual"]).toEqual(expect.arrayContaining(["Informasi Program Peminatan", "Pemetaan Peminatan — Pengumpulan Data", "Pemetaan Peminatan — Analisis Data", "Pemetaan Peminatan — Interpretasi Hasil", "Penetapan Peminatan Peserta Didik", "Layanan Lintas Minat", "Layanan Pendalaman Minat", "Layanan Pindah Minat", "Pendampingan — Bimbingan Klasikal", "Pendampingan — Bimbingan Kelompok", "Pendampingan — Konseling Individual", "Pendampingan — Konseling Kelompok", "Pendampingan — Konsultasi", "Pengembangan dan Penyaluran", "Evaluasi dan Tindak Lanjut"]));
  });
  it("menggunakan nama dan NIP kepala sekolah dari lampiran", () => {
    expect(PRINCIPAL).toEqual({ nama: "Mulasih, S.Pd.", nip: "19740301 200501 2 009" });
  });
  it("mengambil NISN tanpa menggantinya dengan NIS", () => {
    expect(studentIdentity({ siswa: { nama: "Siswa Uji", kelas: "VII B", nisn: "0012345678", nis: "5880" }, semester: "1", tahun_pelajaran: "2026/2027" })).toEqual({ nama: "Siswa Uji", kelas: "VII B", nisn: "0012345678", semester: "1", tahun: "2026/2027" });
    expect(studentIdentity({ siswa: { nis: "5880" } }).nisn).toBe("-");
  });
});