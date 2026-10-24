import type { SkillCategory } from "@/lib/types";

/** Categorías de habilidades con barras de progreso. Edita libremente. */
export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: "Layout",
    skills: [
      { name: "HTML", level: 80 },
      { name: "CSS", level: 75 },
      { name: "Windows Forms", level: 70 },
      { name: "React / Next.js", level: 72 },
      { name: "Tailwind CSS", level: 72 },
    ],
  },
  {
    title: "Backend",
    icon: "Server",
    skills: [
      { name: "C# (intermedio)", level: 70 },
      { name: "Lógica de programación", level: 82 },
      { name: "Diseño de algoritmos", level: 75 },
      { name: "Node.js", level: 65 },
      { name: "Django / API REST", level: 60 },
      { name: "ML.NET", level: 50 },
    ],
  },
  {
    title: "Bases de datos",
    icon: "Database",
    skills: [
      { name: "SQL", level: 72 },
      { name: "SQL Server", level: 68 },
      { name: "ETL / SSIS", level: 60 },
      { name: "PostgreSQL / Supabase", level: 65 },
      { name: "Prisma ORM", level: 60 },
    ],
  },
  {
    title: "Lenguajes",
    icon: "Smartphone",
    skills: [
      { name: "Python", level: 78 },
      { name: "Flutter", level: 60 },
      { name: "Dart", level: 65 },
      { name: "TypeScript", level: 72 },
      { name: "JavaScript", level: 75 },
      { name: "PowerShell", level: 60 },
      { name: "GDScript (Godot)", level: 50 },
      { name: "Estructuras de control", level: 80 },
    ],
  },
  {
    title: "Herramientas",
    icon: "Cloud",
    skills: [
      { name: "Git / GitHub", level: 75 },
      { name: "Visual Studio", level: 72 },
      { name: "Visual Studio Code", level: 78 },
      { name: "GitHub Actions (CI/CD)", level: 70 },
      { name: "Vercel", level: 70 },
      { name: "Docker", level: 60 },
      { name: "Android / ADB", level: 65 },
      { name: "Selenium", level: 55 },
    ],
  },
  {
    title: "Habilidades blandas",
    icon: "Palette",
    skills: [
      { name: "Trabajo en equipo", level: 88 },
      { name: "Resolución de problemas", level: 85 },
      { name: "Aprendizaje rápido", level: 90 },
    ],
  },
];
