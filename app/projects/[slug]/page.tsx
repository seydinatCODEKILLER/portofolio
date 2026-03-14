'use client'

import { useEffect, useRef } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowLeft, ExternalLink, Github,
  CheckCircle2, AlertCircle, Lightbulb,
  User, Layers, TrendingUp
} from 'lucide-react'
import { Project, projectsData } from '@/components/sections/Project'

gsap.registerPlugin(ScrollTrigger)

/* ── Bloc info générique ── */
const InfoBlock = ({
  icon: Icon, label, color, children,
}: {
  icon: React.ElementType
  label: string
  color: string
  children: React.ReactNode
}) => (
  <div className="bg-white dark:bg-card border border-slate-200/80 dark:border-border/50
                  rounded-2xl p-6 shadow-sm dark:shadow-none">
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-foreground">{label}</h3>
    </div>
    {children}
  </div>
)

/* ── Stat card ── */
const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center p-5 rounded-xl
                  bg-slate-50 dark:bg-background/50
                  border border-slate-200 dark:border-border/40">
    <p className="text-2xl font-black text-primary mb-1">{value}</p>
    <p className="text-xs text-slate-500 dark:text-muted-foreground">{label}</p>
  </div>
)

/* ── Page ── */
export default function ProjectDetailPage() {
  const params    = useParams()
  const slug      = params?.slug as string
  const project   = projectsData.find((p) => p.id === slug) as Project | undefined
  const pageRef   = useRef<HTMLDivElement>(null)
  const heroRef   = useRef<HTMLDivElement>(null)

  if (!project) notFound()

  /* Animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero */
      gsap.fromTo('.detail-hero-content > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      )

      /* Sections au scroll */
      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } }
        )
      })

      /* Parallax image hero */
      gsap.to('.hero-project-img', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 dark:bg-background">

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative h-[55vh] min-h-95 overflow-hidden">
        {/* Image */}
        <div className="hero-project-img absolute inset-0 scale-110">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className={`absolute inset-0 bg-linear-to-br ${project.color} opacity-30`} />
        <div className="absolute inset-0 bg-linear-to-t from-slate-50 dark:from-background via-transparent to-transparent" />

        {/* Back */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/#projects"
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-white/10 dark:bg-black/20 backdrop-blur-sm
                       border border-white/20 text-white text-sm
                       hover:bg-white/20 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" /> Retour aux projets
          </Link>
        </div>

        {/* Hero content */}
        <div className="detail-hero-content absolute bottom-10 left-0 right-0 px-6 md:px-12 max-w-5xl mx-auto">
          <span className={`inline-block text-xs font-semibold px-3 py-1 mb-4
                           rounded-full bg-linear-to-r ${project.color} text-white`}>
            {project.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
            {project.title}
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl">{project.solution}</p>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-10">

        {/* Liens rapides */}
        <div className="reveal-section flex flex-wrap gap-3">
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                         bg-primary text-background hover:bg-primary/90 transition-colors shadow-sm">
              <ExternalLink className="w-4 h-4" /> Voir le projet live
            </a>
          )}
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                         bg-white dark:bg-card border border-slate-200 dark:border-border/50
                         text-slate-700 dark:text-foreground
                         hover:border-primary/40 hover:text-primary transition-all shadow-sm">
              <Github className="w-4 h-4" /> Code source
            </a>
          )}
        </div>

        {/* Résultats chiffrés */}
        <div className="reveal-section">
          <h2 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Résultats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {project.results.map((r) => {
              const [value, ...rest] = r.split(' ')
              return <StatCard key={r} value={value} label={rest.join(' ')} />
            })}
          </div>
        </div>

        {/* Grille problème / solution / rôle */}
        <div className="reveal-section grid md:grid-cols-3 gap-4">
          <InfoBlock icon={AlertCircle} label="Le problème" color="from-red-500 to-rose-600">
            <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
              {project.problem}
            </p>
          </InfoBlock>

          <InfoBlock icon={Lightbulb} label="La solution" color="from-emerald-500 to-teal-600">
            <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
              {project.solution}
            </p>
          </InfoBlock>

          <InfoBlock icon={User} label="Mon rôle" color="from-violet-500 to-purple-600">
            <p className="text-sm font-semibold text-primary mb-3">{project.role}</p>
            <ul className="space-y-1.5">
              {['Architecture technique', 'Développement', 'Livraison'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-slate-500 dark:text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </InfoBlock>
        </div>

        {/* Stack */}
        <div className="reveal-section">
          <InfoBlock icon={Layers} label="Stack technique" color="from-cyan-500 to-blue-600">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium
                             bg-violet-50 dark:bg-primary/10
                             text-violet-700 dark:text-primary/80
                             border border-violet-200 dark:border-primary/20">
                  {tech}
                </span>
              ))}
            </div>
          </InfoBlock>
        </div>

        {/* Autres projets */}
        <div className="reveal-section border-t border-slate-200 dark:border-border/30 pt-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-foreground mb-6">
            Autres projets
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projectsData.filter((p) => p.id !== project.id).slice(0, 3).map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`}
                className="group flex items-center gap-3 p-4 rounded-xl
                           bg-white dark:bg-card
                           border border-slate-200 dark:border-border/50
                           hover:border-primary/40 hover:shadow-sm
                           transition-all duration-300">
                <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${p.color} shrink-0`} />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate text-slate-900 dark:text-foreground">{p.title}</p>
                  <p className="text-xs text-slate-400 dark:text-muted-foreground">{p.category}</p>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground/40 ml-auto shrink-0
                                      group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}