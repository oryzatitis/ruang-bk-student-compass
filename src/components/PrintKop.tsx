import { useQuery } from "@tanstack/react-query";
import { profileQuery } from "@/lib/data";
import logo from "@/assets/logo-sleman.asset.json";
import { SCHOOL, PRINCIPAL } from "@/lib/print";

export function PrintKop({ title, subtitle }: { title: string; subtitle?: string | undefined }) {
  return (
    <div className="print-only mb-4 text-center">
      <div className="flex items-center gap-3">
        <img src={logo.url} alt="Lambang Kabupaten Sleman" className="h-24 w-20 shrink-0 object-contain" />
        <div className="flex-1">
          <div className="text-sm">PEMERINTAH KABUPATEN SLEMAN</div>
          <div className="text-sm">DINAS PENDIDIKAN</div>
          <div className="text-base font-bold">{SCHOOL.name}</div>
          <div className="text-xs">{SCHOOL.address}</div>
          <div className="text-xs">{SCHOOL.contact}</div>
        </div>
      </div>
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
    <div className="print-only mt-10 break-inside-avoid">
      <div className="grid grid-cols-2 gap-10 text-sm">
        <div>
          <div>Mengetahui,</div>
          <div>Kepala Sekolah</div>
          <div className="h-20" />
          <div className="font-semibold underline">{p?.kepala_sekolah || PRINCIPAL.nama}</div>
          <div>NIP. {p?.nip_kepala_sekolah || PRINCIPAL.nip}</div>
        </div>
        <div>
        <div>Tempel, {today}</div>
        <div>Guru Bimbingan dan Konseling</div>
        <div className="h-20" />
        <div className="font-semibold underline">{p?.nama || "...................................."}</div>
        <div>NIP. {p?.nip || "...................."}</div>
        </div>
      </div>
    </div>
  );
}
