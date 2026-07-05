"use client";

import { motion } from "framer-motion";
import {
  Layout, Server, Database, Smartphone, Sparkles, Cloud, Palette, type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { skillCategories } from "@/data/skills";

const icons: Record<string, LucideIcon> = {
  Layout, Server, Database, Smartphone, Sparkles, Cloud, Palette,
};

export function Skills() {
  return (
    <section id="skills" className="section scroll-mt-24 py-24">
      <SectionHeader
        eyebrow="Habilidades"
        title="Lo que domino"
        subtitle="Un stack pensado para llevar un producto de la idea al despliegue."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => {
          const Icon = icons[cat.icon] ?? Layout;
          return (
            <Reveal key={cat.title} delay={i * 0.06}>
              <div className="card h-full p-6 hover:border-accent/40 hover:shadow-xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{cat.title}</h3>
                </div>

                <div className="space-y-4">
                  {cat.skills.map((s) => (
                    <div key={s.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-muted-foreground">{s.level}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-sky-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
