'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { X, Maximize2, Github, ExternalLink } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ══════════════════════════════════════════
   DEMOS
══════════════════════════════════════════ */

/* ── 1. Particle Field ── */
const ParticleField = ({ size = 'card' }: { size?: 'card' | 'full' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -999, y: -999 })
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const N = size === 'full' ? 140 : 80
    const particles = Array.from({ length: N }, (_, i) => ({
      x: ((i * 137.5) % 1) * (canvas.width || 400),
      y: ((i * 97.3 + 13) % 1) * (canvas.height || 300),
      vx: 0, vy: 0,
      r: ((i * 0.17) % 1) * 1.5 + 0.5,
    }))
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    canvas.addEventListener('mousemove', onMove)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mx, y: my } = mouseRef.current
      for (const p of particles) {
        const dx = p.x - mx, dy = p.y - my
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 120) { p.vx += (dx / d) * 0.8; p.vy += (dy / d) * 0.8 }
        p.vx += (((particles.indexOf(p) * 137.5) % 1) * canvas.width - p.x) * 0.02
        p.vy += (((particles.indexOf(p) * 97.3 + 13) % 1) * canvas.height - p.y) * 0.02
        p.vx *= 0.9; p.vy *= 0.9
        p.x += p.vx; p.y += p.vy
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167,139,250,0.8)'; ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 90) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(124,58,237,${(1 - d / 90) * 0.25})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); canvas.removeEventListener('mousemove', onMove) }
  }, [size])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

/* ── 2. Fluid Gradient ── */
const FluidGradient = () => {
  const boxRef = useRef<HTMLDivElement>(null)
  const b1 = useRef<HTMLDivElement>(null), b2 = useRef<HTMLDivElement>(null), b3 = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const box = boxRef.current; if (!box) return
    const fn = (e: MouseEvent) => {
      const r = box.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100
      gsap.to(b1.current, { x: `${x * 0.4}%`, y: `${y * 0.4}%`, duration: 1.5, ease: 'power2.out' })
      gsap.to(b2.current, { x: `${-x * 0.3}%`, y: `${-y * 0.3}%`, duration: 2, ease: 'power2.out' })
      gsap.to(b3.current, { x: `${x * 0.2}%`, y: `${y * 0.5}%`, duration: 1, ease: 'power2.out' })
    }
    box.addEventListener('mousemove', fn); return () => box.removeEventListener('mousemove', fn)
  }, [])
  return (
    <div ref={boxRef} className="relative w-full h-full overflow-hidden">
      <div ref={b1} className="absolute w-48 h-48 rounded-full bg-violet-500/40 blur-3xl top-1/4 left-1/4" />
      <div ref={b2} className="absolute w-56 h-56 rounded-full bg-cyan-500/30 blur-3xl bottom-1/4 right-1/4" />
      <div ref={b3} className="absolute w-40 h-40 rounded-full bg-pink-500/30 blur-3xl top-1/2 left-1/2" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm text-white/40 select-none font-mono">move cursor</p>
      </div>
    </div>
  )
}

/* ── 3. Magnetic Text ── */
const MagneticText = ({ word = 'CRÉATIF' }: { word?: string }) => {
  const handleMove = (e: React.MouseEvent, el: HTMLSpanElement) => {
    const r = el.getBoundingClientRect()
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.4, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.3, ease: 'power2.out' })
  }
  const handleLeave = (el: HTMLSpanElement) => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
  return (
    <div className="flex items-center justify-center w-full h-full gap-0.5 select-none">
      {word.split('').map((char, i) => (
        <span key={i} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text
                                  bg-linear-to-b from-white to-primary/60 cursor-pointer inline-block"
          onMouseMove={(e) => handleMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleLeave(e.currentTarget)}>
          {char}
        </span>
      ))}
    </div>
  )
}

