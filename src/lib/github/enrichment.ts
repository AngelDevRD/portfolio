import type { GithubEnrichment, ReleaseHistoryEntry } from "./types";

const GITHUB_API = "https://api.github.com";
const REVALIDATE_SECONDS = 1800;

interface GhRepo {
  license?: { spdx_id: string } | null;
  pushed_at: string;
  stargazers_count: number;
}

interface GhRelease {
  tag_name: string;
  published_at: string;
  body: string | null;
  assets: {
    name: string;
    size: number;
    browser_download_url: string;
    url: string;
    digest?: string | null;
  }[];
}

/** Quita la línea "**Full Changelog**: ..." que GitHub agrega automáticamente cuando un release no tiene notas propias. */
function cleanReleaseNotes(body: string | null): string {
  if (!body) return "";
  return body.replace(/\*\*Full Changelog\*\*:\s*\S+/gi, "").trim();
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function ghFetch<T>(pathAndQuery: string, options: { noStore?: boolean } = {}): Promise<T | null> {
  try {
    const res = await fetch(`${GITHUB_API}${pathAndQuery}`, {
      headers: authHeaders(),
      ...(options.noStore ? { cache: "no-store" } : { next: { revalidate: REVALIDATE_SECONDS } }),
    });
    if (!res.ok) {
      console.warn(`[github] ${pathAndQuery} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[github] fetch falló para ${pathAndQuery}`, err);
    return null;
  }
}

/** Lee metadata pública y de solo lectura de un repo de GitHub (nunca escribe). */
export async function getGithubEnrichment(
  repo: string,
  type: "mobile" | "web"
): Promise<GithubEnrichment | null> {
  const [repoInfo, languagesObj, contributors, releases] = await Promise.all([
    ghFetch<GhRepo>(`/repos/${repo}`),
    ghFetch<Record<string, number>>(`/repos/${repo}/languages`),
    ghFetch<unknown[]>(`/repos/${repo}/contributors?per_page=100&anon=false`),
    // Sin cache: es la data que decide qué APK se descarga/instala -- servir un release
    // viejo por una revalidacion de ISR que nunca se disparo (sitio de bajo trafico, nadie
    // pega la ruta seguido) rompe la actualizacion para el usuario final.
    type === "mobile"
      ? ghFetch<GhRelease[]>(`/repos/${repo}/releases`, { noStore: true })
      : Promise.resolve(null),
  ]);

  if (!repoInfo) return null;

  const enrichment: GithubEnrichment = {
    license: repoInfo.license?.spdx_id ?? undefined,
    languages: languagesObj ? Object.keys(languagesObj) : undefined,
    contributors: Array.isArray(contributors) ? contributors.length : undefined,
    lastCommitAt: repoInfo.pushed_at,
    starsCount: repoInfo.stargazers_count,
  };

  if (type === "mobile" && Array.isArray(releases) && releases.length > 0) {
    const [latest] = releases;
    const findApk = (r: GhRelease) => r.assets?.find((a) => a.name.endsWith(".apk"));
    const findAab = (r: GhRelease) => r.assets?.find((a) => a.name.endsWith(".aab"));
    const findWindows = (r: GhRelease) =>
      r.assets?.find((a) => a.name.endsWith("-windows.zip") || a.name.endsWith(".exe"));
    const latestApk = findApk(latest);
    const latestAab = findAab(latest);
    const latestWindows = findWindows(latest);

    enrichment.latestVersion = latest.tag_name;
    enrichment.releaseDate = latest.published_at;
    enrichment.releaseNotes = cleanReleaseNotes(latest.body) || undefined;
    enrichment.apkSizeBytes = latestApk?.size;
    enrichment.apkSha256 = latestApk?.digest ?? undefined;
    enrichment.downloadUrl = latestApk?.browser_download_url;
    enrichment.downloadAssetUrl = latestApk?.url;
    enrichment.aabSizeBytes = latestAab?.size;
    enrichment.aabDownloadUrl = latestAab?.browser_download_url;
    enrichment.aabAssetUrl = latestAab?.url;
    enrichment.windowsSizeBytes = latestWindows?.size;
    enrichment.windowsDownloadUrl = latestWindows?.browser_download_url;
    enrichment.windowsAssetUrl = latestWindows?.url;
    enrichment.windowsFilename = latestWindows?.name;
    enrichment.releaseHistory = releases.slice(0, 10).map((r): ReleaseHistoryEntry => {
      const apk = findApk(r);
      return {
        version: r.tag_name,
        date: r.published_at,
        notes: cleanReleaseNotes(r.body),
        downloadUrl: apk?.browser_download_url ?? "",
        sizeBytes: apk?.size ?? 0,
        sha256: apk?.digest ?? undefined,
      };
    });
  }

  return enrichment;
}
