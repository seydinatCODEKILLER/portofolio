'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Heart, Code2, Zap, Target, Sparkles } from 'lucide-react'
import { useStore } from '@/store/useStore'

gsap.registerPlugin(ScrollTrigger)

const passions = [
  { icon: Code2,     label: 'Code propre',  color: 'text-blue-500',   bg: 'bg-blue-50   dark:bg-blue-500/10',   border: 'border-blue-200   dark:border-blue-500/20'   },
  { icon: Zap,       label: 'Performance',  color: 'text-amber-500',  bg: 'bg-amber-50  dark:bg-amber-500/10',  border: 'border-amber-200  dark:border-amber-500/20'  },
  { icon: Target,    label: 'Innovation',   color: 'text-red-500',    bg: 'bg-red-50    dark:bg-red-500/10',    border: 'border-red-200    dark:border-red-500/20'    },
  { icon: Heart,     label: 'UX/UI',        color: 'text-pink-500',   bg: 'bg-pink-50   dark:bg-pink-500/10',   border: 'border-pink-200   dark:border-pink-500/20'   },
  { icon: Sparkles,  label: 'Créativité',   color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/20' },
]

const paragraphs = [
  {
    highlight: 'Développeur passionné depuis plus de 5 ans',
    rest: ", j'ai commencé mon parcours en créant des sites web pour des associations locales. Aujourd'hui, j'accompagne des startups et entreprises dans leur transformation digitale.",
  },
  {
    highlight: 'Ce qui me motive ?',
    rest: " Résoudre des problèmes complexes et créer des expériences qui font la différence. Je crois fermement que la technologie doit être au service de l'humain, pas l'inverse.",
  },
  {
    highlight: 'Ma philosophie :',
    rest: " un code propre, une architecture solide et une attention particulière à l'expérience utilisateur. Pas juste des fonctionnalités — des solutions qui ont du sens.",
  },
]

export const AboutStory = () => {
  const containerRef  = useRef<HTMLDivElement>(null)
  const badgeRefs     = useRef<(HTMLDivElement | null)[]>([])
  const setCursorType = useStore((state) => state.setCursorType)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Titre ── */
      gsap.fromTo('.story-title',
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      )

      /* ── Ligne déco titre ── */
      gsap.fromTo('.story-title-line',
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.8, ease: 'power2.out', delay: 0.3,
          scrollTrigger: { trigger: containerRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      )

      /* ── Paragraphes : reveal ligne par ligne ── */
      gsap.fromTo('.story-para',
        { y: 24, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)',
          duration: 0.7,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 78%', toggleActions: 'play none none reverse' },
        }
      )

      /* ── Badges : pop depuis le bas ── */
      gsap.fromTo('.story-badge',
        { y: 20, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: containerRef.current, start: 'top 72%', toggleActions: 'play none none reverse' },
        }
      )

      /* ── Trait déco vertical ── */
      gsap.fromTo('.story-vline',
        { scaleY: 0 },
        {
          scaleY: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  /* Hover badges */
  const onBadgeEnter = (i: number) => {
    setCursorType('hover')
    const el = badgeRefs.current[i]
    if (el) gsap.to(el, { scale: 1.08, y: -3, duration: 0.25, ease: 'power2.out' })
  }
  const onBadgeLeave = (i: number) => {
    setCursorType('default')
    const el = badgeRefs.current[i]
    if (el) gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' })
  }

  return (
    <div ref={containerRef} className="relative">

      {/* ── Titre ── */}
      <div className="story-title flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-violet-500
                        flex items-center justify-center shadow-md shrink-0">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-foreground leading-tight">
            Mon histoire
          </h3>
          <div className="story-title-line mt-1 h-0.5 w-full origin-left
                          bg-linear-to-r from-primary via-violet-400 to-transparent" />
        </div>
      </div>

      {/* ── Paragraphes avec trait vertical ── */}
      <div className="relative pl-5">
        {/* Trait vertical */}
        <div className="story-vline absolute left-0 top-0 bottom-0 w-px origin-top
                        bg-linear-to-b from-primary/60 via-primary/20 to-transparent" />

        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="story-para text-base leading-relaxed
                                  text-slate-600 dark:text-muted-foreground">
              <span className="font-semibold text-slate-900 dark:text-foreground">
                {p.highlight}
              </span>
              {p.rest}
            </p>
          ))}
        </div>
      </div>

      {/* ── Séparateur ── */}
      <div className="my-7 flex items-center gap-3">
        <div className="flex-1 h-px bg-linear-to-r from-primary/20 to-transparent" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-primary/50">
          passions
        </span>
        <div className="flex-1 h-px bg-linear-to-l from-primary/20 to-transparent" />
      </div>

      {/* ── Badges de passions ── */}
      <div className="flex flex-wrap gap-2.5">
        {passions.map((passion, i) => {
          const Icon = passion.icon
          return (
            <div
              key={passion.label}
              ref={(el) => { badgeRefs.current[i] = el }}
              className={`story-badge flex items-center gap-2 px-4 py-2 rounded-full
                          border cursor-default select-none
                          ${passion.bg} ${passion.border}
                          transition-colors duration-200`}
              onMouseEnter={() => onBadgeEnter(i)}
              onMouseLeave={() => onBadgeLeave(i)}
            >
              <Icon className={`w-3.5 h-3.5 ${passion.color}`} />
              <span className={`text-sm font-medium ${passion.color}`}>
                {passion.label}
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}