import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookHeart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/atur-sandi")({
  head: () => ({
    meta: [
      { title: "Buat Kata Sandi — RUANG BK" },
      { name: "description", content: "Buat kata sandi akun RUANG BK dari email undangan." },
      { property: "og:title", content: "Buat Kata Sandi — RUANG BK" },
      { property: "og:description", content: "Aktifkan akun guru BK SMP Negeri 3 Tempel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AturSandi,
});

function AturSandi() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setReady(!!data.session);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Kata sandi minimal 8 karakter");
    if (pw !== pw2) return toast.error("Kata sandi tidak sama");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error("Gagal menyimpan kata sandi. Coba lagi.");
    toast.success("Kata sandi tersimpan");
    navigate({ to: "/profil" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookHeart className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Buat Kata Sandi</h1>
          <p className="text-sm text-muted-foreground">RUANG BK — SMP Negeri 3 Tempel</p>
        </div>
        {ready === null && <p className="text-center text-sm text-muted-foreground">Memeriksa undangan…</p>}
        {ready === false && (
          <p className="text-center text-sm text-muted-foreground">
            Tautan undangan tidak berlaku atau sudah kedaluwarsa. Minta Administrator mengirim undangan baru.
          </p>
        )}
        {ready && (
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="pw">Kata sandi baru</Label>
              <Input id="pw" type="password" autoComplete="new-password" required value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pw2">Ulangi kata sandi</Label>
              <Input id="pw2" type="password" autoComplete="new-password" required value={pw2} onChange={(e) => setPw2(e.target.value)} />
            </div>
            <Button type="submit" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Simpan Kata Sandi
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
