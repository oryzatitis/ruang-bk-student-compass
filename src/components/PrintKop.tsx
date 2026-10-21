import { useQuery } from "@tanstack/react-query";
import { profileQuery } from "@/lib/data";

export function PrintKop({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="print-only mb-4 text-center">
      <div className="text-sm font-semibold">PEMERINTAH KABUPATEN SLEMAN — DINAS PENDIDIKAN</div>
      <div className="text-lg font-bold">SMP NEGERI 3 TEMPEL</div>
      <div className="text-xs">Layanan Bimbingan dan Konseling — RUANG BK</div>
      <hr className="my-2 border-t-2 border-foreground" />
      <div className="mt-2 text-base font-bold uppercase">{title}</div>
      {subtitle && <div className="text-sm">{subtitle}</div>}
    </div>
  );
}

export function PrintTtd() {
  const { data: p } = useQuery(profileQuery);
  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="print-only mt-10">
      <div className="ml-auto w-64 text-sm">
        <div>Tempel, {today}</div>
        <div>Guru Bimbingan dan Konseling</div>
        <div className="h-20" />
        <div className="font-semibold underline">{p?.nama || "...................................."}</div>
        <div>NIP. {p?.nip || "...................."}</div>
      </div>
    </div>
  );
}