/* ── 4. Wave Synth ── */
const WaveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0), mxRef = useRef(0)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const fn = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mxRef.current = (e.clientX - r.left) / r.width }
    canvas.addEventListener('mousemove', fn)
    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const W = canvas.width, H = canvas.height, mx = mxRef.current
      ;[
        { amp: 22, freq: 0.012, speed: 0.04, color: 'rgba(124,58,237,0.6)', offset: 0 },
        { amp: 15, freq: 0.018, speed: 0.06, color: 'rgba(167,139,250,0.45)', offset: 1 },
        { amp: 10, freq: 0.025, speed: 0.08, color: 'rgba(196,181,253,0.3)', offset: 2 },
      ].forEach(({ amp, freq, speed, color, offset }) => {
        ctx.beginPath(); ctx.moveTo(0, H / 2)
        for (let x = 0; x <= W; x += 2) {
          ctx.lineTo(x, H / 2 + Math.sin(x * freq + t * speed + offset) * amp + Math.sin(x * freq * 0.5 + t * speed * 0.7) * amp * 0.5 + Math.sin(mx * 6 + x * 0.01) * amp * 0.4)
        }
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke()
      })
      t++; rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); canvas.removeEventListener('mousemove', fn) }
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

/* ── 5. Noise Bars ── */
const NoiseGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const cells = Array.from({ length: 48 })
  const handleMove = (e: React.MouseEvent) => {
    const grid = gridRef.current; if (!grid) return
    const r = grid.getBoundingClientRect()
    grid.querySelectorAll<HTMLDivElement>('.noise-cell').forEach((cell) => {
      const cr = cell.getBoundingClientRect()
      const d = Math.sqrt((e.clientX - r.left - (cr.left - r.left + cr.width / 2)) ** 2 + (e.clientY - r.top - (cr.top - r.top + cr.height / 2)) ** 2)
      const s = Math.max(0, 1 - d / 160)
      gsap.to(cell, { scaleY: 1 + s * 3, backgroundColor: `rgba(124,58,237,${s * 0.8})`, duration: 0.3, ease: 'power2.out' })
    })
  }
  const handleLeave = () => gridRef.current?.querySelectorAll<HTMLDivElement>('.noise-cell').forEach((c) => gsap.to(c, { scaleY: 1, backgroundColor: 'rgba(124,58,237,0.15)', duration: 0.5 }))
  return (
    <div ref={gridRef} className="w-full h-full flex items-end justify-center pb-6 px-4" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div className="grid grid-cols-8 gap-1 w-full items-end">
        {cells.map((_, i) => (
          <div key={i} className="noise-cell rounded-sm origin-bottom"
            style={{ height: `${8 + ((i * 7 + 13) % 40)}px`, backgroundColor: 'rgba(124,58,237,0.15)' }} />
        ))}
      </div>
    </div>
  )
}

/* ── 6. Minimal Clock ── */
const MorphingClock = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id) }, [])
  const h = time.getHours() % 12, m = time.getMinutes(), s = time.getSeconds()
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-36 h-36">
        <div className="absolute inset-0 rounded-full border border-primary/30 bg-background/50" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute w-0.5 h-3 bg-primary/30 left-1/2 top-1 -translate-x-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${i * 30}deg)`, transformOrigin: '50% 68px' }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-0.5 h-10 bg-white rounded-full origin-bottom" style={{ transform: `rotate(${(h / 12) * 360 + (m / 60) * 30}deg) translateY(-50%)`, bottom: '50%' }} />
          <div className="absolute w-0.5 h-14 bg-primary/80 rounded-full origin-bottom" style={{ transform: `rotate(${(m / 60) * 360 + (s / 60) * 6}deg) translateY(-50%)`, bottom: '50%' }} />
          <div className="absolute w-px h-16 bg-rose-400 rounded-full origin-bottom" style={{ transform: `rotate(${(s / 60) * 360}deg) translateY(-50%)`, bottom: '50%' }} />
          <div className="absolute w-2 h-2 rounded-full bg-primary z-10" />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-primary/70 whitespace-nowrap">
          {String(time.getHours()).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}

/* ── 7. Ripple Click ── */
const RippleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const ripplesRef = useRef<{ x: number; y: number; r: number; alpha: number }[]>([])
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      ripplesRef.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, alpha: 1 })
    }
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      if (Math.random() < 0.08) ripplesRef.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, alpha: 0.5 })
    }
    canvas.addEventListener('click', onClick); canvas.addEventListener('mousemove', onMove)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ripplesRef.current = ripplesRef.current.filter((rp) => rp.alpha > 0.01)
      for (const rp of ripplesRef.current) {
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(167,139,250,${rp.alpha})`; ctx.lineWidth = 1.5; ctx.stroke()
        rp.r += 2.5; rp.alpha *= 0.93
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); canvas.removeEventListener('click', onClick); canvas.removeEventListener('mousemove', onMove) }
  }, [])
  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-mono text-white/30 select-none pointer-events-none">
        click ou bouge
      </p>
    </div>
  )
}

