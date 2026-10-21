import { createFileRoute, notFound } from "@tanstack/react-router";
import { getModule } from "@/lib/modules";
import { CrudPage } from "@/components/CrudPage";

export const Route = createFileRoute("/_authenticated/m/$modul")({
  beforeLoad: ({ params }) => {
    if (!getModule(params.modul)) throw notFound();
  },
  head: ({ params }) => ({ meta: [{ title: `${getModule(params.modul)?.title ?? "Modul"} — RUANG BK` }] }),
  component: ModulPage,
});

function ModulPage() {
  const { modul } = Route.useParams();
  const m = getModule(modul)!;
  return <CrudPage key={m.slug} module={m} />;
}
