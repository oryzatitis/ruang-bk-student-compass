import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/import-siswa")({
  head: () => ({ meta: [{ title: "Impor Data Siswa — RUANG BK" }] }),
  component: ImportSiswa,
});

type Row = { nis: string; nama: string; kelas: string; jenis_kelamin: string; nama_ortu: string; telepon: string; alamat: string };

const KOLOM: [keyof Row, string][] = [
  ["nis", "NIS"],
  ["nama", "Nama"],
  ["kelas", "Kelas"],
  ["jenis_kelamin", "Jenis Kelamin"],
  ["nama_ortu", "Nama Orang Tua"],
  ["telepon", "No. HP Orang Tua"],
  ["alamat", "Alamat"],
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
const ALIAS: Record<string, keyof Row> = {
  nis: "nis", nisn: "nis",
  nama: "nama", namalengkap: "nama", namasiswa: "nama",
  kelas: "kelas",
  jeniskelamin: "jenis_kelamin", jk: "jenis_kelamin", gender: "jenis_kelamin",
  namaortu: "nama_ortu", namaorangtua: "nama_ortu", orangtua: "nama_ortu", wali: "nama_ortu",
  telepon: "telepon", nohp: "telepon", nohportu: "telepon", hp: "telepon", telp: "telepon",
  alamat: "alamat",
};

function unduhContoh() {
  const ws = XLSX.utils.aoa_to_sheet([
    KOLOM.map(([, label]) => label),
    ["12345", "Contoh Nama Siswa", "VII A", "Laki-laki", "Nama Orang Tua", "081234567890", "Tempel, Sleman"],
  ]);
  ws["!cols"] = KOLOM.map(() => ({ wch: 20 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Siswa");
  XLSX.writeFile(wb, "contoh-data-siswa.xlsx");
}

function ImportSiswa() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [namaFile, setNamaFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const bacaFile = async (f: File) => {
    setLoading(true);
    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf);
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[wb.SheetNames[0]], { defval: "" });
      if (json.length === 0) {
        toast.error("File tidak berisi data. Pastikan baris pertama adalah judul kolom.");
        return;
      }
      const hasil: Row[] = json.map((r) => {
        const out: Row = { nis: "", nama: "", kelas: "", jenis_kelamin: "", nama_ortu: "", telepon: "", alamat: "" };
        for (const [k, v] of Object.entries(r)) {
          const target = ALIAS[norm(k)];
          if (target) out[target] = String(v ?? "").trim();
        }
        const jk = out.jenis_kelamin.toLowerCase();
        if (jk === "l" || jk === "laki" || jk === "lakilaki") out.jenis_kelamin = "Laki-laki";
        else if (jk === "p" || jk === "perempuan") out.jenis_kelamin = "Perempuan";
        return out;
      });
      const valid = hasil.filter((r) => r.nama);
      if (valid.length === 0) {
        toast.error("Tidak ada baris dengan kolom Nama terisi. Periksa judul kolom pada file Anda.");
        return;
      }
      setRows(valid);
      setNamaFile(f.name);
      toast.success(`${valid.length} data siswa siap diimpor`);
    } catch {
      toast.error("File tidak dapat dibaca. Gunakan file .xlsx atau .xls");
    } finally {
      setLoading(false);
    }
  };

  const simpan = async () => {
    if (!rows) return;
    setSaving(true);
    const { error } = await supabase.from("siswa").insert(rows);
    setSaving(false);
    if (error) {
      toast.error("Gagal menyimpan data. Coba lagi.");
      return;
    }
    toast.success(`${rows.length} data siswa berhasil disimpan`);
    qc.invalidateQueries({ queryKey: ["module", "siswa"] });
    qc.invalidateQueries({ queryKey: ["siswa-list"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
    navigate({ to: "/m/$modul", params: { modul: "siswa" } });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Impor Data Siswa dari Excel</h1>
            <p className="text-sm text-muted-foreground">Unggah file Excel, periksa hasilnya, lalu simpan sekaligus.</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link to="/m/$modul" params={{ modul: "siswa" }}>
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
      </div>

      <div className="mb-4 grid gap-3 rounded-xl border bg-card p-4">
        <p className="text-sm">
          <b>Langkah 1.</b> Unduh file contoh agar susunan kolomnya benar, atau gunakan file Anda sendiri dengan judul kolom:{" "}
          <b>NIS, Nama, Kelas, Jenis Kelamin, Nama Orang Tua, No. HP Orang Tua, Alamat</b>.
        </p>
        <p className="text-sm">
          <b>Langkah 2.</b> Pilih file Excel (.xlsx / .xls), lalu periksa data yang terbaca di bawah.
        </p>
        <p className="text-sm">
          <b>Langkah 3.</b> Klik <b>Simpan Semua</b> untuk memasukkan data ke aplikasi.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={unduhContoh}>
            <FileSpreadsheet className="h-4 w-4" /> Unduh File Contoh
          </Button>
          <Input
            type="file"
            accept=".xlsx,.xls"
            className="max-w-xs"
            disabled={loading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) bacaFile(f);
              e.target.value = "";
            }}
          />
          {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
      </div>

      {rows && (
        <div className="rounded-xl border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
            <p className="text-sm">
              <b>{rows.length} data</b> terbaca dari <b>{namaFile}</b>. Periksa kembali sebelum menyimpan.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRows(null)}>
                Batal
              </Button>
              <Button onClick={simpan} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Simpan Semua
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-primary-soft text-left">
                  <th className="px-3 py-3 font-semibold">No</th>
                  {KOLOM.map(([, label]) => (
                    <th key={label} className="px-3 py-3 font-semibold">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-3 py-2">{i + 1}</td>
                    {KOLOM.map(([k]) => (
                      <td key={k} className="max-w-xs px-3 py-2 align-top">{r[k] || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
