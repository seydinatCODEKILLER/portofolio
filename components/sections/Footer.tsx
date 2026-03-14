'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Github, Linkedin, Mail, ArrowUp, Code2 } from 'lucide-react'
import { useStore } from '@/store/useStore'

const socialLinks = [
  { icon: Github,   href: 'https://github.com',           label: 'GitHub'   },
  { icon: Linkedin, href: 'https://linkedin.com',          label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:contact@tondomaine.com', label: 'Email'    },
]

/* ─── Easter egg : texte caché au hover du copyright ─── */
const EasterEgg = () => {
  const [revealed, setRevealed] = useState(false)
  const txtRef                  = useRef<HTMLSpanElement>(null)

  const reveal = () => {
    setRevealed(true)
    gsap.fromTo(txtRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }
    )
  }
  const hide = () => {
    gsap.to(txtRef.current, {
      opacity: 0, y: 6, duration: 0.2,
      onComplete: () => setRevealed(false),
    })
  }

  return (
    <span
      className="relative cursor-help group"
      onMouseEnter={reveal}
      onMouseLeave={hide}
    >
      <span className="text-muted-foreground/40 text-xs select-none">
        © {new Date().getFullYear()} — Fait avec{' '}
        <span className="text-red-400">♥</span>
        {' '}& trop de café
      </span>
      {/* Tooltip easter egg */}
      {revealed && (
        <span
          ref={txtRef}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                     bg-card border border-primary/30 text-primary/80 text-xs
                     px-3 py-1.5 rounded-full pointer-events-none z-20 shadow-glow-sm"
        >
          🤫 Built with Next.js, GSAP & 3h du matin
        </span>
      )}
    </span>
  )
}

/* ─── Scroll to top ─── */
const ScrollTop = () => {
  const btnRef        = useRef<HTMLButtonElement>(null)
  const setCursorType = useStore((state) => state.setCursorType)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    gsap.to(btnRef.current, {
      opacity:  visible ? 1 : 0,
      y:        visible ? 0 : 10,
      duration: 0.3,
      pointerEvents: visible ? 'auto' : 'none',
    })
  }, [visible])

  return (
    <button
      ref={btnRef}
      aria-label="Retour en haut"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => { setCursorType('hover'); gsap.to(btnRef.current, { scale: 1.1, duration: 0.2 }) }}
      onMouseLeave={() => { setCursorType('default'); gsap.to(btnRef.current, { scale: 1,   duration: 0.2 }) }}
      className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center
                 hover:border-primary/40 hover:bg-primary/5 transition-colors opacity-0"
      style={{ pointerEvents: 'none' }}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  )
}

/* ─────────────────────────────────────────
   FOOTER PRINCIPAL
───────────────────────────────────────── */
export const Footer = () => {
  const footerRef         = useRef<HTMLElement>(null)
  const sloganRef         = useRef<HTMLParagraphElement>(null)
  const setCursorType     = useStore((state) => state.setCursorType)

  /* Animation d'entrée */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-item',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )

      /* Slogan : écriture lettre par lettre */
      const slogan   = sloganRef.current
      if (!slogan) return
      const original = slogan.textContent ?? ''
      slogan.innerHTML = original
        .split('')
        .map((c) => `<span class="slogan-char" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`)
        .join('')

      gsap.fromTo('.slogan-char',
        { opacity: 0, y: 8 },
        {
          opacity: 1, y: 0,
          stagger: 0.025,
          duration: 0.4,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, footerRef)
    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="border-t border-border/30 bg-background/50 backdrop-blur-sm"
    >
      {/* Ligne déco top */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col items-center gap-8">

          {/* Logo / nom */}
          <div className="footer-item flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20
                            flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">Afrocode.dev</span>
          </div>

          {/* Slogan animé */}
          <p
            ref={sloganRef}
            className="footer-item text-center text-muted-foreground/60 text-sm max-w-sm"
          >
            Transformer des idées complexes en expériences simples.
          </p>

          {/* Liens nav rapides */}
          <nav className="footer-item flex flex-wrap justify-center gap-6">
            {['Accueil', 'Projets', 'Expérience', 'Contact'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
                className="text-xs text-muted-foreground/50 hover:text-primary transition-colors duration-300"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Réseaux sociaux */}
          <div className="footer-item flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
                className="w-9 h-9 rounded-full border border-border/40 flex items-center justify-center
                           text-muted-foreground/50 hover:text-primary hover:border-primary/40
                           hover:bg-primary/5 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Séparateur */}
          <div className="footer-item w-full max-w-xs h-px bg-border/20" />

          {/* Bas : copyright + scroll top */}
          <div className="footer-item w-full flex flex-col sm:flex-row items-center
                          justify-between gap-4 max-w-lg">
            <EasterEgg />
            <ScrollTop />
          </div>

        </div>
      </div>
    </footer>
  )
}