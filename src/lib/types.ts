export interface Skill {
  name: string;
  level: number; // 0..100
}

export interface SkillCategory {
  title: string;
  icon: string; // lucide icon name
  skills: Skill[];
}
