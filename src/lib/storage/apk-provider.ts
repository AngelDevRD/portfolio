import type { EnrichedProject } from "@/lib/github/types";
import type { CatalogProject } from "@/lib/projects/schema";

export interface ApkAsset {
  body: ReadableStream<Uint8Array>;
  contentLength?: number;
}

/** Variante de artefacto que se puede descargar por plataforma. */
export type AssetKind = "apk" | "aab" | "windows";

/**
 * Fuente de los artefactos distribuidos (APK/AAB/Windows). Hoy vive en GitHub Releases; el
 * contrato permite cambiar a Cloudflare R2, S3 u otro almacenamiento sin tocar la ruta HTTP
 * que lo consume.
 */
export interface ApkStorageProvider {
  getApk(project: EnrichedProject<CatalogProject>, kind?: AssetKind): Promise<ApkAsset | null>;
}

const COMBINING_DIACRITICS = /[̀-ͯ]/g;
const EXT_BY_KIND: Record<AssetKind, string> = { apk: "apk", aab: "aab", windows: "zip" };

/** Nombre de archivo de descarga: usa "downloadName" si existe, si no lo deriva de "name". */
export function apkFilename(
  project: Pick<CatalogProject, "name" | "downloadName">,
  kind: AssetKind = "apk"
): string {
  const base = project.downloadName ?? project.name.normalize("NFD").replace(COMBINING_DIACRITICS, "");
  const safe = base.replace(/[^\w-]/g, "") || "app";
  return `${safe}.${EXT_BY_KIND[kind]}`;
}
