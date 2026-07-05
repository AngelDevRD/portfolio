import type { ProjectRepository } from "./repository";
import { JsonProjectRepository } from "./json-repository";
// Futuro: import { SupabaseProjectRepository } from "./supabase-repository";

let instance: ProjectRepository | null = null;

/** Selecciona la implementación de ProjectRepository vía PROJECTS_REPOSITORY_DRIVER (por defecto "json"). */
export function getProjectRepository(): ProjectRepository {
  if (instance) return instance;

  const driver = process.env.PROJECTS_REPOSITORY_DRIVER ?? "json";
  switch (driver) {
    // case "supabase":
    //   instance = new SupabaseProjectRepository();
    //   break;
    case "json":
    default:
      instance = new JsonProjectRepository();
  }
  return instance;
}
