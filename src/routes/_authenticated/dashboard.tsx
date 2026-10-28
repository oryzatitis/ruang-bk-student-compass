import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileBarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MODULES } from "@/lib/modules";
import { profileQuery } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Beranda — RUANG BK" }, { name: "description", content: "Beranda layanan dan administrasi BK SMP Negeri 3 Tempel." }, { property: "og:title", content: "Beranda — RUANG BK" }, { property: "og:description", content: "Beranda layanan dan administrasi BK SMP Negeri 3 Tempel." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: profile } = useQuery(profileQuery);
  const { data: counts } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await Promise.all(MODULES.map((m) => {
        const query = supabase.from(m.table).select("id", { count: "exact", head: true });
        return m.category ? supabase.from("layanan").select("id", { count: "exact", head: true }).eq("kategori", m.category) : query;
      }));
      return Object.fromEntries(MODULES.map((m, i) => [m.slug, res[i]?.count ?? 0]));
    },
  });

  return (
    <div>
      <div className="mb-8 rounded-2xl bg-hero p-6 text-primary-foreground md:p-8">
        <p className="text-sm opacity-80">Selamat datang,</p>
        <h1 className="text-2xl font-bold md:text-3xl">{profile?.nama || "Guru BK"}</h1>
        <p className="mt-1 text-sm opacity-80">Pilih menu di bawah untuk mulai mencatat layanan BK.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {MODULES.map((m) => (
          <Link key={m.slug} to="/m/$modul" params={{ modul: m.slug }} className="group rounded-xl border bg-card p-4 transition hover:border-primary hover:shadow-md">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <m.icon className="h-5 w-5" />
            </div>
            <div className="font-semibold">{m.short}</div>
            <div className="text-2xl font-bold text-primary">{counts?.[m.slug] ?? "…"}</div>
            <div className="text-xs text-muted-foreground">data tersimpan</div>
          </Link>
        ))}
        <Link to="/laporan" className="group rounded-xl border bg-card p-4 transition hover:border-primary hover:shadow-md">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <FileBarChart className="h-5 w-5" />
          </div>
          <div className="font-semibold">Laporan BK</div>
          <div className="text-xs text-muted-foreground">Rekap & cetak laporan per periode</div>
        </Link>
      </div>
    </div>
  );
}
