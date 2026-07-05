import type { CatalogProject, ProjectStatus } from "./schema";

export interface ProjectFilter {
  tags?: string[];
  status?: ProjectStatus;
  category?: string;
  query?: string;
}

export function applyFilter<T extends CatalogProject>(items: T[], filter?: ProjectFilter): T[] {
  if (!filter) return items;
  const q = filter.query?.trim().toLowerCase();

  return items.filter((p) => {
    if (filter.status && p.status !== filter.status) return false;
    if (filter.category && p.category !== filter.category) return false;
    if (filter.tags?.length && !filter.tags.every((t) => p.tags.includes(t))) return false;
    if (q) {
      const haystack = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Parsea los query params de un Request a un ProjectFilter (usado por las rutas de API). */
export function parseFilterFromRequest(req: Request): ProjectFilter {
  const { searchParams } = new URL(req.url);
  const tags = searchParams.get("tags")?.split(",").map((t) => t.trim()).filter(Boolean);
  const status = searchParams.get("status") as ProjectStatus | null;
  const category = searchParams.get("category") ?? undefined;
  const query = searchParams.get("q") ?? undefined;
  return { tags, status: status ?? undefined, category, query };
}
