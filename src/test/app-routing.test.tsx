import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /import-siswa instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/import-siswa");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("keeps every MODULE_GROUPS slug backed by a module definition", async () => {
    const { MODULE_GROUPS, getModule } = await import("@/lib/modules");

    for (const group of MODULE_GROUPS) {
      for (const slug of group.slugs) {
        expect(getModule(slug), `${group.label}: ${slug}`).toBeDefined();
      }
    }
  });
});
