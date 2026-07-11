import type { MetadataRoute } from "next";
import { getAllProjects } from "@/data";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/apps`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  const projects = await getAllProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/apps/${p.slug}`,
    lastModified: new Date(p.github?.releaseDate ?? p.github?.lastCommitAt ?? now),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
