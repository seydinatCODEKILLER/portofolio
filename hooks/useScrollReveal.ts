'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface UseScrollRevealProps {
  threshold?: number
  stagger?: number
  delay?: number
}

export const useScrollReveal = <T extends HTMLElement>({
  threshold = 0.2,
  stagger = 0.2,
  delay = 0
}: UseScrollRevealProps = {}) => {
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = elementRef.current?.children
      
      if (elements) {
        gsap.fromTo(elements,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger,
            delay,
            scrollTrigger: {
              trigger: elementRef.current,
              start: `top ${100 - threshold * 100}%`,
              end: 'bottom 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }
    }, elementRef)

    return () => ctx.revert()
  }, [threshold, stagger, delay])

  return elementRef
}