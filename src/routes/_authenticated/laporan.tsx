import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Printer, FileBarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MODULES } from "@/lib/modules";
import { formatTanggal } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrintKop, PrintTtd } from "@/components/PrintKop";

export const Route = createFileRoute("/_authenticated/laporan")({
  head: () => ({ meta: [{ title: "Laporan BK — RUANG BK" }, { name: "description", content: "Rekap kegiatan layanan BK per periode SMP Negeri 3 Tempel." }, { property: "og:title", content: "Laporan BK — RUANG BK" }, { property: "og:description", content: "Rekap kegiatan layanan BK per periode SMP Negeri 3 Tempel." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Laporan,
});

const BIDANG = ["Pribadi", "Sosial", "Belajar", "Karier"];
const DATED = MODULES.filter((m) => m.hasDate && m.slug !== "dokumen" && !m.category);

function Laporan() {
  const now = new Date();
  const [from, setFrom] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [to, setTo] = useState(now.toISOString().slice(0, 10));

  const { data, isLoading } = useQuery({
    queryKey: ["laporan", from, to],
    queryFn: async () => {
      const results = await Promise.all(
        DATED.map((m) =>
          (supabase.from(m.table) as any)
            .select(m.fields.some((f) => f.type === "siswa") ? "*, siswa(nama,kelas)" : "*")
            .gte("tanggal", from)
            .lte("tanggal", to)
            .order("tanggal"),
        ),
      );
      return Object.fromEntries(DATED.map((m, i) => [m.slug, (results[i].data ?? []) as any[]]));
    },
  });

  const ki = data?.["konseling-individu"] ?? [];
  const kk = data?.["konseling-kelompok"] ?? [];
  const pl = data?.["pelanggaran"] ?? [];
  const ly = data?.["layanan"] ?? [];

  return (
    <div>
      <div className="no-print mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <FileBarChart className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Laporan BK</h1>
            <p className="text-sm text-muted-foreground">Pilih periode, lalu klik Cetak Laporan.</p>
          </div>
        </div>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Cetak Laporan
        </Button>
      </div>

      <div className="no-print mb-4 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Dari tanggal</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Sampai tanggal</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="print-area rounded-xl border bg-card p-4 md:p-6">
        <PrintKop title="Laporan Pelaksanaan Layanan BK" subtitle={`Periode ${formatTanggal(from)} s.d. ${formatTanggal(to)}`} />
        {isLoading ? (
          <p className="text-muted-foreground">Memuat...</p>
        ) : (
          <div className="grid gap-8">
            <section>
              <h2 className="mb-2 font-bold">A. Rekapitulasi Kegiatan</h2>
              <table className="print-table w-full text-sm">
                <thead>
                  <tr className="bg-primary-soft text-left">
                    <th className="px-3 py-2">No</th>
                    <th className="px-3 py-2">Jenis Kegiatan</th>
                    <th className="px-3 py-2 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {DATED.map((m, i) => (
                    <tr key={m.slug} className="border-b">
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{m.title}</td>
                      <td className="px-3 py-2 text-right font-semibold">{data?.[m.slug]?.length ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="mb-2 font-bold">B. Konseling Individu per Bidang Layanan</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 print:grid-cols-4">
                {BIDANG.map((b) => (
                  <div key={b} className="rounded-lg border p-3 text-center">
                    <div className="text-xs text-muted-foreground">{b}</div>
                    <div className="text-2xl font-bold text-primary">{ki.filter((r) => r.bidang === b).length}</div>
                  </div>
                ))}
              </div>
            </section>

            <DetailTable
              title="C. Daftar Konseling Individu"
              rows={ki}
              cols={[["Tanggal", (r) => formatTanggal(r.tanggal)], ["Siswa", (r) => r.siswa?.nama ?? "-"], ["Kelas", (r) => r.siswa?.kelas ?? "-"], ["Bidang", (r) => r.bidang], ["Masalah", (r) => r.masalah], ["Hasil", (r) => r.hasil]]}
            />
            <DetailTable
              title="D. Daftar Konseling Kelompok"
              rows={kk}
              cols={[["Tanggal", (r) => formatTanggal(r.tanggal)], ["Topik", (r) => r.topik], ["Bidang", (r) => r.bidang], ["Anggota", (r) => r.anggota], ["Hasil", (r) => r.hasil]]}
            />
            <DetailTable
              title="E. Daftar Pelanggaran & Pembinaan"
              rows={pl}
              cols={[["Tanggal", (r) => formatTanggal(r.tanggal)], ["Siswa", (r) => r.siswa?.nama ?? "-"], ["Kelas", (r) => r.siswa?.kelas ?? "-"], ["Pelanggaran", (r) => r.jenis], ["Poin", (r) => r.poin], ["Pembinaan", (r) => r.pembinaan], ["Status", (r) => r.status]]}
            />
            <DetailTable
              title="F. Daftar Layanan dan Kegiatan Program BK"
              rows={ly}
              cols={[["Tanggal", (r) => formatTanggal(r.tanggal)], ["Kelompok", (r) => r.kategori], ["Jenis", (r) => r.jenis], ["Judul", (r) => r.judul], ["Pihak Terlibat", (r) => r.peserta], ["Tindak Lanjut", (r) => r.tindak_lanjut]]}
            />
          </div>
        )}
        <PrintTtd />
      </div>
    </div>
  );
}

function DetailTable({ title, rows, cols }: { title: string; rows: any[]; cols: [string, (r: any) => any][] }) {
  return (
    <section>
      <h2 className="mb-2 font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Tidak ada data pada periode ini.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="print-table w-full text-sm">
            <thead>
              <tr className="bg-primary-soft text-left">
                <th className="px-3 py-2">No</th>
                {cols.map(([h]) => (
                  <th key={h} className="px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b align-top">
                  <td className="px-3 py-2">{i + 1}</td>
                  {cols.map(([h, fn]) => (
                    <td key={h} className="px-3 py-2">{fn(r) || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
