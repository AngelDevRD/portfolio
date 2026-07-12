import type { ApkAsset, ApkStorageProvider } from "./apk-provider";
import type { EnrichedProject } from "@/lib/github/types";
import type { CatalogProject } from "@/lib/projects/schema";

function authHeaders(accept: string): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Lee el asset del release de GitHub y lo streamea siempre server-side (el token nunca llega al navegador). */
export class GithubReleaseApkProvider implements ApkStorageProvider {
  async getApk(project: EnrichedProject<CatalogProject>): Promise<ApkAsset | null> {
    const assetUrl = project.type === "mobile" ? project.github?.downloadAssetUrl : undefined;
    if (!assetUrl) return null;

    const res = await fetch(assetUrl, {
      headers: authHeaders("application/octet-stream"),
      redirect: "follow",
      cache: "no-store",
    });

    if (!res.ok || !res.body) return null;

    const contentLength = res.headers.get("content-length");
    return {
      body: res.body,
      contentLength: contentLength ? Number(contentLength) : undefined,
    };
  }
}
