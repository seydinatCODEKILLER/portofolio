"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import {
  Briefcase,
  GraduationCap,
  Code2,
  ChevronDown,
  MapPin,
  Calendar,
  ExternalLink,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type ItemType = "saas" | "project" | "education";

interface TimelineItem {
  id: string;
  type: ItemType;
  period: string;
  title: string;
  company: string;
  location: string;
  description: string;
  details: string[];
  stack?: string[];
  link?: string;
}

/* ─────────────────────────────────────────
   DONNÉES
───────────────────────────────────────── */
const timelineItems: TimelineItem[] = [
  {
    id: "moneywise",
    type: "saas",
    period: "2024",
    title: "Moneywise",
    company: "Projet personnel (SaaS)",
    location: "Remote",
    description:
      "Application SaaS de gestion financière intégrant un chatbot IA pour l’analyse et la discussion autour des dépenses.",
    details: [
      "Gestion des revenus, dépenses et budgets",
      "Chatbot IA pour analyser les finances et répondre aux questions utilisateurs",
      "Authentification sécurisée et gestion des rôles",
      "Dashboard interactif avec visualisation des données",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "OpenAI API",
    ],
  },
  {
    id: "organizly",
    type: "project",
    period: "2024",
    title: "Organizly",
    company: "Projet personnel (SaaS)",
    location: "Remote",
    description:
      "Plateforme SaaS de gestion d’organisations avec gestion des membres, rôles et permissions.",
    details: [
      "Création et gestion d’organisations multi-utilisateurs",
      "Système de rôles et permissions avancé",
      "Architecture multi-tenant",
      "Interface moderne et responsive",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "Prisma", "PostgreSQL"],
  },
  {
    id: "musseum",
    type: "saas",
    period: "2025",
    title: "Musseum",
    company: "Projet académique & personnel",
    location: "Remote",
    description:
      "Application de gestion de musée avec une expérience immersive en 3D pour la visite virtuelle.",
    details: [
      "Gestion des œuvres, artistes et expositions",
      "Visite immersive en 3D du musée",
      "Interface interactive orientée expérience utilisateur",
      "Projet combinant gestion et immersion visuelle",
    ],
    stack: ["Next.js", "TypeScript", "Three.js", "Node.js", "PostgreSQL"],
  },
  {
    id: "Licence Biologie",
    type: "education",
    period: "2020 — 2023",
    title: "Licence Biologie",
    company: "Université Cheikh Anta Diop",
    location: "Dakar, Sénégal",
    description:
      "Formation en biologie, combinant sciences de la vie et compétences en programmation.",
    details: [
      "Études approfondies en biologie cellulaire, génétique et écologie",
      "Projets de recherche intégrant analyse de données biologiques",
    ],
  },
  {
    id: "licence",
    type: "education",
    period: "2013 — 2016",
    title: "Licence Informatique",
    company: "Ecole Supérieure Professionnelle 221",
    location: "Dakar, Sénégal",
    description:
      "Fondamentaux en algorithmique, réseaux et développement logiciel.",
    details: [
      "Bases solides en algorithmique et structures de données",
      "Premiers projets web en HTML/CSS/JavaScript",
      "Participation active aux clubs tech et hackathons",
    ],
  },
];

/* ─────────────────────────────────────────
   CONFIG PAR TYPE
───────────────────────────────────────── */
const typeConfig: Record<
  ItemType,
  {
    icon: React.ElementType;
    label: string;
    color: string;
    dot: string;
  }
> = {
  saas: {
    icon: Briefcase,
    label: "SaaS",
    color: "text-violet-400",
    dot: "bg-violet-500",
  },
  project: {
    icon: Code2,
    label: "Projet",
    color: "text-cyan-400",
    dot: "bg-cyan-500",
  },
  education: {
    icon: GraduationCap,
    label: "Formation",
    color: "text-emerald-400",
    dot: "bg-emerald-500",
  },
};

/* ─────────────────────────────────────────
   FILTRE
───────────────────────────────────────── */
type FilterItem = {
  key: ItemType | "Tout";
  label: string
}

const FILTERS: FilterItem[] = [
  { key: 'Tout', label: 'Tout' },
  { key: 'saas', label: 'SaaS' },
  { key: 'project', label: 'Projets' },
  { key: 'education', label: 'Formation' },
]

