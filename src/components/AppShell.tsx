import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, FileBarChart, UserCircle, LogOut, Menu, BookHeart, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MODULES, MODULE_GROUPS, getModule } from "@/lib/modules";
import { profileQuery, isAdminQuery } from "@/lib/data";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const linkCls =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/90 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
const activeCls = "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground";

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { data: isAdmin } = useQuery(isAdminQuery);
  return (
    <nav className="flex flex-col gap-1">
      <Link to="/dashboard" className={linkCls} activeProps={{ className: activeCls }} onClick={onNavigate}>
        <LayoutDashboard className="h-4 w-4" /> Beranda
      </Link>
      {MODULE_GROUPS.map((g) => (
        <div key={g.label}>
          <div className="mt-3 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">{g.label}</div>
          {g.slugs.map((slug) => {
            const m = getModule(slug)!;
            return (
              <Link
                key={m.slug}
                to="/m/$modul"
                params={{ modul: m.slug }}
                className={linkCls}
                activeProps={{ className: activeCls }}
                onClick={onNavigate}
              >
                <m.icon className="h-4 w-4" /> {m.short}
              </Link>
            );
          })}
        </div>
      ))}
      <div className="mt-3 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">Lainnya</div>
      <Link to="/laporan" className={linkCls} activeProps={{ className: activeCls }} onClick={onNavigate}>
        <FileBarChart className="h-4 w-4" /> Laporan BK
      </Link>
      <Link to="/profil" className={linkCls} activeProps={{ className: activeCls }} onClick={onNavigate}>
        <UserCircle className="h-4 w-4" /> Profil Saya
      </Link>
      {isAdmin && (
        <Link to="/pengguna" className={linkCls} activeProps={{ className: activeCls }} onClick={onNavigate}>
          <Users className="h-4 w-4" /> Kelola Pengguna
        </Link>
      )}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <BookHeart className="h-5 w-5" />
      </div>
      <div>
        <div className="text-base font-bold leading-tight text-sidebar-foreground">RUANG BK</div>
        <div className="text-xs text-sidebar-foreground/70">SMP Negeri 3 Tempel</div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: profile } = useQuery(profileQuery);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const sidebarBody = (close?: () => void) => (
    <div className="flex h-full flex-col gap-4 bg-sidebar p-4">
      <Brand />
      <div className="flex-1 overflow-y-auto">
        <NavLinks onNavigate={close} />
      </div>
      <div className="rounded-lg bg-sidebar-accent p-3">
        <div className="truncate text-sm font-semibold text-sidebar-accent-foreground">{profile?.nama || "Guru BK"}</div>
        <div className="truncate text-xs text-sidebar-foreground/70">{profile?.email}</div>
        <button onClick={logout} className="mt-2 flex items-center gap-2 text-xs font-medium text-sidebar-foreground hover:underline">
          <LogOut className="h-3.5 w-3.5" /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <aside className="no-print fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebarBody()}</aside>
      <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <BookHeart className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary">RUANG BK</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Menu className="h-4 w-4" /> Menu
        </Button>
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-none p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          {sidebarBody(() => setOpen(false))}
        </SheetContent>
      </Sheet>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
