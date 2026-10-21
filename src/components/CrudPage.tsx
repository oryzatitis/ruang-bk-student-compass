import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Printer, Pencil, Trash2, Search, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Field, ModuleDef } from "@/lib/modules";
import { formatTanggal, moduleQuery, siswaListQuery } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PrintKop, PrintTtd } from "@/components/PrintKop";

type Row = Record<string, any>;
const selectCls =
  "flex h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

async function openFile(path: string) {
  const { data, error } = await supabase.storage.from("dokumen-bk").createSignedUrl(path, 300);
  if (error || !data) return toast.error("Berkas tidak dapat dibuka");
  window.open(data.signedUrl, "_blank");
}

function cellValue(f: Field, row: Row, forPrint = false) {
  const v = row[f.name];
  if (f.type === "siswa") return row.siswa ? `${row.siswa.nama}${row.siswa.kelas ? ` (${row.siswa.kelas})` : ""}` : "-";
  if (f.type === "date") return formatTanggal(v);
  if (f.type === "file") {
    if (!v) return "-";
    if (forPrint) return "Ada berkas";
    return (
      <button onClick={() => openFile(v)} className="inline-flex items-center gap-1 text-primary hover:underline">
        <FileDown className="h-4 w-4" /> Buka
      </button>
    );
  }
  return v === null || v === undefined || v === "" ? "-" : String(v);
}

