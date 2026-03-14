"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store/useStore";

gsap.registerPlugin(ScrollTrigger);

export interface Skill {
  name: string;
  icon: React.ReactNode;
  level: number;
  category: "frontend" | "backend" | "devops" | "mobile" | "tools" | "soft";
  color: string;
}

interface SkillGalaxyProps {
  skills: Skill[];
}

/* ─── Vue mobile : grille de cards par catégorie ─── */
const MobileSkillGrid = ({ skills }: { skills: Skill[] }) => {
  const categorizedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  const categoryColors: Record<string, string> = {
    frontend: "from-blue-500 to-cyan-500",
    backend:  "from-green-500 to-emerald-500",
    devops:   "from-purple-500 to-pink-500",
    mobile:   "from-orange-500 to-red-500",
    tools:    "from-yellow-500 to-amber-500",
    soft:     "from-indigo-500 to-violet-500",
  };

  return (
    <div className="space-y-8 w-full">
      {Object.entries(categorizedSkills).map(([category, categorySkills]) => (
        <div key={category}>
          {/* Label catégorie */}
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3 pl-1">
            {category}
          </h3>

          {/* Skills de la catégorie */}
          <div className="grid grid-cols-2 gap-3">
            {categorySkills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-3 bg-card/50 border border-border/50
                           rounded-xl p-3 hover:border-primary/40 transition-colors"
              >
                {/* Icône avec fond gradient */}
                <div
                  className={`w-10 h-10 rounded-full bg-linear-to-br ${categoryColors[category]}
                               flex items-center justify-center shrink-0 text-white`}
                >
                  {skill.icon}
                </div>

                {/* Nom + barre */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{skill.name}</p>
                  <div className="mt-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${categoryColors[category]} rounded-full`}
                      style={{
                        width: `${skill.level}%`,
                        transition: "width 1s ease-out",
                      }}
                    />
                  </div>
                </div>

                {/* Niveau */}
                <span className="text-xs text-primary/70 font-bold shrink-0">
                  {skill.level}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Vue desktop : galaxie avec orbites ─── */
const DesktopSkillGalaxy = ({ skills }: { skills: Skill[] }) => {
  const galaxyRef   = useRef<HTMLDivElement>(null);
  const planetsRef  = useRef<(HTMLDivElement | null)[]>([]);
  const orbitsRef   = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const setCursorType = useStore((state) => state.setCursorType);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".galaxy-rotation", {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none",
      });

      orbitsRef.current.forEach((orbit, index) => {
        if (orbit) {
          gsap.to(orbit, {
            rotation: 360,
            duration: 20 + index * 5,
            repeat: -1,
            ease: "none",
            transformOrigin: "center center",
          });
        }
      });

      planetsRef.current.forEach((planet, index) => {
        if (!planet) return;
        gsap.fromTo(
          planet,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: galaxyRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
        gsap.to(planet, {
          y: -10,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.to(".galaxy-core", {
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, galaxyRef);

    return () => ctx.revert();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      frontend: "from-blue-500 to-cyan-500",
      backend:  "from-green-500 to-emerald-500",
      devops:   "from-purple-500 to-pink-500",
      mobile:   "from-orange-500 to-red-500",
      tools:    "from-yellow-500 to-amber-500",
      soft:     "from-indigo-500 to-violet-500",
    };
    return colors[category] ?? "from-gray-500 to-gray-500";
  };

  const categorizedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  const categories  = Object.keys(categorizedSkills);
  const orbitRadii  = [120, 180, 240, 300, 360];

  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id:    i,
        top:   `${(i * 37 + 13) % 100}%`,
        left:  `${(i * 61 + 7)  % 100}%`,
        delay: `${(i * 0.17)    % 5}s`,
      })),
    []
  );

  return (
    <div
      ref={galaxyRef}
      className="relative w-full min-h-200 flex items-center justify-center py-20"
    >
      {/* Noyau */}
      <div className="galaxy-core absolute w-32 h-32 rounded-full bg-linear-to-r from-primary to-primary/50 blur-sm animate-pulse" />

      {/* Étoiles */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}
      </div>

      {/* Orbites */}
      <div className="galaxy-rotation relative w-full h-full flex items-center justify-center">
        {categories.map((category, categoryIndex) => {
          const skillsInCategory = categorizedSkills[category];
          const orbitRadius      = orbitRadii[categoryIndex] ?? 400;
          const categoryColor    = getCategoryColor(category);

          return (
            <div key={category} className="absolute">
              <div
                ref={(el) => { orbitsRef.current[categoryIndex] = el; }}
                className="absolute rounded-full border border-primary/20"
                style={{
                  width:  orbitRadius * 2,
                  height: orbitRadius * 2,
                  left:   -orbitRadius,
                  top:    -orbitRadius,
                }}
              >
                {skillsInCategory.map((skill, skillIndex) => {
                  const angle      = (skillIndex / skillsInCategory.length) * Math.PI * 2;
                  const x          = Math.cos(angle) * orbitRadius;
                  const y          = Math.sin(angle) * orbitRadius;
                  const planetSize = 60 + skill.level * 0.4;

                  return (
                    <div
                      key={skill.name}
                      ref={(el) => { planetsRef.current[skillIndex + categoryIndex * 10] = el; }}
                      className="absolute cursor-pointer"
                      style={{
                        left:   x + orbitRadius - planetSize / 2,
                        top:    y + orbitRadius - planetSize / 2,
                        width:  planetSize,
                        height: planetSize,
                      }}
                      onMouseEnter={() => { setCursorType("hover"); setActiveSkill(skill); }}
                      onMouseLeave={() => { setCursorType("default"); setActiveSkill(null); }}
                    >
                      <div
                        className={`relative w-full h-full rounded-full bg-linear-to-br ${categoryColor} p-3
                                    shadow-lg hover:shadow-2xl transition-all duration-300
                                    flex items-center justify-center group`}
                        style={{
                          animation:      `float ${3 + skillIndex * 0.5}s ease-in-out infinite`,
                          animationDelay: `${skillIndex * 0.2}s`,
                        }}
                      >
                        <div className="text-white text-2xl group-hover:scale-110 transition-transform">
                          {skill.icon}
                        </div>
                        <div className="absolute -inset-1 rounded-full border-2 border-white/20
                                        group-hover:border-primary/50 transition-all duration-300" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-background
                                        border-2 border-primary flex items-center justify-center text-sm font-bold
                                        opacity-0 group-hover:opacity-100 transition-opacity">
                          {skill.level}%
                        </div>
                      </div>

                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2
                                      whitespace-nowrap bg-background/80 backdrop-blur-sm
                                      px-3 py-1 rounded-full text-sm border border-primary/30
                                      opacity-0 group-hover:opacity-100 transition-opacity">
                        {skill.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="absolute text-sm font-semibold uppercase tracking-wider text-primary/70"
                style={{
                  left:      -orbitRadius - 20,
                  top:       -20,
                  transform: `rotate(${categoryIndex * 30}deg)`,
                }}
              >
                {category}
              </div>
            </div>
          );
        })}
      </div>

      {activeSkill && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2
                        bg-background/90 backdrop-blur-md p-6 rounded-xl border border-primary/30
                        shadow-2xl z-10 max-w-md">
          <h3 className="text-2xl font-bold mb-2">{activeSkill.name}</h3>
          <div className="w-full bg-secondary h-2 rounded-full mb-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${activeSkill.level}%` }} />
          </div>
          <p className="text-muted-foreground">Niveau de maîtrise : {activeSkill.level}%</p>
        </div>
      )}
    </div>
  );
};

/* ─── Export principal : switch mobile / desktop ─── */
export const SkillGalaxy = ({ skills }: SkillGalaxyProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile
    ? <MobileSkillGrid    skills={skills} />
    : <DesktopSkillGalaxy skills={skills} />;
};