"use client";

import {
  Code2,
  Database,
  Cloud,
  Smartphone,
  Terminal,
  Github,
  Users,
  Server,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skill, SkillGalaxy } from "@/components/animations/SkillGalaxy";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useStore } from "@/store/useStore";

const skillsData: Skill[] = [
  // Frontend
  {
    name: "React",
    icon: <Code2 />,
    level: 90,
    category: "frontend",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Vue.js",
    icon: <Code2 />,
    level: 75,
    category: "frontend",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "TypeScript",
    icon: <Code2 />,
    level: 85,
    category: "frontend",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Next.js",
    icon: <Code2 />,
    level: 88,
    category: "frontend",
    color: "from-gray-500 to-gray-700",
  },

  // Backend
  {
    name: "Node.js",
    icon: <Server />,
    level: 85,
    category: "backend",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Python",
    icon: <Terminal />,
    level: 80,
    category: "backend",
    color: "from-yellow-500 to-amber-500",
  },
  {
    name: "PostgreSQL",
    icon: <Database />,
    level: 75,
    category: "backend",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "MongoDB",
    icon: <Database />,
    level: 70,
    category: "backend",
    color: "from-green-500 to-emerald-500",
  },

  // DevOps
  {
    name: "Docker",
    icon: <Cloud />,
    level: 65,
    category: "devops",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "AWS",
    icon: <Cloud />,
    level: 60,
    category: "devops",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "CI/CD",
    icon: <Terminal />,
    level: 70,
    category: "devops",
    color: "from-purple-500 to-pink-500",
  },

  // Mobile
  {
    name: "React Native",
    icon: <Smartphone />,
    level: 75,
    category: "mobile",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Flutter",
    icon: <Smartphone />,
    level: 60,
    category: "mobile",
    color: "from-blue-500 to-indigo-500",
  },

  // Tools
  {
    name: "Git",
    icon: <Github />,
    level: 90,
    category: "tools",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Figma",
    icon: <Code2 />,
    level: 70,
    category: "tools",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "VS Code",
    icon: <Code2 />,
    level: 95,
    category: "tools",
    color: "from-blue-500 to-cyan-500",
  },

  // Soft Skills
  {
    name: "Teamwork",
    icon: <Users />,
    level: 90,
    category: "soft",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Communication",
    icon: <Users />,
    level: 85,
    category: "soft",
    color: "from-yellow-500 to-amber-500",
  },
  {
    name: "Problem Solving",
    icon: <Code2 />,
    level: 88,
    category: "soft",
    color: "from-purple-500 to-pink-500",
  },
];

export const Skills = () => {
  const sectionRef = useScrollReveal({ threshold: 0.2, stagger: 0.1 });
  const setCursorType = useStore((state) => state.setCursorType);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-linear-to-b from-background to-background/95 relative overflow-hidden"
    >
      {/* Éléments de fond cosmiques */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px)
      `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4"
            onMouseEnter={() => setCursorType("hover")}
            onMouseLeave={() => setCursorType("default")}
          >
            Mon Arsenal
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/50">
            Compétences & Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un univers de technologies maîtrisées, des fondamentaux aux outils
            les plus pointus
          </p>
        </div>

        {/* Visualisation Galaxy */}
        <div className="relative">
          <SkillGalaxy skills={skillsData} />
        </div>

        {/* Légende des catégories */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {[
            { label: "Frontend", color: "from-blue-500 to-cyan-500" },
            { label: "Backend", color: "from-green-500 to-emerald-500" },
            { label: "DevOps", color: "from-purple-500 to-pink-500" },
            { label: "Mobile", color: "from-orange-500 to-red-500" },
            { label: "Tools", color: "from-yellow-500 to-amber-500" },
            { label: "Soft Skills", color: "from-indigo-500 to-violet-500" },
          ].map((cat) => (
            <div
              key={cat.label}
              className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50"
              onMouseEnter={() => setCursorType("hover")}
              onMouseLeave={() => setCursorType("default")}
            >
              <div
                className={`w-3 h-3 rounded-full bg-linear-to-r ${cat.color}`}
              />
              <span className="text-sm">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Nuage de mots-clés */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">
            Également familier avec
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "GraphQL",
              "WebSockets",
              "Jest",
              "Cypress",
              "Tailwind",
              "SASS",
              "Webpack",
              "Vite",
              "Kubernetes",
              "Redis",
            ].map((tech, index) => (
              <span
                key={tech}
                className="px-4 py-2 bg-secondary/50 rounded-full text-sm hover:bg-primary/20
                           hover:scale-110 transition-all duration-300 cursor-default"
                style={{
                  animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
