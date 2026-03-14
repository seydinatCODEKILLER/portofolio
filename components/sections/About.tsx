'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { MorphingAvatar } from '@/components/animations/MorphingAvatar'
import { AnimatedStats } from '@/components/animations/AnimatedStats'
import { useStore } from '@/store/useStore'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Code2, Heart, Target, Zap } from 'lucide-react'

const statsData = [
  { value: 5, label: 'Années d\'expérience', suffix: '+' },
  { value: 50, label: 'Projets réalisés', suffix: '+' },
  { value: 20, label: 'Clients satisfaits', suffix: '+' },
  { value: 100, label: 'Cafés bus', suffix: '+' }
]

const passions = [
  { icon: Code2, label: 'Code propre', color: 'text-blue-500' },
  { icon: Zap, label: 'Performance', color: 'text-yellow-500' },
  { icon: Target, label: 'Innovation', color: 'text-red-500' },
  { icon: Heart, label: 'UX/UI', color: 'text-pink-500' }
]

export const About = () => {
  const sectionRef = useScrollReveal({ threshold: 0.3, stagger: 0.1 })
  const setCursorType = useStore((state) => state.setCursorType)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-linear-to-b from-background to-background/95 relative overflow-hidden"
    >
      {/* Éléments de fond décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <Badge 
            variant="outline" 
            className="mb-4"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
          >
            À propos
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Qui je suis vraiment
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div ref={contentRef} className="space-y-20">
          {/* Section intro avec avatar */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                <span>Mon histoire</span>
              </h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Développeur passionné depuis plus de 5 ans, jai commencé mon parcours 
                  en créant des sites web pour des associations locales. Aujourdhui, 
                  jaccompagne des startups et entreprises dans leur transformation digitale.
                </p>
                <p>
                  Ce qui me motive ? Résoudre des problèmes complexes et créer des 
                  expériences qui font la différence. Je crois fermement que la technologie 
                  doit être au service de humain, pas inverse.
                </p>
                <p>
                  Ma philosophie : un code propre, une architecture solide et une attention 
                  particulière à expérience utilisateur. Pas juste des fonctionnalités, 
                  mais des solutions qui ont du sens.
                </p>
              </div>

              {/* Badges de passions */}
              <div className="flex flex-wrap gap-3 mt-6">
                {passions.map((passion, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border/50"
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                  >
                    <passion.icon className={`w-4 h-4 ${passion.color}`} />
                    <span className="text-sm">{passion.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2 relative h-full min-h-125 md:min-h-150 w-full">
              <MorphingAvatar
                src="/images/profile/avatar.jpeg"
                alt="Photo de profil"
              />
            </div>
          </div>

          {/* Section spécialité */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2">Ma spécialité</h3>
              <p className="text-muted-foreground">
                Ce que je préfère résoudre
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-background/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Optimisation des applications pour des temps de chargement ultra-rapides
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-background/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Scalabilité</h4>
                <p className="text-sm text-muted-foreground">
                  Architecture robuste qui évolue avec votre croissance
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-background/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Expérience utilisateur</h4>
                <p className="text-sm text-muted-foreground">
                  Des interfaces intuitives qui font aimer votre produit
                </p>
              </div>
            </div>
          </Card>

          {/* Statistiques */}
          <div className="pt-8">
            <AnimatedStats stats={statsData} />
          </div>

          {/* Call to action interne */}
          <div className="text-center pt-8">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Je suis toujours à la recherche de nouveaux défis et de projets passionnants. 
              Si vous avez une idée, je serais ravi en discuter !
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}