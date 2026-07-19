import fs from "node:fs";
import path from "node:path";
import { getGithubEnrichment } from "@/lib/github/enrichment";
import { mobileProjectSchema } from "@/lib/projects/schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects", "mobile");

export interface MetadataEntry {
  slug: string;
  name: string;
  repo: string;
  version: string | null;
  releaseDate: string | null;
  android: { apkUrl: string | null; apkSizeBytes: number | null; aabUrl: string | null; aabSizeBytes: number | null };
  windows: { url: string | null; sizeBytes: number | null };
  ios: { distribution: string; testflightUrl: string | null };
}

/** Snapshot estatico de todas las apps mobile del catalogo, derivado en vivo de GitHub Releases
 * (misma fuente que ya usa la web -- ver src/lib/github/enrichment.ts). Es un espejo de consulta
 * rapida para consumidores externos (in-app updater, terceros); la web sigue leyendo en vivo. */
export async function buildMetadataSnapshot(): Promise<MetadataEntry[]> {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  const entries = await Promise.all(
    files.map(async (f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8"));
      const parsed = mobileProjectSchema.safeParse(raw);
      if (!parsed.success) return null;
      const project = parsed.data;
      const gh = await getGithubEnrichment(project.repo, "mobile");

      const entry: MetadataEntry = {
        slug: project.slug,
        name: project.name,
        repo: project.repo,
        version: gh?.latestVersion ?? null,
        releaseDate: gh?.releaseDate ?? null,
        android: {
          apkUrl: gh?.downloadUrl ?? null,
          apkSizeBytes: gh?.apkSizeBytes ?? null,
          aabUrl: gh?.aabDownloadUrl ?? null,
          aabSizeBytes: gh?.aabSizeBytes ?? null,
        },
        windows: { url: gh?.windowsDownloadUrl ?? null, sizeBytes: gh?.windowsSizeBytes ?? null },
        ios: { distribution: project.iosDistribution ?? "not_available", testflightUrl: project.testflightUrl ?? null },
      };
      return entry;
    })
  );

  return entries.filter((e): e is MetadataEntry => e !== null).sort((a, b) => a.slug.localeCompare(b.slug));
}
