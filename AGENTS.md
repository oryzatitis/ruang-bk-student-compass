<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Data modules are config-driven in `src/lib/modules.ts` and rendered by the generic `CrudPage` via `/m/$modul`; add a module by adding config + table, not a new page.
- Data access uses the browser Supabase client with per-user RLS (`user_id = auth.uid()`); no server functions needed for CRUD.
- Printing uses `window.print()` with `.no-print`/`.print-only` classes and `PrintKop`/`PrintTtd` components.
- Roles live in `public.user_roles` (read-only to clients, checked via `has_role`); admin-only account actions run in `src/lib/users.functions.ts` server functions that verify the admin role before using the service-role client.
- Sidebar groups modules via `MODULE_GROUPS` in `src/lib/modules.ts` (layanan dasar/responsif/perencanaan individual); a module can appear in more than one group.
- Excel import of siswa lives in `src/routes/_authenticated/import-siswa.tsx` using the `xlsx` package: parse client-side, preview, then bulk insert via the browser client.
