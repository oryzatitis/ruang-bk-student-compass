import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { listUsers, inviteUser } from "@/lib/users.functions";
import { isAdminQuery } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/pengguna")({
  beforeLoad: async ({ context }) => {
    const admin = await context.queryClient.fetchQuery(isAdminQuery);
    if (!admin) throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: "Kelola Pengguna — RUANG BK" }] }),
  component: Pengguna,
});

const ROLE_LABEL: Record<string, string> = { admin: "Administrator", guru_bk: "Guru BK" };

function Pengguna() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const { data: users, isLoading, error } = useQuery({ queryKey: ["users"], queryFn: () => listUsers() });

  const invite = useMutation({
    mutationFn: () => inviteUser({ data: { email, nama, redirectTo: `${window.location.origin}/atur-sandi` } }),
    onSuccess: () => {
      toast.success(`Undangan dikirim ke ${email}`);
      setEmail("");
      setNama("");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
        <p className="text-sm text-muted-foreground">Undang guru BK baru. Guru akan menerima email untuk membuat kata sandinya sendiri.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); invite.mutate(); }}
        className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="nama">Nama guru</Label>
          <Input id="nama" required value={nama} onChange={(e) => setNama(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email guru</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit" disabled={invite.isPending}>
          {invite.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Kirim Undangan
        </Button>
      </form>

      <div className="rounded-xl border bg-card">
        <div className="border-b p-4 font-semibold">Daftar Pengguna</div>
        {isLoading && <p className="p-4 text-sm text-muted-foreground">Memuat…</p>}
        {error && <p className="p-4 text-sm text-destructive">{(error as Error).message}</p>}
        <ul className="divide-y">
          {users?.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <div className="font-medium">{u.nama || "-"}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </div>
              <div className="flex gap-2 text-xs">
                {u.roles.map((r) => (
                  <span key={r} className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">{ROLE_LABEL[r] ?? r}</span>
                ))}
                <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{u.aktif ? "Aktif" : "Belum masuk"}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
