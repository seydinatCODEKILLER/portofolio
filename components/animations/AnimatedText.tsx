'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export const AnimatedText = ({ 
  text, 
  className = '', 
  delay = 0,
  duration = 2 
}: AnimatedTextProps) => {
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay })
    
    tl.to(textRef.current, {
      duration,
      text: {
        value: text,
        delimiter: ''
      },
      ease: 'power2.out'
    })
  }, [text, delay, duration])

  return <h1 ref={textRef} className={className} />
}