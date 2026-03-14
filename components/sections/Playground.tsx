'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { Maximize2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────
   DEMO 1 — Particle Field (Canvas)
───────────────────────────────────────── */
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: 0, y: 0 })
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particles
    const N = 80
    const particles = Array.from({ length: N }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  (Math.random() - 0.5) * 0.4,
      r:   Math.random() * 2 + 1,
    }))

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particles.forEach((p) => {
        // Repulsion from mouse
        const dx = p.x - mx
        const dy = p.y - my
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < 100) {
          p.vx += (dx / d) * 0.6
          p.vy += (dy / d) * 0.6
        }
        // Friction + move
        p.vx *= 0.96
        p.vy *= 0.96
        p.x  += p.vx
        p.y  += p.vy
        // Wrap
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167,139,250,0.7)'
        ctx.fill()
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(167,139,250,${(1 - d / 100) * 0.3})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  )
}

/* ─────────────────────────────────────────
   DEMO 2 — Fluid Gradient (CSS + mouse)
───────────────────────────────────────── */
const FluidGradient = () => {
  const boxRef   = useRef<HTMLDivElement>(null)
  const blob1Ref = useRef<HTMLDivElement>(null)
  const blob2Ref = useRef<HTMLDivElement>(null)
  const blob3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    const onMove = (e: MouseEvent) => {
      const rect = box.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width)  * 100
      const y = ((e.clientY - rect.top)  / rect.height) * 100

      gsap.to(blob1Ref.current, { x: `${x * 0.4}%`, y: `${y * 0.4}%`, duration: 1.5, ease: 'power2.out' })
      gsap.to(blob2Ref.current, { x: `${-x * 0.3}%`, y: `${-y * 0.3}%`, duration: 2, ease: 'power2.out' })
      gsap.to(blob3Ref.current, { x: `${x * 0.2}%`, y: `${y * 0.5}%`, duration: 1, ease: 'power2.out' })
    }

    box.addEventListener('mousemove', onMove)
    return () => box.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={boxRef} className="relative w-full h-full overflow-hidden rounded-xl">
      <div ref={blob1Ref} className="absolute w-48 h-48 rounded-full bg-violet-500/40 blur-3xl top-1/4 left-1/4" />
      <div ref={blob2Ref} className="absolute w-56 h-56 rounded-full bg-cyan-500/30 blur-3xl bottom-1/4 right-1/4" />
      <div ref={blob3Ref} className="absolute w-40 h-40 rounded-full bg-pink-500/30 blur-3xl top-1/2 left-1/2" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm text-white/50 select-none">Bouge ta souris</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   DEMO 3 — Magnetic Text