/* ── 8. Color Palette Generator ── */
const ColorPalette = () => {
  const [hue, setHue] = useState(262)
  const swatchRefs = useRef<(HTMLDivElement | null)[]>([])
  const shades = [10, 20, 35, 50, 65, 80, 90]
  const onEnter = (i: number) => { const el = swatchRefs.current[i]; if (el) gsap.to(el, { scaleY: 1.15, duration: 0.2, ease: 'power2.out' }) }
  const onLeave = (i: number) => { const el = swatchRefs.current[i]; if (el) gsap.to(el, { scaleY: 1, duration: 0.3, ease: 'power2.out' }) }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-6">
      <div className="flex gap-2 w-full items-end justify-center" style={{ height: 80 }}>
        {shades.map((l, i) => (
          <div key={i} ref={(el) => { swatchRefs.current[i] = el }}
            className="flex-1 rounded-lg cursor-pointer origin-bottom transition-shadow hover:shadow-lg"
            style={{ height: `${40 + i * 6}px`, backgroundColor: `hsl(${hue},70%,${l}%)` }}
            onMouseEnter={() => onEnter(i)} onMouseLeave={() => onLeave(i)} />
        ))}
      </div>
      <div className="w-full flex flex-col gap-1">
        <input type="range" min={0} max={360} value={hue} onChange={(e) => setHue(+e.target.value)}
          className="w-full accent-violet-500" />
        <p className="text-center text-xs font-mono text-white/40">hue: {hue}°</p>
      </div>
    </div>
  )
}

