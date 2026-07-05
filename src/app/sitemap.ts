import type { MetadataRoute } from "next";
import { apps } from "@/data";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/apps`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  const appRoutes: MetadataRoute.Sitemap = apps.map((a) => ({
    url: `${base}/apps/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...appRoutes];
}
