import type { EnrichedProject } from "@/lib/github/types";
import type { CatalogProject } from "@/lib/projects/schema";

export interface ApkAsset {
  body: ReadableStream<Uint8Array>;
  contentLength?: number;
}

/**
 * Fuente de las APK distribuidas. Hoy vive en GitHub Releases; el contrato permite
 * cambiar a Cloudflare R2, S3 u otro almacenamiento sin tocar la ruta HTTP que lo consume.
 */
export interface ApkStorageProvider {
  getApk(project: EnrichedProject<CatalogProject>): Promise<ApkAsset | null>;
}

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

/** Nombre de archivo de descarga: usa "downloadName" si existe, si no lo deriva de "name". */
export function apkFilename(project: Pick<CatalogProject, "name" | "downloadName">): string {
  const base = project.downloadName ?? project.name.normalize("NFD").replace(COMBINING_DIACRITICS, "");
  const safe = base.replace(/[^\w-]/g, "") || "app";
  return `${safe}.apk`;
}
