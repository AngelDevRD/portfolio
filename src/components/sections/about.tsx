"use client";

import { motion } from "framer-motion";
import { Code2, Rocket, Target, Heart } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const technologies = [
  "Python", "Flutter", "SQL", "HTML", "CSS", "C#",
  "Git", "GitHub", "Visual Studio",
];

const highlights = [
  {
    icon: Code2,
    title: "Quién soy",
    text: "Técnico en Desarrollo de Software en formación en el Instituto Tecnológico de Las Américas (ITLA), con conocimientos en Python, Flutter, SQL, HTML, CSS, C# intermedio, Git/GitHub y Visual Studio.",
  },
  {
    icon: Rocket,
    title: "Mi experiencia",
    text: "He participado en proyectos reales en equipo aplicando metodología Scrum, incluyendo un sistema fullstack de reporte ciudadano, además de proyectos individuales de CRUD, ETL y visualización de datos.",
  },
  {
    icon: Heart,
    title: "Mi pasión",
    text: "Me caracterizo por el aprendizaje rápido, el trabajo en equipo y el compromiso con la mejora continua en cada proyecto que encaro.",
  },
  {
    icon: Target,
    title: "Mi objetivo",
    text: "Aportar soluciones tecnológicas de impacto y seguir creciendo como desarrollador, sumando experiencia real en equipo e individual.",
  },
];

export function About() {
  return (
    <section id="about" className="section scroll-mt-24 py-24">
      <SectionHeader
        eyebrow="Sobre mí"
        title="Conóceme un poco más"
        subtitle="Detrás de cada proyecto hay curiosidad, disciplina y muchas ganas de mejorar."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {highlights.map((h, i) => (
          <Reveal key={h.title} delay={i * 0.08}>
            <div className="card group h-full p-6 hover:border-accent/40 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                <h.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{h.title}</h3>
              <p className="mt-2 text-muted-foreground">{h.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <p className="mb-5 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Tecnologías favoritas
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 200 }}
              whileHover={{ y: -4, scale: 1.05 }}
              className="glass cursor-default rounded-2xl px-4 py-2.5 text-sm font-medium shadow-sm"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
