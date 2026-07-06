import fs from "node:fs";
import path from "node:path";
import { catalogProjectSchema, type CatalogProject } from "./schema";
import { applyFilter, type ProjectFilter } from "./filter";
import type { ProjectRepository } from "./repository";
import { getGithubEnrichment } from "@/lib/github/enrichment";
import { getDownloadCount } from "@/lib/downloads/counter";
import type { EnrichedProject } from "@/lib/github/types";

const CONTENT_ROOT = path.join(process.cwd(), "content", "projects");

function loadDir(sub: "mobile" | "web"): CatalogProject[] {
  const dir = path.join(CONTENT_ROOT, sub);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
      const parsed = catalogProjectSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(`[projects] Archivo de contenido inválido ${sub}/${f}: ${parsed.error.message}`);
      }
      return parsed.data;
    });
}

let cached: CatalogProject[] | null = null;

function loadAll(): CatalogProject[] {
  if (cached) return cached;
  cached = [...loadDir("mobile"), ...loadDir("web")];
  return cached;
}

async function enrich<T extends CatalogProject>(items: T[]): Promise<EnrichedProject<T>[]> {
  return Promise.all(
    items.map(async (p) => {
      const [github, downloads] = await Promise.all([
        getGithubEnrichment(p.repo, p.type),
        getDownloadCount(p.slug),
      ]);
      return { ...p, github, downloads };
    })
  );
}

export class JsonProjectRepository implements ProjectRepository {
  async getAll(filter?: ProjectFilter) {
    return enrich(applyFilter(loadAll(), filter));
  }

  async getByType(type: "mobile" | "web", filter?: ProjectFilter) {
    const items = applyFilter(loadAll(), filter).filter((p) => p.type === type);
    return enrich(items);
  }

  async getBySlug(slug: string) {
    const found = loadAll().find((p) => p.slug === slug);
    if (!found) return undefined;
    const [enriched] = await enrich([found]);
    return enriched;
  }
}
