import { getProjectRepository } from "@/lib/projects/factory";
import type { ProjectFilter } from "@/lib/projects/filter";
import type { MobileProject, WebProject } from "@/lib/projects/schema";
import type { EnrichedProject } from "@/lib/github/types";

const repo = getProjectRepository();

export function getAllProjects(filter?: ProjectFilter) {
  return repo.getAll(filter);
}

export async function getMobileProjects(filter?: ProjectFilter) {
  const items = await repo.getByType("mobile", filter);
  return items as EnrichedProject<MobileProject>[];
}

export async function getWebProjects(filter?: ProjectFilter) {
  const items = await repo.getByType("web", filter);
  return items as EnrichedProject<WebProject>[];
}

export function getProjectBySlug(slug: string) {
  return repo.getBySlug(slug);
}
