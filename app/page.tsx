import { Hero } from "@/components/sections/Hero";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { About } from "@/components/sections/About";
import { ThemeToggle } from "@/components/themes/theme-toggle";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ThemeToggle />
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
}
