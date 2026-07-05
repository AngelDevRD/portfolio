import type { Metadata } from "next";
import { AppExplorer } from "@/components/apps/app-explorer";
import { getMobileProjects } from "@/data";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "App Store",
  description: "Explora todas mis aplicaciones móviles.",
};

export default async function AppsPage() {
  const apps = await getMobileProjects();

  return (
    <div className="section pt-32 pb-16">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
          Mini App Store
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl heading-gradient">
          Todas mis aplicaciones
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Busca, filtra y descubre. Cada app tiene su propia página con capturas, requisitos e historial de cambios.
        </p>
      </div>

      <AppExplorer apps={apps} />
    </div>
  );
}
