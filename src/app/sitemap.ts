import type { MetadataRoute } from "next";
import { getMobileProjects } from "@/data";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/apps`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  const apps = await getMobileProjects();
  const appRoutes: MetadataRoute.Sitemap = apps.map((a) => ({
    url: `${base}/apps/${a.slug}`,
    lastModified: new Date(a.github?.releaseDate ?? a.github?.lastCommitAt ?? now),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...appRoutes];
}
