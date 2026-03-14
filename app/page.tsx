import { Hero } from "@/components/sections/Hero";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { About } from "@/components/sections/About";
import { ThemeToggle } from "@/components/themes/theme-toggle";
import { Skills } from "@/components/sections/Skills";
import { Project } from "@/components/sections/Project";
import { Playground } from "@/components/sections/Playground";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ThemeToggle />
      <main>
        <Hero />
        <About />
        <Skills />
        <Project  />
        <Playground />
      </main>
    </>
  );
}
