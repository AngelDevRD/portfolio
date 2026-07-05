import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { SuggestionForm } from "@/components/forms/suggestion-form";

export function Suggest() {
  return (
    <section id="suggest" className="scroll-mt-24 bg-muted/30 py-24">
      <div className="section">
        <SectionHeader
          eyebrow="Propón una aplicación"
          title="¿Qué app te gustaría que creara?"
          subtitle="Comparte tu idea. Las mejores propuestas podrían convertirse en la próxima app de la tienda."
        />
        <Reveal className="mx-auto max-w-3xl">
          <SuggestionForm />
        </Reveal>
      </div>
    </section>
  );
}
