import {
  Users,
  ClipboardCheck,
  DoorOpen,
  MessageCircle,
  UsersRound,
  ShieldAlert,
  CalendarRange,
  ListChecks,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

export type FieldType = "text" | "textarea" | "date" | "number" | "select" | "siswa" | "file";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  showInTable?: boolean;
  placeholder?: string;
}

export type TableName =
  | "siswa"
  | "daftar_hadir"
  | "kunjungan"
  | "konseling_individu"
  | "konseling_kelompok"
  | "pelanggaran"
  | "program_bk"
  | "akpd"
  | "dokumen";

export interface ModuleDef {
  slug: string;
  table: TableName;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  fields: Field[];
  orderBy: string;
  hasDate: boolean;
}

const BIDANG = ["Pribadi", "Sosial", "Belajar", "Karier"];
const KELAS = ["VII A", "VII B", "VII C", "VII D", "VII E", "VIII A", "VIII B", "VIII C", "VIII D", "VIII E", "IX A", "IX B", "IX C", "IX D", "IX E"];

export const MODULES: ModuleDef[] = [
  {
    slug: "siswa",
    table: "siswa",
    title: "Data Siswa",
    short: "Data Siswa",
    description: "Daftar siswa yang Anda bimbing.",
    icon: Users,
    orderBy: "nama",
    hasDate: false,
    fields: [
      { name: "nis", label: "NIS", type: "text", showInTable: true },
      { name: "nama", label: "Nama Lengkap", type: "text", required: true, showInTable: true },
      { name: "kelas", label: "Kelas", type: "select", options: KELAS, showInTable: true },
      { name: "jenis_kelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"], showInTable: true },
      { name: "nama_ortu", label: "Nama Orang Tua", type: "text", showInTable: true },
      { name: "telepon", label: "No. HP Orang Tua", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
    ],
  },
  {
    slug: "daftar-hadir",
    table: "daftar_hadir",
    title: "Daftar Hadir Siswa",
    short: "Daftar Hadir",
    description: "Catat kehadiran siswa dalam layanan BK.",
    icon: ClipboardCheck,
    orderBy: "tanggal",
    hasDate: true,
    fields: [
      { name: "tanggal", label: "Tanggal", type: "date", required: true, showInTable: true },
      { name: "siswa_id", label: "Siswa", type: "siswa", required: true, showInTable: true },
      { name: "kegiatan", label: "Kegiatan / Layanan", type: "text", showInTable: true, placeholder: "Contoh: Layanan klasikal" },
      { name: "status", label: "Status", type: "select", options: ["Hadir", "Izin", "Sakit", "Alpa"], showInTable: true },
      { name: "keterangan", label: "Keterangan", type: "textarea" },
    ],
  },
  {
    slug: "kunjungan",
    table: "kunjungan",
    title: "Kunjungan BK",
    short: "Kunjungan BK",
    description: "Buku tamu siswa yang datang ke ruang BK.",
    icon: DoorOpen,
    orderBy: "tanggal",
    hasDate: true,
    fields: [
      { name: "tanggal", label: "Tanggal", type: "date", required: true, showInTable: true },
      { name: "siswa_id", label: "Siswa", type: "siswa", required: true, showInTable: true },
      { name: "keperluan", label: "Keperluan", type: "textarea", showInTable: true },
      { name: "tindak_lanjut", label: "Tindak Lanjut", type: "textarea", showInTable: true },
    ],
  },
  {
    slug: "konseling-individu",
    table: "konseling_individu",
    title: "Konseling Individu",
    short: "Konseling Individu",
    description: "Catatan layanan konseling perorangan.",
    icon: MessageCircle,
    orderBy: "tanggal",
    hasDate: true,
    fields: [
      { name: "tanggal", label: "Tanggal", type: "date", required: true, showInTable: true },
      { name: "siswa_id", label: "Siswa", type: "siswa", required: true, showInTable: true },
      { name: "bidang", label: "Bidang Layanan", type: "select", options: BIDANG, showInTable: true },
      { name: "masalah", label: "Permasalahan", type: "textarea", showInTable: true },
      { name: "tindakan", label: "Tindakan / Pendekatan", type: "textarea" },
      { name: "hasil", label: "Hasil", type: "textarea", showInTable: true },
    ],
  },
  {
    slug: "konseling-kelompok",
    table: "konseling_kelompok",
    title: "Konseling Kelompok",
    short: "Konseling Kelompok",
    description: "Catatan layanan konseling dan bimbingan kelompok.",
    icon: UsersRound,
    orderBy: "tanggal",
    hasDate: true,
    fields: [
      { name: "tanggal", label: "Tanggal", type: "date", required: true, showInTable: true },
      { name: "topik", label: "Topik / Masalah", type: "text", required: true, showInTable: true },
      { name: "bidang", label: "Bidang Layanan", type: "select", options: BIDANG, showInTable: true },
      { name: "anggota", label: "Anggota Kelompok", type: "textarea", showInTable: true, placeholder: "Tulis nama siswa, pisahkan dengan koma" },
      { name: "hasil", label: "Hasil", type: "textarea", showInTable: true },
    ],
  },
  {
    slug: "pelanggaran",
    table: "pelanggaran",
    title: "Pelanggaran & Pembinaan",
    short: "Pelanggaran",
    description: "Catatan pelanggaran tata tertib dan pembinaannya.",
    icon: ShieldAlert,
    orderBy: "tanggal",
    hasDate: true,
    fields: [
      { name: "tanggal", label: "Tanggal", type: "date", required: true, showInTable: true },
      { name: "siswa_id", label: "Siswa", type: "siswa", required: true, showInTable: true },
      { name: "jenis", label: "Jenis Pelanggaran", type: "text", showInTable: true },
      { name: "poin", label: "Poin", type: "number", showInTable: true },
      { name: "pembinaan", label: "Bentuk Pembinaan", type: "textarea", showInTable: true },
      { name: "status", label: "Status", type: "select", options: ["Proses", "Selesai"], showInTable: true },
    ],
  },
  {
    slug: "program-bk",
    table: "program_bk",
    title: "Program BK & RPL",
    short: "Program & RPL",
    description: "Program tahunan, semesteran, dan Rencana Pelaksanaan Layanan.",
    icon: CalendarRange,
    orderBy: "created_at",
    hasDate: false,
    fields: [
      { name: "jenis", label: "Jenis", type: "select", options: ["Program Tahunan", "Program Semester", "RPL"], required: true, showInTable: true },
      { name: "judul", label: "Judul / Topik", type: "text", required: true, showInTable: true },
      { name: "bidang", label: "Bidang Layanan", type: "select", options: BIDANG, showInTable: true },
      { name: "kelas", label: "Kelas Sasaran", type: "text", showInTable: true },
      { name: "waktu", label: "Waktu Pelaksanaan", type: "text", showInTable: true, placeholder: "Contoh: Agustus 2026 / Minggu ke-2" },
      { name: "tujuan", label: "Tujuan Layanan", type: "textarea" },
      { name: "keterangan", label: "Keterangan / Langkah Kegiatan", type: "textarea" },
    ],
  },
  {
    slug: "akpd",
    table: "akpd",
    title: "Angket AKPD",
    short: "Angket AKPD",
    description: "Hasil Angket Kebutuhan Peserta Didik.",
    icon: ListChecks,
    orderBy: "tanggal",
    hasDate: true,
    fields: [
      { name: "tanggal", label: "Tanggal Pengisian", type: "date", required: true, showInTable: true },
      { name: "siswa_id", label: "Siswa", type: "siswa", required: true, showInTable: true },
      { name: "bidang_prioritas", label: "Bidang Prioritas", type: "select", options: BIDANG, showInTable: true },
      { name: "butir_masalah", label: "Butir Kebutuhan / Masalah", type: "textarea", showInTable: true },
      { name: "catatan", label: "Catatan Guru BK", type: "textarea" },
    ],
  },
  {
    slug: "dokumen",
    table: "dokumen",
    title: "Dokumen BK",
    short: "Dokumen BK",
    description: "Simpan berkas: surat panggilan, format, SK, dan lainnya.",
    icon: FolderOpen,
    orderBy: "tanggal",
    hasDate: true,
    fields: [
      { name: "tanggal", label: "Tanggal", type: "date", required: true, showInTable: true },
      { name: "judul", label: "Judul Dokumen", type: "text", required: true, showInTable: true },
      { name: "kategori", label: "Kategori", type: "select", options: ["Surat", "Administrasi", "Format Layanan", "Lainnya"], showInTable: true },
      { name: "file_path", label: "Berkas", type: "file", showInTable: true },
      { name: "keterangan", label: "Keterangan", type: "textarea" },
    ],
  },
];

export const getModule = (slug: string) => MODULES.find((m) => m.slug === slug);
