'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TimelineItem {
  year: string
  title: string
  description: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export const Timeline = ({ items }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation de la ligne centrale
      gsap.fromTo('.timeline-line',
        { height: 0 },
        {
          height: '100%',
          duration: 1.5,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          }
        }
      )

      // Animation des points et cartes
      gsap.fromTo('.timeline-dot',
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          stagger: 0.3,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      gsap.fromTo('.timeline-card',
        {
          opacity: 0,
          x: (index) => index % 2 === 0 ? -50 : 50
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.3,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, timelineRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={timelineRef} className="relative py-8">
      {/* Ligne centrale */}
      <div className="timeline-line absolute left-1/2 top-0 w-0.5 bg-primary/20 -translate-x-1/2" />
      
      <div className="space-y-12">
        {items.map((item, index) => (
          <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
            {/* Point sur la timeline */}
            <div className="timeline-dot absolute left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 z-10" />
            
            {/* Contenu */}
            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
              <div className="timeline-card bg-card p-6 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                <span className="text-primary font-bold text-xl">{item.year}</span>
                <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                <p className="text-muted-foreground mt-2">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}