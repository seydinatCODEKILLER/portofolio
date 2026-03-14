'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Skill {
  name: string
  level: number
}

interface TechRadarProps {
  skills: Skill[]
}

export const TechRadar = ({ skills }: TechRadarProps) => {
  const radarRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration du canvas
    canvas.width = 600
    canvas.height = 600
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = 250

    // Fonction pour dessiner le radar
    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dessiner les cercles concentriques
      for (let i = 1; i <= 5; i++) {
        const radius = (maxRadius / 5) * i
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)'
        ctx.stroke()
      }

      // Dessiner les axes
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius)
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)'
        ctx.stroke()
      }

      // Placer les compétences
      skills.forEach((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2
        const distance = (skill.level / 100) * maxRadius
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        // Dessiner le point
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 2 * Math.PI)
        ctx.fillStyle = `hsl(${index * 30}, 70%, 60%)`
        ctx.shadowColor = `hsl(${index * 30}, 70%, 60%)`
        ctx.shadowBlur = 15
        ctx.fill()

        // Ajouter le nom
        ctx.font = '12px Poppins'
        ctx.fillStyle = 'white'
        ctx.shadowBlur = 0
        ctx.fillText(skill.name, x + 15, y - 15)
      })
    }

    drawRadar()

    // Animation au scroll
    gsap.fromTo(canvas,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        scrollTrigger: {
          trigger: radarRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, [skills])

  return (
    <div ref={radarRef} className="relative flex justify-center items-center py-10">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto"
        style={{ filter: 'drop-shadow(0 0 20px rgba(100,100,255,0.3))' }}
      />
    </div>
  )
}