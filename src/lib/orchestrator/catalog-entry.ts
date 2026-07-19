import fs from "node:fs";
import path from "node:path";
import { mobileProjectSchema, type MobileProject } from "@/lib/projects/schema";
import { extractMetadata } from "./extract-metadata";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects", "mobile");

function readExisting(slug: string): Partial<MobileProject> | null {
  const file = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export interface BuildCatalogEntryResult {
  slug: string;
  entry: MobileProject;
  isNew: boolean;
  version?: string;
  iconBuffer?: Buffer;
  warnings: string[];
}

/**
 * Construye (o completa) la entrada del catalogo para una app, extrayendo del repo Flutter
 * cualquier campo que falte. Nunca sobreescribe un campo ya presente en el JSON existente --
 * eso preserva ediciones humanas hechas a mano en el pasado. Si algo no se puede resolver, se
 * agrega a `warnings` (solo advertencia, nunca bloquea).
 */
export async function buildCatalogEntry(owner: string, repo: string): Promise<BuildCatalogEntryResult> {
  const slug = repo.toLowerCase();
  const existing = readExisting(slug);
  const extracted = await extractMetadata(owner, repo);
  const warnings = [...extracted.warnings];

  const merged: Record<string, unknown> = {
    slug,
    type: "mobile",
    name: existing?.name ?? extracted.name ?? repo,
    tagline: existing?.tagline ?? extracted.tagline ?? "",
    description: existing?.description ?? extracted.description ?? extracted.tagline ?? "",
    tags: existing?.tags?.length ? existing.tags : extracted.tags,
    category: existing?.category ?? "",
    status: existing?.status ?? "development",
    featured: existing?.featured ?? false,
    logo: existing?.logo ?? `/apps/${slug}/icon.png`,
    screenshots: existing?.screenshots ?? [],
    repo: `${owner}/${repo}`,
    packageId: existing?.packageId ?? extracted.packageId ?? "",
    docsUrl: existing?.docsUrl ?? `https://github.com/${owner}/${repo}#readme`,
  };

  if (!merged.description) warnings.push(`[${slug}] description vacia`);
  if (!merged.packageId) warnings.push(`[${slug}] packageId vacio`);

  const parsed = mobileProjectSchema.safeParse(merged);
  if (!parsed.success) {
    // No debe pasar (todos los campos requeridos tienen fallback), pero si pasa, mejor loguear
    // el detalle y devolver algo minimo que si valide, en vez de tirar el webhook completo.
    warnings.push(`[${slug}] entrada no valido segun schema: ${parsed.error.message}`);
  }

  return {
    slug,
    entry: parsed.success ? parsed.data : (merged as unknown as MobileProject),
    isNew: existing === null,
    version: extracted.version,
    iconBuffer: existing?.logo ? undefined : extracted.iconBuffer,
    warnings,
  };
}
