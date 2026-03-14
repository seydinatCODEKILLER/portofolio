'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type FilterCategory = 'Tous' | 'Frontend' | 'Backend' | 'SaaS' | 'Mobile'

interface Project {
  id: string
  title: string
  image: string
  problem: string
  solution: string
  stack: string[]
  role: string
  results: string[]
  category: FilterCategory
  links: {
    live?: string
    github?: string
  }
  color: string // accent color class
}

/* ─────────────────────────────────────────
   DONNÉES (à remplacer par les vrais projets)
───────────────────────────────────────── */
const projectsData: Project[] = [
  {
    id: 'saas-organizely',
    title: 'SaaS Organizations Dashboard',
    image: '/images/projects/dashbaord.png',
    problem: 'Les équipes perdaient des heures à compiler des données éparpillées dans 5 outils différents.',
    solution: 'Une plateforme unifiée qui centralise toutes les métriques en temps réel avec des visualisations interactives.',
    stack: ['React.js', 'TypeScript', 'MongoDB', 'Prisma', 'Recharts'],
    role: 'Lead Developer & Architecte',
    results: ['−70% de temps de reporting', '3x plus rapide', '200+ utilisateurs actifs'],
    category: 'SaaS',
    links: { live: 'https://perle-front.vercel.app/', github: 'https://github.com/seydinatCODEKILLER/perle-front.git' },
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'ecommerce-platform',
    title: 'Plateforme Financiere',
    image: '/images/projects/money.png',
    problem: 'Un client vendait 200 produits sur des marketplaces avec des marges réduites à cause des commissions.',
    solution: 'Boutique propriétaire avec paiement intégré, gestion des stocks et tableau de bord vendeur.',
    stack: ['React', 'Node.js', 'Stripe', 'MongoDB', 'Redis'],
    role: 'Full Stack Developer',
    results: ['+40% de marge nette', '0% de commissions', '1 200 commandes/mois'],
    category: 'Frontend',
    links: { live: 'https://frontend-money.vercel.app/' },
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'mobile-fitness',
    title: 'App Fitness Mobile',
    image: '/images/projects/phone.png',
    problem: 'Les coachs géraient leurs clients par WhatsApp — aucun suivi structuré ni historique.',
    solution: 'Application mobile complète avec plans personnalisés, suivi des séances et messagerie intégrée.',
    stack: ['React Native', 'Expo', 'Supabase', 'TypeScript'],
    role: 'Mobile Developer',
    results: ['4.8★ sur l\'App Store', '500+ téléchargements', '30 coachs onboardés'],
    category: 'Mobile',
    links: { github: 'https://github.com/seydinatCODEKILLER/Frontend-Money.git' },
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'api-gateway',
    title: 'API Gateway Moneytize',
    image: '/images/projects/dashbaord.png',
    problem: 'Une architecture monolithique qui ne tenait plus la charge aux heures de pointe.',
    solution: 'Migration vers une architecture en couche avec gateway centralisée, rate limiting et monitoring en temps réel.',
    stack: ['Node.js', 'Prisma', 'Cloudinary', 'Brevo', 'TypeScript'],
    role: 'Backend & DevOps',
    results: ['−60% de latence', '99.9% uptime', '10x la capacité'],
    category: 'Backend',
    links: { github: 'https://github.com/seydinatCODEKILLER/Backend-Money.git' },
    color: 'from-orange-500 to-red-600',
  },
]

const FILTERS: FilterCategory[] = ['Tous', 'Frontend', 'Backend', 'SaaS', 'Mobile']

