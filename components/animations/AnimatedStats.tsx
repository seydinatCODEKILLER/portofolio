'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StatItem {
  value: number
  label: string
  suffix?: string
}

interface AnimatedStatsProps {
  stats: StatItem[]
}

export const AnimatedStats = ({ stats }: AnimatedStatsProps) => {
  const statsRef = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    const ctx = gsap.context(() => {
      statsRef.current?.childNodes.forEach((child, index) => {
        gsap.to({}, {
          duration: 2,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          onUpdate: function() {
            const progress = this.progress()
            setCounts(prev => {
              const newCounts = [...prev]
              newCounts[index] = Math.floor(progress * stats[index].value)
              return newCounts
            })
          }
        })
      })
    }, statsRef)

    return () => ctx.revert()
  }, [stats])

  return (
    <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">
            {counts[index]}{stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}