'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = '' 
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return
      
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      
      const x = (clientX - innerWidth / 2) * speed
      const y = (clientY - innerHeight / 2) * speed
      
      gsap.to(sectionRef.current, {
        x,
        y,
        duration: 1,
        ease: 'power2.out'
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [speed])

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
}