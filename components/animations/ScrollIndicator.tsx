'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'

export const ScrollIndicator = () => {
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.to(indicatorRef.current, {
      y: 10,
      opacity: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }, [])

  return (
    <div ref={indicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <ChevronDown className="w-6 h-6 text-foreground/50" />
    </div>
  )
}