/* ─────────────────────────────────────────
   PROJECT CARD avec tilt 3D
───────────────────────────────────────── */
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const cardRef   = useRef<HTMLDivElement>(null)
  const glowRef   = useRef<HTMLDivElement>(null)
  const setCursorType = useStore((state) => state.setCursorType)

  /* Entrée au scroll */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, cardRef)
    return () => ctx.revert()
  }, [index])

  /* Tilt 3D au hover souris */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect   = card.getBoundingClientRect()
    const cx     = rect.left + rect.width  / 2
    const cy     = rect.top  + rect.height / 2
    const dx     = (e.clientX - cx) / (rect.width  / 2)
    const dy     = (e.clientY - cy) / (rect.height / 2)
    const rotX   = -dy * 10
    const rotY   =  dx * 10

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      transformPerspective: 800,
      ease: 'power1.out',
      duration: 0.3,
    })

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: dx * 20,
        y: dy * 20,
        opacity: 0.6,
        duration: 0.3,
      })
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    gsap.to(card, {
      rotateX: 0, rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    })
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 })
    }
  }

  return (
    <div
      ref={cardRef}
      className="relative bg-card border border-border/50 rounded-2xl overflow-hidden
                 hover:border-primary/40 transition-colors duration-300 cursor-pointer group"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { handleMouseLeave(); setCursorType('default') }}
      onMouseEnter={() => setCursorType('hover')}
    >
      {/* Glow dynamique */}
      <div
        ref={glowRef}
        className={`absolute inset-0 bg-linear-to-br ${project.color} opacity-0 blur-2xl pointer-events-none transition-opacity`}
      />

      {/* Image / mockup */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-background/50">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // fallback si l'image n'existe pas encore
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent`} />

        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-linear-to-r ${project.color} text-white`}>
            {project.category}
          </span>
        </div>

        {/* Liens */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center
                         hover:bg-primary/20 transition-colors border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center
                         hover:bg-primary/20 transition-colors border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 md:p-6 space-y-4">
        <h3 className="text-lg md:text-xl font-bold">{project.title}</h3>

        {/* Problème → Solution */}
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-red-400 font-semibold shrink-0">Problème</span>
            <p className="text-muted-foreground line-clamp-2">{project.problem}</p>
          </div>
          <div className="flex gap-2">
            <span className="text-emerald-400 font-semibold shrink-0">Solution</span>
            <p className="text-muted-foreground line-clamp-2">{project.solution}</p>
          </div>
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary/80 rounded-md border border-primary/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Résultats */}
        <div className="flex flex-wrap gap-2 pt-1">
          {project.results.map((result) => (
            <span
              key={result}
              className="text-xs font-medium px-2.5 py-1 bg-card border border-border/50 rounded-full text-foreground/80"
            >
              {result}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary
                     group-hover:gap-3 transition-all duration-300 pt-1"
        >
          Voir le cas complet
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SECTION PRINCIPALE
───────────────────────────────────────── */
export const Project = () => {
  const sectionRef            = useRef<HTMLDivElement>(null)
  const setCursorType         = useStore((state) => state.setCursorType)
  const [active, setActive]   = useState<FilterCategory>('Tous')
  const [visible, setVisible] = useState<Project[]>(projectsData)
  const gridRef               = useRef<HTMLDivElement>(null)

  /* Animation de filtrage */
  const handleFilter = (filter: FilterCategory) => {
    if (filter === active) return

    const filtered = filter === 'Tous'
      ? projectsData
      : projectsData.filter((p) => p.category === filter)

    // Fade out → swap → fade in
    gsap.to(gridRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        setActive(filter)
        setVisible(filtered)
        gsap.to(gridRef.current, { opacity: 1, y: 0, duration: 0.3 })
      },
    })
  }

  /* Animation header au scroll */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects-header > *',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-violet-500/4 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* En-tête */}
        <div className="projects-header text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
          >
            Ce que jai construit
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Projets{' '}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-violet-400">
              concrets
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Des problèmes réels, des solutions mesurables.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilter(filter)}
              onMouseEnter={() => setCursorType('hover')}
              onMouseLeave={() => setCursorType('default')}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300
                ${active === filter
                  ? 'bg-primary text-background border-primary shadow-glow-sm'
                  : 'bg-card/50 border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
            >
              {filter}
              {filter !== 'Tous' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({projectsData.filter((p) => p.category === filter).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grille de projets */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Note qualité */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          Chaque projet représente un vrai problème résolu — pas juste du code.
        </p>
      </div>
    </section>
  )
}