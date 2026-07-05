export type ProjectStatus = "Completado" | "En progreso" | "Pausado" | "Concepto";

export interface Project {
  slug: string;
  name: string;
  description: string;
  image: string;
  tech: string[];
  date: string; // ISO YYYY-MM-DD
  status: ProjectStatus;
  category: string;
  links: {
    live?: string;
    github?: string;
    docs?: string;
  };
  featured?: boolean;
}

export type AppPlatform = "Web" | "Android" | "Windows" | "Herramientas" | "IA" | "Juegos";

export interface AppChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface AppItem {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  screenshots: string[];
  video?: string;
  version: string;
  category: string;
  platform: AppPlatform;
  size: string;
  rating: number; // 0..5
  downloads: number;
  updatedAt: string; // ISO
  tech: string[];
  features: string[];
  requirements: string[];
  changelog: AppChangelogEntry[];
  links: {
    download?: string;
    more?: string;
  };
}

export interface Skill {
  name: string;
  level: number; // 0..100
}

export interface SkillCategory {
  title: string;
  icon: string; // lucide icon name
  skills: Skill[];
}
