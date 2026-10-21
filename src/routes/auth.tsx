import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookHeart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk — RUANG BK" },
      { name: "description", content: "Masuk ke aplikasi RUANG BK SMP Negeri 3 Tempel." },
      { property: "og:title", content: "Masuk — RUANG BK" },
      { property: "og:description", content: "Halaman masuk guru BK SMP Negeri 3 Tempel." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error("Email atau kata sandi salah"); return; }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookHeart className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">RUANG BK</h1>
          <p className="text-sm text-muted-foreground">SMP Negeri 3 Tempel</p>
        </div>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Masuk
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">Akun guru BK dibuat oleh admin sekolah.</p>
      </div>
    </div>
  );
}
