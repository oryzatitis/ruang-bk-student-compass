import { createFileRoute, notFound } from "@tanstack/react-router";
import { getModule } from "@/lib/modules";
import { CrudPage } from "@/components/CrudPage";

export const Route = createFileRoute("/_authenticated/m/$modul")({
  beforeLoad: ({ params }) => {
    if (!getModule(params.modul)) throw notFound();
  },
  head: ({ params }) => {
    const m = getModule(params.modul);
    const title = `${m?.title ?? "Modul"} — RUANG BK`;
    const description = `Administrasi ${m?.title ?? "layanan BK"} SMP Negeri 3 Tempel.`;
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  },
  component: ModulPage,
});

function ModulPage() {
  const { modul } = Route.useParams();
  const m = getModule(modul);
  if (!m) throw notFound();
  return <CrudPage key={m.slug} module={m} />;
}
