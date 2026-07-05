import projectsJson from "./projects.json";
import appsJson from "./apps.json";
import type { AppItem, Project } from "@/lib/types";

export const projects = projectsJson as Project[];
export const apps = appsJson as AppItem[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAppBySlug(slug: string): AppItem | undefined {
  return apps.find((a) => a.slug === slug);
}

/** Categorías/tecnologías únicas para poblar los filtros dinámicamente. */
export const projectCategories = Array.from(new Set(projects.map((p) => p.category)));
export const appPlatforms = Array.from(new Set(apps.map((a) => a.platform)));
