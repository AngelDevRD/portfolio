/**
 * Configuración central del sitio. Edita aquí tu información personal,
 * redes sociales y metadatos. Es la única fuente de verdad del branding.
 */
export const site = {
  name: "Angel Daniel Genao Santamaria",
  role: "Desarrollador Junior de Software",
  tagline:
    "Técnico en Desarrollo de Software creando proyectos reales en equipo e individuales. Aprendizaje rápido, compromiso y ganas de aportar soluciones.",
  description:
    "Portafolio y tienda de aplicaciones de Angel Daniel Genao Santamaria — desarrollador junior de software. Proyectos CRUD, ETL, visualización de datos y sistemas fullstack.",
  email: "angeldnielgs@gmail.com",
  location: "Monte Plata, RD",
  avatar: "/me.png",
  cv: "/cv.pdf",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  socials: {
    github: "https://github.com/AngelDevRD",
    linkedin: "https://linkedin.com/in/tu-usuario",
    email: "mailto:angeldnielgs@gmail.com",
  },
} as const;

export type Site = typeof site;
