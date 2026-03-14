'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '@/store/useStore'

interface SkillCardProps {
  skill: {
    name: string
    icon: React.ReactNode
    level: number
    description: string
    color: string
  }
  index: number
}

export const SkillCard = ({ skill, index }: SkillCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const setCursorType = useStore((state) => state.setCursorType)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation d'entrée
      gsap.fromTo(cardRef.current,
        {
          y: 50,
          opacity: 0,
          rotation: index % 2 === 0 ? -5 : 5
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animation de brillance au hover
      cardRef.current?.addEventListener('mouseenter', () => {
        gsap.to(cardRef.current, {
          scale: 1.05,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 30px rgba(100,100,255,0.3)',
          duration: 0.3
        })
      })

      cardRef.current?.addEventListener('mouseleave', () => {
        gsap.to(cardRef.current, {
          scale: 1,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          duration: 0.3
        })
      })
    }, cardRef)

    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={cardRef}
      className="relative bg-card p-6 rounded-xl border border-border/50 
                 hover:border-primary/50 transition-colors cursor-pointer
                 group overflow-hidden"
      onMouseEnter={() => setCursorType('hover')}
      onMouseLeave={() => setCursorType('default')}
    >
      {/* Effet de brillance en arrière-plan */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent 
                    -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      {/* Icône avec glow */}
      <div className={`text-4xl mb-4 group-hover:animate-pulse ${skill.color}`}>
        {skill.icon}
      </div>

      <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
      
      <p className="text-muted-foreground text-sm mb-4">{skill.description}</p>

      {/* Barre de progression animée */}
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <div
  className={`absolute inset-0 bg-linear-to-r ${skill.color} rounded-full`}
  style={{
    '--skill-level': `${skill.level}%`,
    animationDelay: `${index * 0.1}s`,
  } as React.CSSProperties}
/>
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>Débutant</span>
        <span>Expert</span>
      </div>

      {/* Pourcentage au centre */}
      <div className="absolute top-4 right-4 text-2xl font-bold text-primary/20">
        {skill.level}%
      </div>
    </div>
  )
}