export function CrudPage({ module: m }: { module: ModuleDef }) {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery(moduleQuery(m));
  const needsSiswa = m.fields.some((f) => f.type === "siswa");
  const { data: siswa = [] } = useQuery({ ...siswaListQuery, enabled: needsSiswa });

  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [file, setFile] = useState<File | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);

  const tableFields = m.fields.filter((f) => f.showInTable);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    return rows.filter((r) => {
      if (m.hasDate && from && r.tanggal < from) return false;
      if (m.hasDate && to && r.tanggal > to) return false;
      if (!s) return true;
      const hay = [...m.fields.map((f) => r[f.name]), r.siswa?.nama, r.siswa?.kelas].join(" ").toLowerCase();
      return hay.includes(s);
    });
  }, [rows, q, from, to, m]);

  const openNew = () => {
    const init: Row = {};
    m.fields.forEach((f) => {
      if (f.type === "date") init[f.name] = new Date().toISOString().slice(0, 10);
      else if (f.type === "select" && f.options) init[f.name] = f.options[0];
      else init[f.name] = "";
    });
    setFile(null);
    setForm(init);
    setEditing({});
  };

  const openEdit = (r: Row) => {
    const init: Row = {};
    m.fields.forEach((f) => (init[f.name] = r[f.name] ?? ""));
    setFile(null);
    setForm(init);
    setEditing(r);
  };

  const save = useMutation({
    mutationFn: async () => {
      for (const f of m.fields) {
        if (f.required && f.type !== "file" && !String(form[f.name] ?? "").trim()) throw new Error(`${f.label} wajib diisi`);
      }
      const payload: Row = { ...form };
      for (const f of m.fields) {
        if (f.type === "number") payload[f.name] = Number(payload[f.name] || 0);
        if (f.type === "siswa" && !payload[f.name]) payload[f.name] = null;
      }
      const fileField = m.fields.find((f) => f.type === "file");
      if (fileField && file) {
        const { data: u } = await supabase.auth.getUser();
        const path = `${u.user!.id}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
        const { error } = await supabase.storage.from("dokumen-bk").upload(path, file);
        if (error) throw new Error("Gagal mengunggah berkas");
        payload[fileField.name] = path;
      }
      const table = supabase.from(m.table) as any;
      const { error } = editing?.id ? await table.update(payload).eq("id", editing.id) : await table.insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Data berhasil disimpan");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["module", m.table] });
      if (m.table === "siswa") qc.invalidateQueries({ queryKey: ["siswa-list"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message || "Gagal menyimpan"),
  });

  const remove = useMutation({
    mutationFn: async (r: Row) => {
      const { error } = await (supabase.from(m.table) as any).delete().eq("id", r.id);
      if (error) throw error;
      if (r.file_path) await supabase.storage.from("dokumen-bk").remove([r.file_path]);
    },
    onSuccess: () => {
      toast.success("Data dihapus");
      setToDelete(null);
      qc.invalidateQueries({ queryKey: ["module", m.table] });
      if (m.table === "siswa") qc.invalidateQueries({ queryKey: ["siswa-list"] });
    },
    onError: () => toast.error("Gagal menghapus data"),
  });

  const periode = from || to ? `Periode: ${from ? formatTanggal(from) : "awal"} s.d. ${to ? formatTanggal(to) : "sekarang"}` : undefined;

  return (
    <div>
      <div className="no-print mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <m.icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{m.title}</h1>
            <p className="text-sm text-muted-foreground">{m.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Cetak
          </Button>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Tambah Data
          </Button>
        </div>
      </div>

      <div className="no-print mb-4 grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari data..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        {m.hasDate && (
          <>
            <div className="flex items-center gap-2">
              <Label className="shrink-0 text-xs">Dari</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="shrink-0 text-xs">Sampai</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </>
        )}
      </div>

      <div className="print-area rounded-xl border bg-card">
        <PrintKop title={m.title} subtitle={periode} />
        {isLoading ? (
          <div className="flex justify-center p-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            Belum ada data. <span className="no-print">Klik <b>Tambah Data</b> untuk mulai mengisi.</span>
          </div>
        ) : (
          <>
            {/* Tampilan kartu untuk HP */}
            <div className="no-print divide-y md:hidden">
              {filtered.map((r) => (
                <div key={r.id} className="p-4">
                  {tableFields.map((f) => (
                    <div key={f.name} className="flex gap-2 py-0.5 text-sm">
                      <span className="w-28 shrink-0 text-muted-foreground">{f.label}</span>
                      <span className="font-medium">{cellValue(f, r)}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(r)}>
                      <Pencil className="h-3.5 w-3.5" /> Ubah
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => setToDelete(r)}>
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {/* Tabel untuk laptop & cetak */}
            <div className="hidden overflow-x-auto md:block print:block">
              <table className="print-table w-full text-sm">
                <thead>
                  <tr className="border-b bg-primary-soft text-left">
                    <th className="px-3 py-3 font-semibold">No</th>
                    {tableFields.map((f) => (
                      <th key={f.name} className="px-3 py-3 font-semibold">
                        {f.label}
                      </th>
                    ))}
                    <th className="no-print px-3 py-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-3 py-3">{i + 1}</td>
                      {tableFields.map((f) => (
                        <td key={f.name} className="max-w-xs px-3 py-3 align-top">
                          <span className="no-print">{cellValue(f, r)}</span>
                          <span className="print-only">{cellValue(f, r, true)}</span>
                        </td>
                      ))}
                      <td className="no-print whitespace-nowrap px-3 py-3 text-right">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(r)} aria-label="Ubah">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setToDelete(r)} aria-label="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <PrintTtd />
      </div>
      <p className="no-print mt-3 text-xs text-muted-foreground">Jumlah data: {filtered.length}</p>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Ubah Data" : "Tambah Data"} — {m.short}</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
          >
            {m.fields.map((f) => (
              <div key={f.name} className="grid gap-1.5">
                <Label htmlFor={f.name}>
                  {f.label} {f.required && <span className="text-destructive">*</span>}
                </Label>
                {f.type === "textarea" ? (
                  <Textarea id={f.name} rows={3} placeholder={f.placeholder} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                ) : f.type === "select" ? (
                  <select id={f.name} className={selectCls} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                    {f.options!.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : f.type === "siswa" ? (
                  <>
                    <select id={f.name} className={selectCls} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                      <option value="">— Pilih siswa —</option>
                      {siswa.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama} {s.kelas ? `(${s.kelas})` : ""}
                        </option>
                      ))}
                    </select>
                    {siswa.length === 0 && <p className="text-xs text-muted-foreground">Belum ada siswa. Isi dulu menu Data Siswa.</p>}
                  </>
                ) : f.type === "file" ? (
                  <>
                    <Input id={f.name} type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                    {form[f.name] && !file && <p className="text-xs text-muted-foreground">Berkas sudah ada. Pilih berkas baru untuk mengganti.</p>}
                  </>
                ) : (
                  <Input id={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Batal
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data ini?</AlertDialogTitle>
            <AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDelete && remove.mutate(toDelete)}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
