'use client'

import { useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import gsap from 'gsap'

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorType = useStore((state) => state.cursorType)
  const mousePosition = useStore((state) => state.mousePosition)

  useEffect(() => {
    if (!cursorRef.current) return

    gsap.to(cursorRef.current, {
      x: mousePosition.x,
      y: mousePosition.y,
      duration: 0.3,
      ease: 'power2.out'
    })
  }, [mousePosition])

  const cursorClasses = {
    default: 'w-6 h-6 bg-primary/20 border border-primary',
    hover: 'w-12 h-12 bg-primary/30 border-2 border-primary scale-150',
    hidden: 'opacity-0'
  }

  return (
    <div
      ref={cursorRef}
      className={`
        fixed top-0 left-0 pointer-events-none z-50
        rounded-full transition-all duration-300
        ${cursorClasses[cursorType]}
      `}
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  )
}