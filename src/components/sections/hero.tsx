"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { site } from "@/lib/site";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16"
    >
      <div className="section grid items-center gap-12 md:grid-cols-2">
        <motion.div style={{ y: yText, opacity }} variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Disponible para proyectos
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            <span className="heading-gradient">Hola, soy</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-sky-400 to-violet-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-pan">
              {site.name}
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-4 text-xl font-medium text-foreground/80">
            {site.role}
          </motion.p>

          <motion.p variants={item} className="mt-4 max-w-md text-lg text-muted-foreground">
            {site.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {site.location}
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link href="/#projects" className="btn-primary group">
              Ver proyectos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/#contact" className="btn-secondary">
              <Mail className="h-4 w-4" />
              Contáctame
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yImage }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-accent/30 via-violet-500/20 to-sky-400/20 blur-2xl" />
          <div className="glass-strong relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src={site.avatar}
              alt={`Fotografía de ${site.name}`}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 400px"
              className="object-cover"
            />
          </div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-strong absolute -bottom-5 -left-5 rounded-2xl px-4 py-3 shadow-xl"
          >
            <p className="text-2xl font-bold">4+</p>
            <p className="text-xs text-muted-foreground">años creando</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass-strong absolute -right-4 top-8 rounded-2xl px-4 py-3 shadow-xl"
          >
            <p className="text-2xl font-bold">15+</p>
            <p className="text-xs text-muted-foreground">proyectos</p>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        aria-hidden
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-current p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-current"
          />
        </div>
      </motion.div>
    </section>
  );
}