───────────────────────────────────────── */
const MagneticText = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const text = 'CRÉATIF'

  const handleMove = (e: React.MouseEvent, el: HTMLSpanElement) => {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = (e.clientX - cx) * 0.4
    const dy = (e.clientY - cy) * 0.4
    gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' })
  }

  const handleLeave = (el: HTMLSpanElement) => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full gap-1 select-none"
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text
                     bg-linear-to-b from-white to-primary/60 cursor-pointer inline-block"
          onMouseMove={(e) => handleMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleLeave(e.currentTarget)}
          style={{ display: 'inline-block' }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   DEMO 4 — Wave Canvas
───────────────────────────────────────── */
const WaveCanvas = () => {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const mouseXRef  = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseXRef.current = (e.clientX - rect.left) / rect.width
    }
    canvas.addEventListener('mousemove', onMove)

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const W = canvas.width
      const H = canvas.height
      const mx = mouseXRef.current

      const waves = [
        { amp: 20, freq: 0.012, speed: 0.04, color: 'rgba(124,58,237,0.5)',  offset: 0 },
        { amp: 14, freq: 0.018, speed: 0.06, color: 'rgba(167,139,250,0.4)', offset: 1 },
        { amp: 10, freq: 0.025, speed: 0.08, color: 'rgba(196,181,253,0.3)', offset: 2 },
      ]

      waves.forEach(({ amp, freq, speed, color, offset }) => {
        ctx.beginPath()
        ctx.moveTo(0, H / 2)
        for (let x = 0; x <= W; x += 2) {
          const y = H / 2
            + Math.sin(x * freq + t * speed + offset)        * amp
            + Math.sin(x * freq * 0.5 + t * speed * 0.7)    * amp * 0.5
            + Math.sin((mx * 6) + x * 0.01)                  * amp * 0.4
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = color
        ctx.lineWidth   = 2
        ctx.stroke()
      })

      t++
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

/* ─────────────────────────────────────────
   DEMO 5 — Noise Grid (CSS)
───────────────────────────────────────── */
const NoiseGrid = () => {
  const gridRef  = useRef<HTMLDivElement>(null)
  const cells    = Array.from({ length: 8 * 6 })

  const handleMove = (e: React.MouseEvent) => {
    const grid = gridRef.current
    if (!grid) return
    const rect = grid.getBoundingClientRect()
    const mx   = e.clientX - rect.left
    const my   = e.clientY - rect.top

    grid.querySelectorAll<HTMLDivElement>('.noise-cell').forEach((cell) => {
      const cr = cell.getBoundingClientRect()
      const cx = cr.left - rect.left + cr.width  / 2
      const cy = cr.top  - rect.top  + cr.height / 2
      const d  = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)
      const s  = Math.max(0, 1 - d / 160)
      gsap.to(cell, {
        scaleY:          1 + s * 3,
        backgroundColor: `rgba(124,58,237,${s * 0.8})`,
        duration:        0.3,
        ease:            'power2.out',
      })
    })
  }

  const handleLeave = () => {
    gridRef.current?.querySelectorAll<HTMLDivElement>('.noise-cell').forEach((cell) => {
      gsap.to(cell, { scaleY: 1, backgroundColor: 'rgba(124,58,237,0.15)', duration: 0.5 })
    })
  }

  return (
    <div
      ref={gridRef}
      className="w-full h-full flex items-end justify-center pb-6 px-4"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="grid grid-cols-8 gap-1 w-full items-end">
        {cells.map((_, i) => (
          <div
            key={i}
            className="noise-cell rounded-sm origin-bottom"
            style={{
              height:          `${8 + ((i * 7 + 13) % 40)}px`,
              backgroundColor: 'rgba(124,58,237,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   DEMO 6 — Clock Morphing
───────────────────────────────────────── */
const MorphingClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const h = time.getHours()   % 12
  const m = time.getMinutes()
  const s = time.getSeconds()

  const hDeg = (h / 12) * 360 + (m / 60) * 30
  const mDeg = (m / 60) * 360 + (s / 60) *  6
  const sDeg = (s / 60) * 360

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-36 h-36">
        {/* Cadran */}
        <div className="absolute inset-0 rounded-full border border-primary/30 bg-background/50" />
        {/* Marqueurs */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-3 bg-primary/30 left-1/2 top-1 origin-bottom -translate-x-1/2"
            style={{ transform: `translateX(-50%) rotate(${i * 30}deg)`, transformOrigin: '50% 68px' }}
          />
        ))}
        {/* Aiguilles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Heure */}
          <div
            className="absolute w-0.5 h-10 bg-white rounded-full origin-bottom"
            style={{ transform: `rotate(${hDeg}deg) translateY(-50%)`, bottom: '50%' }}
          />
          {/* Minute */}
          <div
            className="absolute w-0.5 h-14 bg-primary/80 rounded-full origin-bottom"
            style={{ transform: `rotate(${mDeg}deg) translateY(-50%)`, bottom: '50%' }}
          />
          {/* Seconde */}
          <div
            className="absolute w-px h-16 bg-rose-400 rounded-full origin-bottom"
            style={{ transform: `rotate(${sDeg}deg) translateY(-50%)`, bottom: '50%' }}
          />
          {/* Centre */}
          <div className="absolute w-2 h-2 rounded-full bg-primary z-10" />
        </div>
        {/* Heure digitale */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-primary/70 whitespace-nowrap">
          {String(time.getHours()).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   CONFIG DÉMOS
───────────────────────────────────────── */
interface Demo {
  id:          string
  title:       string
  tag:         string
  description: string
  component:   React.ReactNode
  span?:       'wide' | 'tall' | 'normal'
}

const demos: Demo[] = [
  {
    id:          'particles',
    title:       'Particle Field',
    tag:         'Canvas',
    description: 'Champ de particules réactif à la souris.',
    component:   <ParticleField />,
    span:        'wide',
  },
  {
    id:          'fluid',
    title:       'Fluid Gradient',
    tag:         'GSAP',
    description: 'Blobs fluides qui suivent le curseur.',
    component:   <FluidGradient />,
  },
  {
    id:          'magnetic',
    title:       'Magnetic Text',
    tag:         'CSS + GSAP',
    description: 'Lettres magnétiques élastiques.',
    component:   <MagneticText />,
  },
  {
    id:          'wave',
    title:       'Wave Synth',
    tag:         'Canvas',
    description: 'Ondes audio-réactives à la souris.',
    component:   <WaveCanvas />,
    span:        'wide',
  },
  {
    id:          'noise',
    title:       'Noise Bars',
    tag:         'GSAP',
    description: 'Barres réactives à la proximité.',
    component:   <NoiseGrid />,
  },
  {
    id:          'clock',
    title:       'Minimal Clock',
    tag:         'React',
    description: 'Horloge minimaliste animée.',
    component:   <MorphingClock />,
  },
]

/* ─────────────────────────────────────────
   DEMO CARD
───────────────────────────────────────── */
const DemoCard = ({ demo, index }: { demo: Demo; index: number }) => {
  const cardRef       = useRef<HTMLDivElement>(null)
  const setCursorType = useStore((state) => state.setCursorType)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          delay:    index * 0.1,
          ease:     'power3.out',
          scrollTrigger: {
            trigger:       cardRef.current,
            start:         'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, cardRef)
    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={cardRef}
      className={`relative bg-card border border-border/50 rounded-2xl overflow-hidden
                  hover:border-primary/40 transition-all duration-300 group
                  ${demo.span === 'wide' ? 'md:col-span-2' : ''}
                  ${demo.span === 'tall' ? 'row-span-2'    : ''}`}
      onMouseEnter={() => setCursorType('hover')}
      onMouseLeave={() => setCursorType('default')}
    >
      {/* Canvas / demo area */}
      <div className="relative h-52 md:h-64 bg-background/60 overflow-hidden">
        {demo.component}
        {/* Shimmer border top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className="p-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">{demo.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 border border-primary/20">
              {demo.tag}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{demo.description}</p>
        </div>
        <Maximize2 className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SECTION PRINCIPALE
───────────────────────────────────────── */
export const Playground = () => {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const setCursorType = useStore((state) => state.setCursorType)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.playground-header > *',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          scrollTrigger: {
            trigger:       sectionRef.current,
            start:         'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="playground"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="playground-header text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
          >
            🧪 Playground
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Expéri
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-violet-400">
              mentations
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Canvas, GSAP, interactions souris — ce que j&apos;explore quand personne ne regarde.
          </p>
        </div>

        {/* Grille de démos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {demos.map((demo, i) => (
            <DemoCard key={demo.id} demo={demo} index={i} />
          ))}
        </div>

        {/* Note de bas */}
        <p className="text-center text-xs text-muted-foreground/50 mt-10">
          Toutes les animations tournent en natif — aucune lib de rendu 3D externe.
        </p>
      </div>
    </section>
  )
}