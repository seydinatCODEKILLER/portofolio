'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(TextPlugin, ScrollTrigger)

type AnimationVariant = 'typing' | 'scramble' | 'reveal' | 'words'

interface AnimatedTextProps {
  text:        string
  as?:         'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  className?:  string
  delay?:      number
  duration?:   number
  variant?:    AnimationVariant
  gradient?:   boolean
  cursor?:     boolean
  onScroll?:   boolean
  highlight?:  string
}

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

export const AnimatedText = ({
  text,
  as: Tag = 'h1',
  className  = '',
  delay      = 0,
  duration   = 1.8,
  variant    = 'typing',
  gradient   = false,
  cursor     = true,
  onScroll   = false,
}: AnimatedTextProps) => {
  const containerRef  = useRef<HTMLDivElement>(null)
  const textRef       = useRef<HTMLElement | null>(null)
  const cursorRef     = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(false)

  /* ── Scramble effect (sans lib externe) ── */
  const runScramble = (el: HTMLElement, target: string, dur: number) => {
    let iter  = 0
    const total = target.length
    const fps   = 30
    const steps = Math.floor(dur * fps)

    const id = setInterval(() => {
      el.textContent = target
        .split('')
        .map((char, idx) => {
          if (char === ' ') return ' '
          if (idx < (iter / steps) * total) return target[idx]
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        })
        .join('')

      iter++
      if (iter > steps) {
        clearInterval(id)
        el.textContent = target
        setDone(true)
      }
    }, 1000 / fps)
  }

  /* ── Words reveal (chaque mot apparaît) ── */
  const runWords = (el: HTMLElement, target: string, dur: number, d: number) => {
    const words = target.split(' ')
    el.innerHTML = words
      .map((w) => `<span class="word-unit inline-block overflow-hidden"><span class="word-inner inline-block translate-y-full opacity-0">${w}</span></span>`)
      .join(' ')

    gsap.to(el.querySelectorAll('.word-inner'), {
      y: 0, opacity: 1,
      duration: dur / words.length + 0.3,
      stagger: dur / words.length,
      delay: d,
      ease: 'power3.out',
      onComplete: () => setDone(true),
    })
  }

  /* ── Reveal (clip path de bas en haut) ── */
  const runReveal = (el: HTMLElement, target: string, dur: number, d: number) => {
    el.textContent = target
    gsap.fromTo(el,
      { clipPath: 'inset(0 0 100% 0)', y: 20, opacity: 0 },
      {
        clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1,
        duration: dur,
        delay: d,
        ease: 'power3.out',
        onComplete: () => setDone(true),
      }
    )
  }

  /* ── Typing (GSAP TextPlugin) ── */
  const runTyping = (el: HTMLElement, target: string, dur: number, d: number) => {
    gsap.to(el, {
      duration: dur,
      delay: d,
      text: { value: target, delimiter: '' },
      ease: 'none',
      onComplete: () => setDone(true),
    })
  }

  useEffect(() => {
    const el = textRef.current
    if (!el) return

    const run = () => {
      switch (variant) {
        case 'scramble': runScramble(el, text, duration); break
        case 'words':    runWords(el, text, duration, delay); break
        case 'reveal':   runReveal(el, text, duration, delay); break
        default:         runTyping(el, text, duration, delay); break
      }
    }

    if (onScroll) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
        onEnter: run,
      })
    } else {
      run()
    }

    /* Curseur clignotant */
    if (cursor && cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, variant, duration, delay, onScroll])

  /* Masque le curseur quand l'animation est finie */
  useEffect(() => {
    if (done && cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.4, delay: 1 })
    }
  }, [done])

  const gradientClass = gradient
    ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-400 to-primary/60'
    : ''

  return (
    <div ref={containerRef} className="inline-flex items-baseline gap-0.5 flex-wrap">
      <Tag
        ref={(el) => { textRef.current = el as HTMLElement }}
        className={`${className} ${gradientClass}`}
      />
      {cursor && (
        <span
          ref={cursorRef}
          className="inline-block w-0.5 rounded-full bg-primary self-stretch ml-0.5"
          style={{ minHeight: '1em' }}
          aria-hidden
        />
      )}
    </div>
  )
}