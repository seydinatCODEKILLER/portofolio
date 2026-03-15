"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MorphingAvatar } from "@/components/animations/MorphingAvatar";
import { AnimatedStats } from "@/components/animations/AnimatedStats";
import { useStore } from "@/store/useStore";
import { Badge } from "@/components/ui/badge";
import { Specialties } from "../animations/Specialties";
import { AboutStory } from "../animations/Aboutstory";
import { AnimatedText } from "../animations/AnimatedText";

const statsData = [
  {
    value: 5,
    label: "Années d'expérience",
    suffix: "+",
    icon: "⚡",
    desc: "depuis 2019",
  },
  {
    value: 50,
    label: "Projets réalisés",
    suffix: "+",
    icon: "🚀",
    desc: "livrés en prod",
  },
  {
    value: 20,
    label: "Clients satisfaits",
    suffix: "+",
    icon: "🤝",
    desc: "en Europe & Afrique",
  },
  {
    value: 100,
    label: "Cafés bus",
    suffix: "+",
    icon: "☕",
    desc: "et quelques nuits",
  },
];

export const About = () => {
  const sectionRef = useScrollReveal({ threshold: 0.3, stagger: 0.1 });
  const setCursorType = useStore((state) => state.setCursorType);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-linear-to-b from-background to-background/95 relative overflow-hidden"
    >
      {/* Éléments de fond décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4"
            onMouseEnter={() => setCursorType("hover")}
            onMouseLeave={() => setCursorType("default")}
          >
            À propos
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Qui je suis vraiment
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div ref={contentRef} className="space-y-20">
          {/* Section intro avec avatar */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <AboutStory />
            </div>
            <div className="order-1 md:order-2 relative h-full min-h-125 md:min-h-150 w-full">
              <MorphingAvatar
                src="/images/profile/avatar.jpeg"
                alt="Photo de profil"
              />
            </div>
          </div>

          {/* Section spécialité */}
          <Specialties />

          {/* Statistiques */}
          <div className="pt-8">
            <AnimatedStats stats={statsData} />
          </div>

          <div className="text-center pt-8">
            <AnimatedText
              text="Je suis toujours à la recherche de nouveaux défis et de projets passionnants. Si vous avez une idée, je serais ravi d'en discuter !"
              as="p"
              variant="reveal"
              onScroll
              cursor={false}
              duration={0.9}
              className="text-md text-muted-foreground max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
