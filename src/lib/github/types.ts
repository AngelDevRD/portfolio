export interface ReleaseHistoryEntry {
  version: string;
  date: string;
  notes: string;
  downloadUrl: string;
  sizeBytes: number;
  /** Checksum sha256 del asset, formato "sha256:<hex>" (expuesto nativamente por la API de GitHub Releases). */
  sha256?: string;
}

/** Metadata leída en vivo de la API de GitHub. Nunca se persiste — se calcula al leer. */
export interface GithubEnrichment {
  license?: string;
  languages?: string[];
  contributors?: number;
  lastCommitAt?: string;
  starsCount?: number;
  // Solo proyectos type=mobile, derivado del último GitHub Release:
  latestVersion?: string;
  releaseDate?: string;
  apkSizeBytes?: number;
  /** Checksum sha256 del APK, formato "sha256:<hex>" (expuesto nativamente por la API de GitHub Releases). */
  apkSha256?: string;
  releaseNotes?: string;
  downloadUrl?: string;
  /** URL de la API de GitHub para el asset (usada por el proxy de descarga server-side; no es descargable directo desde el navegador en repos privados). */
  downloadAssetUrl?: string;
  releaseHistory?: ReleaseHistoryEntry[];
}

export type EnrichedProject<T> = T & { github: GithubEnrichment | null; downloads: number };
