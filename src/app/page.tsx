import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { AppStorePreview } from "@/components/sections/appstore-preview";
import { Contact } from "@/components/sections/contact";
import { Suggest } from "@/components/sections/suggest";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <AppStorePreview />
      <Contact />
      <Suggest />
    </>
  );
}
