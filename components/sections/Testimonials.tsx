"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id:       string;
  name:     string;
  role:     string;
  company:  string;
  avatar:   string;
  text:     string;
  stars:    number;
  relation: "client" | "colleague" | "manager";
}

const testimonials: Testimonial[] = [
  {
    id: "t1", name: "Aminata Diallo", role: "CEO", company: "PayTech Africa", avatar: "AD",
    text: "Travailler avec lui a transformé notre vision produit en réalité. Il ne livre pas juste du code — il comprend les enjeux business et propose des solutions qui font vraiment sens. Notre plateforme de paiement mobile a atteint 10 000 utilisateurs en 3 mois.",
    stars: 5, relation: "client",
  },
  {
    id: "t2", name: "Moussa Ndiaye", role: "CTO", company: "Innovatech", avatar: "MN",
    text: "Un lead developer rare : il écrit un code propre, documente, forme les juniors, et reste focus sur la valeur produit. En 2 ans, il a multiplié la vélocité de l'équipe par 3 tout en réduisant les bugs de production de 80%.",
    stars: 5, relation: "manager",
  },
  {
    id: "t3", name: "Sophie Martin", role: "Product Manager", company: "Agence Digital+", avatar: "SM",
    text: "Ce qui m'a impressionnée c'est sa capacité à traduire des specs floues en produits finis. Il pose les bonnes questions, anticipe les edge cases et livre toujours dans les délais. Une vraie bouffée d'air dans notre équipe.",
    stars: 5, relation: "colleague",
  },
  {
    id: "t4", name: "Ibrahim Sow", role: "Fondateur", company: "EduTech Sénégal", avatar: "IS",
    text: "Notre plateforme d'apprentissage existe grâce à lui. Il a su gérer la complexité technique tout en gardant l'UX au centre. Les profs adorent l'interface, les étudiants aussi. Résultat : 94% de satisfaction utilisateur.",
    stars: 5, relation: "client",
  },
  {
    id: "t5", name: "Fatou Mbaye", role: "Développeuse Senior", company: "Innovatech", avatar: "FM",
    text: "Coder avec lui, c'est apprendre en continu. Il partage ses connaissances sans condescendance, fait des code reviews constructives, et crée une vraie culture de qualité dans l'équipe. Je suis meilleure dev grâce à lui.",
    stars: 5, relation: "colleague",
  },
];