/* ── 9. Gravity Dots ── */
const GravityDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const dots = Array.from({ length: 30 }, (_, i) => ({
      x: ((i * 61 + 7) % 1) * (canvas.width || 400),
      y: ((i * 37 + 13) % 1) * (canvas.height || 300) * 0.5,
      vx: (((i * 0.23) % 1) - 0.5) * 1,
      vy: 0, r: ((i * 0.17) % 1) * 5 + 3,
      color: `hsl(${(i * 23) % 360},70%,65%)`,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const d of dots) {
        d.vy += 0.25; d.vx *= 0.995
        d.x += d.vx; d.y += d.vy
        if (d.y + d.r >= canvas.height) { d.y = canvas.height - d.r; d.vy *= -0.65; d.vx *= 0.98 }
        if (d.x - d.r <= 0) { d.x = d.r; d.vx *= -0.8 }
        if (d.x + d.r >= canvas.width) { d.x = canvas.width - d.r; d.vx *= -0.8 }
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = d.color; ctx.fill()
        ctx.beginPath(); ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill()
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

/* ── 10. CSS 3D Cube ── */
const CSS3DCube = () => {
  const cubeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    gsap.to(cubeRef.current, { rotationY: 360, rotationX: 360, duration: 12, repeat: -1, ease: 'none' })
  }, [])
  const faces = [
    { label: 'React',      bg: '#61dafb22', border: '#61dafb' },
    { label: 'Next.js',    bg: '#ffffff11', border: '#ffffff' },
    { label: 'TypeScript', bg: '#3178c622', border: '#3178c6' },
    { label: 'GSAP',       bg: '#88ce0222', border: '#88ce02' },
    { label: 'Node.js',    bg: '#68a06322', border: '#68a063' },
    { label: 'Tailwind',   bg: '#38bdf822', border: '#38bdf8' },
  ]
  const transforms = ['rotateY(0deg) translateZ(60px)', 'rotateY(180deg) translateZ(60px)', 'rotateY(90deg) translateZ(60px)', 'rotateY(-90deg) translateZ(60px)', 'rotateX(90deg) translateZ(60px)', 'rotateX(-90deg) translateZ(60px)']
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: 400 }}>
      <div ref={cubeRef} style={{ width: 120, height: 120, position: 'relative', transformStyle: 'preserve-3d' }}>
        {faces.map((f, i) => (
          <div key={i} className="absolute inset-0 flex items-center justify-center rounded-lg text-xs font-bold"
            style={{ transform: transforms[i], border: `1px solid ${f.border}40`, backgroundColor: f.bg, backfaceVisibility: 'visible', color: f.border }}>
            {f.label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   CONFIG
══════════════════════════════════════════ */
interface Demo {
  id:          string
  title:       string
  tag:         string
  tagColor:    string
  description: string
  details:     string
  tech:        string[]
  component:   React.ReactNode
  fullComponent?: React.ReactNode
  span?:       'wide'
}

const demos: Demo[] = [
  {
    id: 'particles', title: 'Particle Field', tag: 'Canvas', tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    description: 'Champ de particules réactif à la souris.',
    details: 'Chaque particule est attirée vers sa position d\'origine par un système de spring (vx += (ox - x) * 0.03). La souris crée une zone de répulsion radiale. Les connexions entre particules proches sont dessinées avec une opacité proportionnelle à la distance.',
    tech: ['Canvas API', 'requestAnimationFrame', 'Spring physics'],
    component: <ParticleField />, fullComponent: <ParticleField size="full" />, span: 'wide',
  },
  {
    id: 'fluid', title: 'Fluid Gradient', tag: 'GSAP', tagColor: 'text-green-400 bg-green-500/10 border-green-500/20',
    description: 'Blobs fluides qui suivent le curseur.',
    details: '3 blobs CSS avec blur-3xl se déplacent à des vitesses différentes (1s, 1.5s, 2s) via GSAP, créant un effet de parallaxe fluide. Chaque blob a une direction opposée pour le mouvement organique.',
    tech: ['GSAP', 'CSS blur', 'Mouse tracking'],
    component: <FluidGradient />,
  },
  {
    id: 'magnetic', title: 'Magnetic Text', tag: 'Élastique', tagColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    description: 'Lettres magnétiques avec retour élastique.',
    details: 'Chaque lettre est un span indépendant. Au survol, elle calcule son centre et s\'attire vers le curseur à 40% de la distance. Au départ, elle revient avec elastic.out(1, 0.4) — un ressort avec rebond.',
    tech: ['GSAP elastic.out', 'Per-letter DOM', 'Mouse delta'],
    component: <MagneticText />,
  },
  {
    id: 'wave', title: 'Wave Synth', tag: 'Canvas', tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    description: 'Ondes sinusoïdales réactives à la souris.',
    details: '3 couches de sinusoïdes superposées avec des fréquences et vitesses différentes. La position X de la souris module la phase des ondes, créant un effet audio-réactif. Chaque frame recalcule tous les points.',
    tech: ['Canvas API', 'Sinusoïdes', 'Phase modulation'],
    component: <WaveCanvas />, span: 'wide',
  },
  {
    id: 'noise', title: 'Noise Bars', tag: 'GSAP', tagColor: 'text-green-400 bg-green-500/10 border-green-500/20',
    description: 'Barres réactives à la proximité curseur.',
    details: 'Chaque barre calcule sa distance euclidienne au curseur. La hauteur scale et la couleur s\'intensifient inversement à la distance, créant un effet de "champ magnétique" autour du pointeur.',
    tech: ['GSAP', 'Distance euclidienne', 'CSS transform'],
    component: <NoiseGrid />,
  },
  {
    id: 'clock', title: 'Minimal Clock', tag: 'React', tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    description: 'Horloge analogique + digitale en temps réel.',
    details: 'Les angles des aiguilles sont calculés en degrés à partir des valeurs heures/minutes/secondes. La rotation CSS est appliquée via transform inline. Mise à jour toutes les secondes avec setInterval.',
    tech: ['React state', 'CSS transform', 'setInterval'],
    component: <MorphingClock />,
  },
  {
    id: 'ripple', title: 'Ripple Click', tag: 'Canvas', tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    description: 'Ondes concentriques au clic et au mouvement.',
    details: 'Chaque clic ou mouvement rapide génère un objet ripple {x, y, r, alpha}. À chaque frame, le rayon grandit et l\'alpha décroît multiplicativement (0.93x). Les ripples expirées sont filtrées du tableau.',
    tech: ['Canvas API', 'Objet pool', 'Alpha decay'],
    component: <RippleCanvas />,
  },
  {
    id: 'palette', title: 'Color Palette', tag: 'HSL', tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Générateur de palette HSL interactive.',
    details: 'La palette est générée en faisant varier la luminosité (10% → 90%) à teinte et saturation fixes. Un slider contrôle la teinte en temps réel. Les swatches ont un tilt 3D au hover via GSAP scaleY.',
    tech: ['HSL color space', 'GSAP', 'React state'],
    component: <ColorPalette />,
  },
  {
    id: 'gravity', title: 'Gravity Dots', tag: 'Physics', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Simulation physique de gravité et rebonds.',
    details: 'Chaque dot a une vélocité Y augmentée de 0.25px/frame (gravité). Les collisions avec le sol inversent la vélocité avec coefficient de restitution 0.65. Les murs rebondissent à 0.8. Friction légère sur X.',
    tech: ['Canvas API', 'Verlet integration', 'Collision detection'],
    component: <GravityDots />,
  },
  {
    id: 'cube', title: 'CSS 3D Cube', tag: '3D CSS', tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    description: 'Cube CSS 3D avec les technos de la stack.',
    details: 'Cube assemblé avec 6 faces positionnées via transform: rotateY/X + translateZ. La rotation continue est animée par GSAP. Chaque face affiche une techno de la stack avec sa couleur de marque.',
    tech: ['CSS 3D transform', 'preserve-3d', 'GSAP rotation'],
    component: <CSS3DCube />,
  },
]

/* ══════════════════════════════════════════
   MODAL DÉTAIL
══════════════════════════════════════════ */
const DemoModal = ({ demo, onClose }: { demo: Demo; onClose: () => void }) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    gsap.fromTo(panelRef.current, { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' })
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const close = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 })
    gsap.to(panelRef.current, { y: 20, opacity: 0, scale: 0.97, duration: 0.25, ease: 'power2.in', onComplete: onClose })
  }

  const onOverlayClick = (e: React.MouseEvent) => { if (e.target === overlayRef.current) close() }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn)
  })

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4
                                     bg-black/70 backdrop-blur-sm"
      onClick={onOverlayClick}>
      <div ref={panelRef} className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
                                      bg-slate-900 border border-border/60 rounded-3xl shadow-2xl">

        {/* Header modal */}
        <div className="flex items-start justify-between p-6 border-b border-border/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{demo.title}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${demo.tagColor}`}>{demo.tag}</span>
            </div>
            <p className="text-sm text-muted-foreground">{demo.description}</p>
          </div>
          <button onClick={close}
            className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center
                       text-muted-foreground hover:text-white hover:border-primary/50 transition-all shrink-0 ml-4">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo area (grande) */}
        <div className="relative bg-black/40 overflow-hidden" style={{ height: 320 }}>
          {demo.fullComponent ?? demo.component}
        </div>

        {/* Détails */}
        <div className="p-6 space-y-5">

          {/* Explication */}
          <div>
            <h3 className="text-xs font-mono tracking-widest uppercase text-primary/60 mb-2">Comment ça marche</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{demo.details}</p>
          </div>

          {/* Stack technique */}
          <div>
            <h3 className="text-xs font-mono tracking-widest uppercase text-primary/60 mb-2">Stack technique</h3>
            <div className="flex flex-wrap gap-2">
              {demo.tech.map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full
                                         bg-primary/10 text-primary/80 border border-primary/20">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                         bg-white/5 border border-border/40 text-muted-foreground
                         hover:text-white hover:border-primary/40 transition-all">
              <Github className="w-4 h-4" /> Code source
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                   bg-primary/10 border border-primary/20 text-primary/80
                                   hover:bg-primary/20 transition-all">
              <ExternalLink className="w-4 h-4" /> Demo plein écran
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   DEMO CARD
══════════════════════════════════════════ */
const DemoCard = ({ demo, index, onOpen }: { demo: Demo; index: number; onOpen: () => void }) => {
  const cardRef       = useRef<HTMLDivElement>(null)
  const setCursorType = useStore((state) => state.setCursorType)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: (index % 4) * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%', toggleActions: 'play none none reverse' } }
      )
    }, cardRef)
    return () => ctx.revert()
  }, [index])

  return (
    <div ref={cardRef}
      className={`relative bg-slate-900/80 dark:bg-card border border-border/40 rounded-2xl overflow-hidden
                  hover:border-primary/40 transition-all duration-300 group cursor-pointer
                  ${demo.span === 'wide' ? 'md:col-span-2' : ''}`}
      onMouseEnter={() => setCursorType('hover')}
      onMouseLeave={() => setCursorType('default')}
      onClick={onOpen}
    >
      {/* Demo area */}
      <div className="relative h-48 md:h-56 bg-black/30 overflow-hidden pointer-events-none">
        {demo.component}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-sm text-white">{demo.title}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${demo.tagColor}`}>{demo.tag}</span>
          </div>
          <p className="text-xs text-muted-foreground/70 line-clamp-1">{demo.description}</p>
        </div>
        <div className="w-7 h-7 rounded-lg border border-border/40 flex items-center justify-center shrink-0
                        group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
          <Maximize2 className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary/70" />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   SECTION PRINCIPALE
══════════════════════════════════════════ */
export const Playground = () => {
  const sectionRef            = useRef<HTMLDivElement>(null)
  const setCursorType         = useStore((state) => state.setCursorType)
  const [activeDemo, setActiveDemo] = useState<Demo | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.playground-header > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.7,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <section ref={sectionRef} id="playground" className="py-20 md:py-32 relative overflow-hidden">
        {/* Fond */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-transparent via-primary/8 to-transparent" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/8 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="playground-header text-center mb-14">
            <Badge variant="outline" className="mb-4"
              onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}>
              🧪 Playground
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Expéri<span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-violet-400">mentations</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Canvas, GSAP, interactions souris — ce que j&apos;explore quand personne ne regarde.
            </p>
            <p className="text-xs text-muted-foreground/40 mt-2 font-mono">
              Cliquez sur une carte pour voir les détails techniques
            </p>
          </div>

          {/* Grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {demos.map((demo, i) => (
              <DemoCard key={demo.id} demo={demo} index={i} onOpen={() => setActiveDemo(demo)} />
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground/30 mt-10 font-mono">
            {demos.length} démos — toutes en natif, aucune lib de rendu 3D
          </p>
        </div>
      </section>

      {/* Modal */}
      {activeDemo && <DemoModal demo={activeDemo} onClose={() => setActiveDemo(null)} />}
    </>
  )
}