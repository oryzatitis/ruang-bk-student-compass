import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || data !== true) throw new Error("Hanya Administrator yang boleh mengelola pengguna.");
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error("Gagal memuat daftar pengguna.");
    const ids = data.users.map((u) => u.id);
    const [{ data: roles }, { data: profiles }] = await Promise.all([
      supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids),
      supabaseAdmin.from("profiles").select("id, nama").in("id", ids),
    ]);
    return data.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      nama: profiles?.find((p) => p.id === u.id)?.nama ?? "",
      roles: (roles ?? []).filter((r) => r.user_id === u.id).map((r) => r.role as string),
      aktif: !!u.last_sign_in_at,
      diundang: u.invited_at ?? null,
    }));
  });

export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; nama: string; redirectTo: string }) => {
    const email = String(d.email ?? "").trim().toLowerCase();
    const nama = String(d.nama ?? "").trim().slice(0, 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email tidak valid.");
    if (!nama) throw new Error("Nama wajib diisi.");
    const url = new URL(String(d.redirectTo));
    if (url.pathname !== "/atur-sandi") throw new Error("Alamat tidak valid.");
    return { email, nama, redirectTo: url.toString() };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // New accounts receive the guru_bk role automatically via the signup trigger.
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
      data: { nama: data.nama },
      redirectTo: data.redirectTo,
    });
    if (error) {
      if (/already/i.test(error.message)) throw new Error("Email ini sudah terdaftar.");
      if (/rate/i.test(error.message)) throw new Error("Terlalu banyak undangan dalam satu jam. Coba lagi nanti.");
      throw new Error("Undangan gagal dikirim.");
    }
    return { ok: true };
  });
