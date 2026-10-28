import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ModuleDef } from "./modules";

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
    return { email: u.user.email ?? "", nama: data?.nama ?? "", nip: data?.nip ?? "", kelas_binaan: data?.kelas_binaan ?? "", kepala_sekolah: data?.kepala_sekolah ?? "Mulasih, S.Pd.", nip_kepala_sekolah: data?.nip_kepala_sekolah ?? "19740301 200501 2 009" };
  },
});

export const siswaListQuery = queryOptions({
  queryKey: ["siswa-list"],
  queryFn: async () => {
    const { data, error } = await supabase.from("siswa").select("id,nama,kelas,nis").order("nama");
    if (error) throw error;
    return data;
  },
});

export const moduleQuery = (m: ModuleDef) =>
  queryOptions({
    queryKey: ["module", m.table, m.category ?? "all"],
    queryFn: async () => {
      const hasSiswa = m.fields.some((f) => f.type === "siswa");
      let query = supabase
        .from(m.table)
        .select(hasSiswa ? "*, siswa(nama,kelas,nisn)" : "*");
      if (m.category) query = supabase.from("layanan").select("*").eq("kategori", m.category);
      const { data, error } = await query
        .order(m.orderBy, { ascending: m.orderBy === "nama" });
      if (error) throw error;
      return data as unknown as any[];
    },
  });

export const formatTanggal = (d?: string | null) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

export const isAdminQuery = queryOptions({
  queryKey: ["is-admin"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return false;
    const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    return data === true;
  },
});
