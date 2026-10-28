import type { ModuleDef } from "@/lib/modules";
import { formatTanggal } from "@/lib/data";
import { studentIdentity } from "@/lib/print";
import { PrintKop, PrintTtd } from "./PrintKop";

export function RecordPrint({ module: m, row }: { module: ModuleDef; row: Record<string, any> }) {
  const identity = studentIdentity(row);
  const hasIdentity = m.fields.some((f) => f.type === "siswa") || ["siswa", "konseling-kelompok"].includes(m.slug);
  const excluded = ["siswa_id", "nama_konseli", "anggota", "kelas", "semester", "tahun_pelajaran", "nisn"];
  return <div className="print-only single-record print-area">
    <PrintKop title="" />
    {hasIdentity && <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
      <div>Nama: {identity.nama}</div><div>Kelas: {identity.kelas}</div>
      <div>NISN: {identity.nisn}</div><div>Semester: {identity.semester}</div>
      <div>Nama Sekolah: SMP NEGERI 3 TEMPEL</div><div>Tahun Pelajaran: {identity.tahun}</div>
    </div>}
    <h2 className="mb-4 text-center text-base font-bold uppercase">Laporan {m.title}</h2>
    <table className="print-table w-full text-sm"><tbody>
      {m.fields.filter((f) => !hasIdentity || !excluded.includes(f.name)).map((f) => <tr key={f.name}>
        <th className="w-1/3 text-left">{f.label}</th>
        <td className="whitespace-pre-wrap">{f.type === "date" ? `${row[f.name] ? new Date(row[f.name] + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long" }) + ", " : ""}${formatTanggal(row[f.name])}` : f.type === "file" ? (row[f.name] ? "Ada berkas" : "-") : row[f.name] || "-"}</td>
      </tr>)}
    </tbody></table>
    <PrintTtd />
  </div>;
}