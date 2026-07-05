import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { getWebProjects } from "@/data";

export async function Projects() {
  const projects = await getWebProjects();

  return (
    <section id="projects" className="section scroll-mt-24 py-24">
      <SectionHeader
        eyebrow="Proyectos"
        title="Cosas que he construido"
        subtitle="Busca por nombre o tecnología y filtra por categoría."
      />

      <Reveal className="mb-8">
        <ProjectExplorer projects={projects} />
      </Reveal>
    </section>
  );
}