/* ─────────────────────────────────────────
   TIMELINE ITEM CARD
───────────────────────────────────────── */
const TimelineCard = ({
  item,
  index,
  isLast,
}: {
  item: TimelineItem;
  index: number;
  isLast: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const setCursorType = useStore((state) => state.setCursorType);
  const cfg = typeConfig[item.type];
  const Icon = cfg.icon;

  /* Apparition au scroll */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dot pop
      gsap.fromTo(
        dotRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: index * 0.1,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
      // Card slide-in alternée
      gsap.fromTo(
        cardRef.current,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.1 + 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  /* Expansion au clic */
  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div className="relative flex gap-6 md:gap-8">
      {/* Colonne gauche : dot + ligne */}
      <div className="flex flex-col items-center shrink-0">
        <div
          ref={dotRef}
          className={`relative z-10 w-10 h-10 rounded-full ${cfg.dot}/20 border-2
                      border-current flex items-center justify-center shrink-0
                      ${cfg.color}`}
          style={{ borderColor: "currentColor" }}
        >
          <Icon className="w-4 h-4" />
          {/* Pulse */}
          <span
            className={`absolute inset-0 rounded-full ${cfg.dot}/30 animate-ping`}
          />
        </div>
        {/* Ligne verticale */}
        {!isLast && (
          <div className="timeline-line-seg w-px flex-1 bg-linear-to-b from-border/60 to-transparent mt-2" />
        )}
      </div>

      {/* Colonne droite : card */}
      <div ref={cardRef} className="flex-1 pb-10">
        {/* Période */}
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground/60 font-mono">
            {item.period}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full
                            bg-current/10 ${cfg.color}`}
            style={{
              backgroundColor:
                "color-mix(in srgb, currentColor 10%, transparent)",
            }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Card cliquable */}
        <button
          className="w-full text-left bg-card border border-border/50 rounded-xl p-5
                     hover:border-primary/30 transition-all duration-300 group
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setCursorType("hover")}
          onMouseLeave={() => setCursorType("default")}
          aria-expanded={open}
        >
          {/* Header card */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base md:text-lg leading-tight">
                {item.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <span className={`font-semibold text-sm ${cfg.color}`}>
                  {item.company}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary/60 hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Voir
                  </a>
                )}
              </div>
            </div>

            {/* Toggle icon */}
            <div
              className={`shrink-0 w-7 h-7 rounded-full border border-border/50
                             flex items-center justify-center transition-all duration-300
                             group-hover:border-primary/40 group-hover:bg-primary/5
                             ${open ? "bg-primary/10 border-primary/40" : ""}`}
            >
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-300
                            ${open ? "rotate-180 text-primary" : ""}`}
              />
            </div>
          </div>

          {/* Description courte */}
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {item.description}
          </p>

          {/* Stack (toujours visible) */}
          {item.stack && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 bg-background border border-border/50
                             rounded-md text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Détails expansibles */}
          <div
            ref={detailsRef}
            className="overflow-hidden"
            style={{ height: 0, opacity: 0 }}
          >
            <ul className="mt-4 space-y-2 border-t border-border/30 pt-4">
              {item.details.map((detail, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`}
                  />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   SECTION PRINCIPALE
───────────────────────────────────────── */
export const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const setCursorType = useStore((state) => state.setCursorType);
  const [filter, setFilter] = useState<ItemType | "Tout">("Tout");

  const filtered =
    filter === "Tout"
      ? timelineItems
      : timelineItems.filter((i) => i.type === filter);

  /* Header animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exp-header > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Fond déco */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/4 w-72 h-72 bg-violet-500/4 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-1/4 w-72 h-72 bg-cyan-500/4 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-3xl">
        {/* Header */}
        <div className="exp-header text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4"
            onMouseEnter={() => setCursorType("hover")}
            onMouseLeave={() => setCursorType("default")}
          >
            Parcours
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Expérience &{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-violet-400">
              Formation
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Des projets concrets, des SaaS fonctionnels et une forte culture
            produit.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              onMouseEnter={() => setCursorType("hover")}
              onMouseLeave={() => setCursorType("default")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
                          font-medium border transition-all duration-300
                          ${
                            filter === key
                              ? "bg-primary text-background border-primary shadow-glow-sm"
                              : "bg-card/50 border-border/50 text-muted-foreground hover:border-primary/40"
                          }`}
            >
              {key !== "Tout" && (
                <span
                  className={`w-2 h-2 rounded-full ${typeConfig[key as ItemType].dot}`}
                />
              )}
              {label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div>
          {filtered.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={index}
              isLast={index === filtered.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
