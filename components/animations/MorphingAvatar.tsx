'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

interface MorphingAvatarProps {
  src: string
  alt: string
}

export const MorphingAvatar = ({ src, alt }: MorphingAvatarProps) => {
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      avatarRef.current?.addEventListener('mouseenter', () => {
        gsap.to(avatarRef.current, {
          scale: 1.1,
          duration: 0.3
        })
      })

      avatarRef.current?.addEventListener('mouseleave', () => {
        gsap.to(avatarRef.current, {
          scale: 1,
          duration: 0.3
        })
      })
    }, avatarRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={avatarRef}
      className="relative w-full h-150 md:h-full overflow-hidden shadow-2xl"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
      
      {/* Overlay gradient pour un effet plus stylé */}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Élément décoratif animé */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <div className="absolute inset-0 bg-linear-to-r from-primary/30 to-transparent" />
      </div>
    </div>
  )
}