import Link from "next/link";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="section flex flex-col gap-8 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-sm">
            <p className="text-lg font-semibold">{site.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{site.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="glass flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="glass flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={site.socials.email}
              aria-label="Correo electrónico"
              className="glass flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a href={site.cv} download className="btn-secondary">
              <Download className="h-4 w-4" />
              Descargar CV
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/#projects" className="py-2 hover:text-foreground">Proyectos</Link>
            <Link href="/apps" className="py-2 hover:text-foreground">Apps</Link>
            <Link href="/#suggest" className="py-2 hover:text-foreground">Propón una app</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
