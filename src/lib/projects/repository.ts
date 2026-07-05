import type { CatalogProject } from "./schema";
import type { EnrichedProject } from "@/lib/github/types";
import type { ProjectFilter } from "./filter";

export type { ProjectFilter };

export interface ProjectRepository {
  getAll(filter?: ProjectFilter): Promise<EnrichedProject<CatalogProject>[]>;
  getByType(type: "mobile" | "web", filter?: ProjectFilter): Promise<EnrichedProject<CatalogProject>[]>;
  getBySlug(slug: string): Promise<EnrichedProject<CatalogProject> | undefined>;
}
