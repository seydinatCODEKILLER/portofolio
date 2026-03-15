'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Zap, Target, Heart, LucideIcon } from 'lucide-react'
import { useStore } from '@/store/useStore'

gsap.registerPlugin(ScrollTrigger)

interface Specialty {
  icon:        LucideIcon
  title:       string
  description: string
  color:       string   // gradient classes
  glow:        string   // glow color rgba
  tag:         string   // mot-clé court
}

const specialties: Specialty[] = [
  {
    icon:        Zap,
    title:       'Performance',
    description: 'Optimisation fine des applications web pour des temps de chargement sub-secondes et une expérience fluide sur tous les devices.',
    color:       'from-amber-400 to-orange-500',
    glow:        'rgba(251,191,36,0.15)',
    tag:         'Core Web Vitals',
  },
  {
    icon:        Target,
    title:       'Scalabilité',
    description: 'Architectures robustes pensées pour grandir — de 10 à 100 000 utilisateurs sans réécriture, sans dette technique.',
    color:       'from-violet-500 to-purple-600',
    glow:        'rgba(139,92,246,0.15)',
    tag:         'Microservices',
  },
  {
    icon:        Heart,
    title:       'Expérience utilisateur',
    description: 'Des interfaces qui font sourire. Chaque interaction est pensée pour réduire la friction et faire aimer le produit.',
    color:       'from-pink-500 to-rose-500',
    glow:        'rgba(236,72,153,0.15)',
    tag:         'UX · Design System',
  },
]

export const Specialties = () => {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([])
  const setCursorType = useStore((state) => state.setCursorType)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Header */
      gsap.fromTo('.spec-header > *',
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      )

      /* Cards : entrée décalée */
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { y: 50, opacity: 0, rotateX: 8 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', toggleActions: 'play none none reverse' },
          }
        )
      })

      /* Ligne de séparation animée */
      gsap.fromTo('.spec-line',
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: 'power2.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* Tilt 3D sur les cards */
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const card = cardRefs.current[i]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
    const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
    gsap.to(card, {
      rotateX: -dy * 6, rotateY: dx * 6,
      transformPerspective: 700,
      duration: 0.3, ease: 'power1.out',
    })
  }

  const onMouseLeave = (i: number) => {
    const card = cardRefs.current[i]
    if (!card) return
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' })
  }

  return (
    <div ref={sectionRef} className="relative">

      {/* Header */}
      <div className="spec-header text-center mb-10">
        <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary/60 mb-3">
          Ce que je préfère résoudre
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-foreground mb-4">
          Ma spécialité
        </h3>
        <div className="spec-line w-20 h-px mx-auto origin-left
                        bg-linear-to-r from-transparent via-primary to-transparent" />
      </div>

      {/* Grid cards */}
      <div className="grid md:grid-cols-3 gap-5" style={{ perspective: '1000px' }}>
        {specialties.map((spec, i) => {
          const Icon = spec.icon
          return (
            <div
              key={spec.title}
              ref={(el) => { cardRefs.current[i] = el }}
              className="relative group rounded-2xl overflow-hidden cursor-default
                         bg-white dark:bg-card
                         border border-slate-200/80 dark:border-border/50
                         shadow-sm dark:shadow-none
                         hover:shadow-xl dark:hover:shadow-none
                         hover:border-slate-300 dark:hover:border-border
                         transition-shadow duration-300 p-7"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseMove={(e) => onMouseMove(e, i)}
              onMouseLeave={() => { onMouseLeave(i); setCursorType('default') }}
              onMouseEnter={() => setCursorType('hover')}
            >
              {/* Glow de fond au hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100
                           transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${spec.glow} 0%, transparent 70%)` }}
              />

              {/* Ligne top colorée */}
              <div className={`absolute top-0 left-6 right-6 h-px
                               bg-linear-to-r ${spec.color}
                               opacity-0 group-hover:opacity-100
                               transition-opacity duration-500`} />

              {/* Numéro */}
              <div className="absolute top-4 right-5 text-[11px] font-mono
                              text-slate-300 dark:text-muted-foreground/30
                              group-hover:text-primary/40 transition-colors">
                0{i + 1}
              </div>

              {/* Icône */}
              <div className={`relative w-14 h-14 rounded-2xl mb-6
                               bg-linear-to-br ${spec.color}
                               flex items-center justify-center
                               shadow-md group-hover:scale-110
                               transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
                {/* Reflet */}
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0
                                group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Tag */}
              <span className={`inline-block text-[10px] font-semibold tracking-wider uppercase
                                px-2.5 py-1 rounded-full mb-3
                                bg-linear-to-r ${spec.color}
                                bg-clip-text text-transparent
                                border border-slate-200 dark:border-border/50`}>
                {spec.tag}
              </span>

              {/* Titre */}
              <h4 className="text-lg font-bold text-slate-900 dark:text-foreground mb-3">
                {spec.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-slate-500 dark:text-muted-foreground leading-relaxed">
                {spec.description}
              </p>

              {/* Barre décorative bas */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5
                               bg-linear-to-r ${spec.color}
                               scale-x-0 group-hover:scale-x-100
                               transition-transform duration-500 origin-left`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}