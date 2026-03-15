'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StatItem {
  value:   number
  label:   string
  suffix?: string
  desc?:   string
  icon?:   string
}

interface AnimatedStatsProps {
  stats: StatItem[]
}

export const AnimatedStats = ({ stats }: AnimatedStatsProps) => {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Apparition des cards ── */
      gsap.fromTo('.stat-card',
        { y: 40, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      /* ── Ligne déco ── */
      gsap.fromTo('.stat-divider',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      /* ── Compteurs ── */
      stats.forEach((stat, index) => {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.value,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          onUpdate() {
            setCounts((prev) => {
              const next = [...prev]
              next[index] = Math.floor(obj.val)
              return next
            })
          },
          onComplete() {
            setCounts((prev) => {
              const next = [...prev]
              next[index] = stat.value
              return next
            })
          },
        })
      })

      /* ── Label des cards : lettres qui tombent ── */
      gsap.fromTo('.stat-label-char',
        { y: -10, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.015,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

    }, wrapRef)

    return () => ctx.revert()
  }, [stats])

  /* ── Hover handlers ── */
  const onEnter = (i: number) => {
    setActive(i)
    const el = cardRefs.current[i]
    if (el) gsap.to(el, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
  }

  const onLeave = (i: number) => {
    setActive(null)
    const el = cardRefs.current[i]
    if (el) gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' })
  }

  return (
    <div ref={wrapRef} className="relative">

      {/* Titre de la section */}
      <div className="text-center mb-10">
        <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary/60 mb-2">
          En chiffres
        </p>
        <div className="stat-divider w-16 h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto origin-left" />
      </div>

      {/* Grille */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el }}
            className="stat-card relative group cursor-default overflow-hidden rounded-2xl
                       bg-white dark:bg-card
                       border border-slate-200/80 dark:border-border/50
                       shadow-sm dark:shadow-none
                       p-6 text-center"
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={() => onLeave(i)}
          >
            {/* Glow de fond au hover */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-violet-500/5
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500
                            pointer-events-none" />

            {/* Bord top lumineux */}
            <div className="absolute top-0 left-4 right-4 h-px
                            bg-linear-to-r from-transparent via-primary/40 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Emoji / icon */}
            {stat.icon && (
              <div className="text-2xl mb-3 group-hover:animate-bounce inline-block">
                {stat.icon}
              </div>
            )}

            {/* Valeur animée */}
            <div className="relative mb-2">
              <span className="text-4xl md:text-5xl font-black tabular-nums
                               bg-clip-text text-transparent
                               bg-linear-to-br from-primary to-violet-400">
                {counts[i]}
              </span>
              <span className="text-2xl md:text-3xl font-black
                               bg-clip-text text-transparent
                               bg-linear-to-br from-primary to-violet-400">
                {stat.suffix}
              </span>
              {/* Reflet */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-px
                              bg-linear-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            {/* Label : lettres individuelles */}
            <p className="text-sm font-semibold text-slate-700 dark:text-foreground/80 mt-3 leading-snug">
              {stat.label.split('').map((char, ci) => (
                <span key={ci} className="stat-label-char inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </p>

            {/* Sous-texte optionnel */}
            {stat.desc && (
              <p className="text-xs text-slate-400 dark:text-muted-foreground/60 mt-1">
                {stat.desc}
              </p>
            )}

            {/* Numéro de rank discret */}
            <div className="absolute top-3 right-3 text-[10px] font-mono
                            text-primary/20 group-hover:text-primary/50 transition-colors">
              0{i + 1}
            </div>

            {/* Indicateur actif (optionnel) */}
            {active === i && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5
                              bg-linear-to-r from-transparent via-primary to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}