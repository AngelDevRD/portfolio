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
    ],
  },
  {
    title: "Backend",
    icon: "Server",
    skills: [
      { name: "C# (intermedio)", level: 70 },
      { name: "Lógica de programación", level: 82 },
      { name: "Diseño de algoritmos", level: 75 },
    ],
  },
  {
    title: "Bases de datos",
    icon: "Database",
    skills: [
      { name: "SQL", level: 72 },
      { name: "SQL Server", level: 68 },
      { name: "ETL / SSIS", level: 60 },
    ],
  },
  {
    title: "Lenguajes",
    icon: "Smartphone",
    skills: [
      { name: "Python", level: 78 },
      { name: "Flutter", level: 60 },
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
