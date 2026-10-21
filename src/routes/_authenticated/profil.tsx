import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({ meta: [{ title: "Profil Saya — RUANG BK" }] }),
  component: Profil,
});

function Profil() {
  const qc = useQueryClient();
  const { data } = useQuery(profileQuery);
  const [f, setF] = useState({ nama: "", nip: "", kelas_binaan: "" });
  const [pw, setPw] = useState({ lama: "", baru: "" });

  useEffect(() => {
    if (data) setF({ nama: data.nama, nip: data.nip, kelas_binaan: data.kelas_binaan });
  }, [data]);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").upsert({ id: u.user!.id, ...f });
    if (error) return toast.error("Gagal menyimpan profil");
    toast.success("Profil disimpan");
    qc.invalidateQueries({ queryKey: ["profile"] });
  };

  const gantiPw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.baru.length < 6) return toast.error("Kata sandi baru minimal 6 karakter");
    const { error } = await supabase.auth.updateUser({ password: pw.baru, current_password: pw.lama } as any);
    if (error) return toast.error("Gagal mengganti kata sandi: " + error.message);
    toast.success("Kata sandi diganti");
    setPw({ lama: "", baru: "" });
  };

  return (
    <div className="grid max-w-xl gap-6">
      <h1 className="text-2xl font-bold">Profil Saya</h1>
      <form onSubmit={simpan} className="grid gap-4 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">Nama dan NIP akan tampil pada tanda tangan laporan cetak.</p>
        <div className="grid gap-1.5">
          <Label>Nama Lengkap (dengan gelar)</Label>
          <Input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label>NIP</Label>
          <Input value={f.nip} onChange={(e) => setF({ ...f, nip: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label>Kelas Binaan</Label>
          <Input placeholder="Contoh: VII A – VII D" value={f.kelas_binaan} onChange={(e) => setF({ ...f, kelas_binaan: e.target.value })} />
        </div>
        <Button type="submit">Simpan Profil</Button>
      </form>
      <form onSubmit={gantiPw} className="grid gap-4 rounded-xl border bg-card p-6">
        <h2 className="font-semibold">Ganti Kata Sandi</h2>
        <div className="grid gap-1.5">
          <Label>Kata Sandi Lama</Label>
          <Input type="password" value={pw.lama} onChange={(e) => setPw({ ...pw, lama: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label>Kata Sandi Baru</Label>
          <Input type="password" value={pw.baru} onChange={(e) => setPw({ ...pw, baru: e.target.value })} />
        </div>
        <Button type="submit" variant="outline">Ganti Kata Sandi</Button>
      </form>
    </div>
  );
}
