import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { AppCard } from "@/components/apps/app-card";
import { apps } from "@/data";

export function AppStorePreview() {
  const featured = [...apps].sort((a, b) => b.downloads - a.downloads).slice(0, 3);

  return (
    <section id="appstore" className="scroll-mt-24 bg-muted/30 py-24">
      <div className="section">
        <SectionHeader
          eyebrow="Mini App Store"
          title="Mis aplicaciones"
          subtitle="Una pequeña tienda con las apps que he creado. Descárgalas o explora la colección completa."
        />

        {featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <AppCard app={a} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <p className="py-8 text-center text-muted-foreground">
              Próximamente: mis primeras aplicaciones.
            </p>
          </Reveal>
        )}

        <Reveal className="mt-10 text-center">
          <Link href="/apps" className="btn-primary group">
            Ver toda la App Store
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
