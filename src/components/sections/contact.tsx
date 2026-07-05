import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="section scroll-mt-24 py-24">
      <SectionHeader
        eyebrow="Contacto"
        title="Hablemos"
        subtitle="¿Tienes un proyecto en mente o una pregunta? Escríbeme y te respondo."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <Reveal direction="right" className="lg:col-span-2">
          <div className="card h-full space-y-6 p-6 sm:p-8">
            <div>
              <h3 className="text-xl font-semibold">Información de contacto</h3>
              <p className="mt-2 text-muted-foreground">
                Prefiero el correo, pero también me encuentras en mis redes.
              </p>
            </div>
            <div className="space-y-4">
              <a href={site.socials.email} className="flex items-center gap-3 text-sm hover:text-accent">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Mail className="h-5 w-5" />
                </span>
                {site.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <MapPin className="h-5 w-5" />
                </span>
                {site.location}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="glass flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105">
                <Github className="h-5 w-5" />
              </a>
              <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="glass flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal direction="left" className="lg:col-span-3">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