const relationLabel: Record<Testimonial["relation"], string> = {
  client: "Client", colleague: "Collègue", manager: "Manager",
};
const relationColor: Record<Testimonial["relation"], string> = {
  client:    "text-violet-400 bg-violet-500/10 border-violet-500/20",
  colleague: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  manager:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

/* ── Carte ── */
const TestimonialCard = ({ t }: { t: Testimonial }) => (
  <div className="w-full bg-card border border-border/50 rounded-2xl p-7 md:p-10 relative">
    <Quote className="absolute top-6 right-8 w-10 h-10 text-primary/10" />
    <div className="flex gap-1 mb-5">
      {Array.from({ length: t.stars }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
    <blockquote className="text-base md:text-lg leading-relaxed text-foreground/90 mb-8 italic">
      &ldquo;{t.text}&rdquo;
    </blockquote>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20
                      flex items-center justify-center font-bold text-primary shrink-0">
        {t.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{t.name}</p>
        <p className="text-sm text-muted-foreground truncate">{t.role} — {t.company}</p>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${relationColor[t.relation]}`}>
        {relationLabel[t.relation]}
      </span>
    </div>
  </div>
);

/* ── Section ── */
export const Testimonials = () => {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const setCursorType = useStore((state) => state.setCursorType);
  const [current, setCurrent] = useState(0);
  const isAnimating   = useRef(false);
  const dragStartX    = useRef(0);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const total         = testimonials.length;

  /* Init : carte 0 visible, toutes les autres cachées en position absolue */
  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.set(card, {
        position: i === 0 ? 'relative' : 'absolute',
        top: 0, left: 0, width: '100%',
        opacity: i === 0 ? 1 : 0,
        x: 0,
        zIndex: i === 0 ? 1 : 0,
      });
    });
  }, []);

  /* Transition */
  const goTo = useCallback((index: number) => {
    if (isAnimating.current) return;
    const next = (index + total) % total;
    if (next === current) return;

    isAnimating.current = true;
    const outCard = cardRefs.current[current];
    const inCard  = cardRefs.current[next];
    if (!outCard || !inCard) { isAnimating.current = false; return; }

    const dir = (() => {
      if (current === total - 1 && next === 0) return 1;
      if (current === 0 && next === total - 1) return -1;
      return next > current ? 1 : -1;
    })();

    // Prépare la carte entrante : absolute, invisible, décalée
    gsap.set(inCard, { position: 'absolute', opacity: 0, x: dir * 80, zIndex: 2 });

    const tl = gsap.timeline({
      onComplete: () => {
        // La carte entrante devient relative (occupe l'espace), l'ancienne absolute/invisible
        gsap.set(inCard,  { position: 'relative', zIndex: 1, x: 0 });
        gsap.set(outCard, { position: 'absolute', zIndex: 0, x: 0, opacity: 0 });
        isAnimating.current = false;
      },
    });

    tl.to(outCard, { opacity: 0, x: -dir * 80, duration: 0.35, ease: 'power2.in' }, 0);
    tl.to(inCard,  { opacity: 1, x: 0,         duration: 0.4,  ease: 'power2.out' }, 0.25);

    setCurrent(next);
  }, [current, total]);

  /* Auto-play */
  useEffect(() => {
    const id = setInterval(() => goTo(current + 1), 5500);
    return () => clearInterval(id);
  }, [current, goTo]);

  /* Animations header + floating */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testi-header > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.7,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }
        }
      );
      gsap.to('.float-card-1', { y: -12, duration: 3,   repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.float-card-2', { y:  10, duration: 4,   repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      gsap.to('.float-card-3', { y:  -8, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Drag / swipe */
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };
  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff  = dragStartX.current - endX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  };

  return (
    <section ref={sectionRef} id="testimonials" className="py-20 md:py-32 relative overflow-hidden">

      {/* Fond flottant */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="float-card-1 absolute -left-8 top-20 w-48 h-28 bg-card border border-border/30 rounded-2xl rotate-[-8deg] opacity-40 hidden md:block" />
        <div className="float-card-2 absolute -right-4 top-40 w-40 h-24 bg-card border border-border/30 rounded-2xl rotate-6 opacity-30 hidden md:block" />
        <div className="float-card-3 absolute right-16 bottom-24 w-44 h-20 bg-card border border-border/30 rounded-2xl rotate-[-4deg] opacity-25 hidden md:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="testi-header text-center mb-14">
          <Badge variant="outline" className="mb-4"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}>
            Témoignages
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ce qu&apos;ils{' '}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-violet-400">
              disent
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Pas juste des projets livrés — des relations construites sur la confiance.
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">

          {/* Viewport — hauteur fixe pour éviter le collapse quand les cartes sont absolute */}
          <div
            className="relative overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
            style={{ minHeight: 320 }}
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
            onTouchStart={onDragStart}
            onTouchEnd={onDragEnd}
          >
            {testimonials.map((t, i) => (
              <div key={t.id} ref={(el) => { cardRefs.current[i] = el; }}>
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  onMouseEnter={() => setCursorType('hover')}
                  onMouseLeave={() => setCursorType('default')}
                  className={`rounded-full transition-all duration-300
                    ${i === current ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-border hover:bg-primary/50'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goTo(current - 1)}
                aria-label="Précédent"
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
                className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center
                           hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goTo(current + 1)}
                aria-label="Suivant"
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
                className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center
                           hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground/40 mt-4 font-mono">
            {current + 1} / {total}
          </p>
        </div>
      </div>
    </section>
  );
};