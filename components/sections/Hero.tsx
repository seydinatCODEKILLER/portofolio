'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { AnimatedText } from '@/components/animations/AnimatedText'
import { ParallaxSection } from '@/components/animations/ParallaxSection'
import { ScrollIndicator } from '@/components/animations/ScrollIndicator'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react'

export const Hero = () => {
  const sectionRef = useScrollAnimation()
  const heroRef = useRef<HTMLDivElement>(null)
  const setCursorType = useStore((state) => state.setCursorType)
  
  useMousePosition()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      tl.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1
      })
      .from('.hero-role', {
        y: 50,
        opacity: 0,
        duration: 0.8
      }, '-=0.5')
      .from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 0.8
      }, '-=0.4')
      .from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
      }, '-=0.3')
      .from('.hero-social', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
      }, '-=0.2')
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-primary/5"
    >
      <div className="hero-bg absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[50px_50px]" />
      </div>

      <div ref={heroRef} className="relative z-10 container mx-auto px-4">
        <ParallaxSection speed={0.03} className="hero-content text-center">
          <AnimatedText
            text="Seydina Thiam"
            className="hero-title text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/50"
            delay={0.5}
          />

          <h2 className="hero-role text-2xl md:text-3xl text-muted-foreground mb-6">
            Développeur Full Stack · Architecte SaaS · Créateur expériences digitales
          </h2>

          <p className="hero-description text-lg md:text-xl max-w-2xl mx-auto mb-8 text-muted-foreground/80">
            Je transforme des idées complexes en expériences web fluides et intuitives. 
            Innovation et la performance au service de votre vision.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              className="group relative overflow-hidden"
              onMouseEnter={() => setCursorType('hover')}
              onMouseLeave={() => setCursorType('default')}
            >
              <span className="relative z-10 flex items-center">
                Voir mes projets
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onMouseEnter={() => setCursorType('hover')}
              onMouseLeave={() => setCursorType('default')}
            >
              Me contacter
            </Button>
          </div>

          <div className="hero-social flex gap-4 justify-center">
            {[
              { icon: Github, href: 'https://github.com', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </ParallaxSection>
      </div>

      <ScrollIndicator />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>
    </section>
  )
}