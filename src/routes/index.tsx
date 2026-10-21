import { createFileRoute, Link } from "@tanstack/react-router";
import { BookHeart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODULES } from "@/lib/modules";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RUANG BK — SMP Negeri 3 Tempel" },
      { name: "description", content: "Aplikasi pengelolaan layanan Bimbingan dan Konseling SMP Negeri 3 Tempel." },
      { property: "og:title", content: "RUANG BK — SMP Negeri 3 Tempel" },
      { property: "og:description", content: "Kelola data siswa, konseling, pelanggaran, program BK, dan laporan dalam satu tempat." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16 text-primary-foreground">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground text-primary">
          <BookHeart className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">SMP Negeri 3 Tempel</p>
        <h1 className="mt-2 text-5xl font-extrabold md:text-6xl">RUANG BK</h1>
        <p className="mt-4 max-w-xl text-lg opacity-90">
          Tempat guru Bimbingan dan Konseling mencatat, menyimpan, dan mencetak administrasi layanan BK dengan mudah.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" variant="secondary">
            <Link to="/auth">
              Masuk ke Aplikasi <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-5">
          {MODULES.map((m) => (
            <div key={m.slug} className="rounded-xl bg-primary-foreground/10 p-3 text-sm backdrop-blur">
              <m.icon className="mb-2 h-5 w-5" />
              {m.short}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
