"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import {
  Send,
  Github,
  Linkedin,
  Mail,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   TYPES & ÉTAT DU FORMULAIRE
───────────────────────────────────────── */
type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL: FormData = { name: "", email: "", subject: "", message: "" };

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com",
    color: "hover:text-white",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com",
    color: "hover:text-blue-400",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:contact@tondomaine.com",
    color: "hover:text-violet-400",
  },
];

/* ─────────────────────────────────────────
   CHAMP DE FORMULAIRE animé
───────────────────────────────────────── */
const FormField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  rows,
  required = true,
}: {
  label: string;
  id: keyof FormData;
  type?: string;
  value: string;
  onChange: (id: keyof FormData, val: string) => void;
  placeholder: string;
  rows?: number;
  required?: boolean;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(false);
  const filled = value.length > 0;

  const onFocus = () => {
    setFocus(true);
    gsap.to(wrapRef.current, { borderColor: "#7c3aed", duration: 0.25 });
    const glow = wrapRef.current?.querySelector<HTMLElement>(".field-glow");
    if (glow) gsap.to(glow, { opacity: 1, duration: 0.25 });
  };

  const onBlur = () => {
    setFocus(false);
    gsap.to(wrapRef.current, {
      borderColor: filled ? "#3d3862" : "#1e1b35",
      duration: 0.25,
    });
    const glow = wrapRef.current?.querySelector<HTMLElement>(".field-glow");
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.25 });
  };

  const sharedClass = `w-full bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground/40
                       outline-none resize-none ${rows ? "py-3" : "h-12 leading-none"}`;

  return (
    <div className="relative">
      {/* Label flottant */}
      <label
        htmlFor={id}
        className={`absolute left-4 pointer-events-none transition-all duration-200 z-10
                    ${
                      focus || filled
                        ? "-top-2 text-[11px] text-primary/80 bg-card px-1"
                        : "top-3 text-sm text-muted-foreground/50"
                    }`}
      >
        {label}
        {required && " *"}
      </label>

      {/* Input wrapper */}
      <div
        ref={wrapRef}
        className="relative rounded-xl border overflow-hidden"
        style={{ borderColor: "#1e1b35" }}
      >
        {/* Glow interne */}
        <div className="field-glow absolute inset-0 bg-primary/3 pointer-events-none opacity-0" />

        {rows ? (
          <textarea
            id={id}
            rows={rows}
            value={value}
            placeholder={focus ? placeholder : ""}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => onChange(id, e.target.value)}
            className={`${sharedClass} pt-5`}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            placeholder={focus ? placeholder : ""}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => onChange(id, e.target.value)}
            className={sharedClass}
          />
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   BOUTON CTA animé
───────────────────────────────────────── */
const SubmitButton = ({ state }: { state: FormState }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const setCursorType = useStore((state) => state.setCursorType);

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";

  useEffect(() => {
    if (state === "success") {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" },
      );
    }
  }, [state]);

  return (
    <button
      ref={btnRef}
      type="submit"
      disabled={isLoading || isSuccess}
      onMouseEnter={() => {
        setCursorType("hover");
        gsap.to(btnRef.current, { scale: 1.02, duration: 0.2 });
      }}
      onMouseLeave={() => {
        setCursorType("default");
        gsap.to(btnRef.current, { scale: 1, duration: 0.2 });
      }}
      className={`relative w-full h-12 rounded-xl font-semibold text-sm
                  flex items-center justify-center gap-2 overflow-hidden
                  transition-colors duration-300
                  ${
                    isSuccess
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                      : isError
                        ? "bg-red-500/20 border border-red-500/40 text-red-400"
                        : "bg-primary hover:bg-primary/90 text-background border border-primary"
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {/* Shimmer */}
      {!isSuccess && !isError && (
        <div
          className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform
                        duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent"
        />
      )}

      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {isSuccess && <CheckCircle2 className="w-4 h-4" />}
      {isError && <AlertCircle className="w-4 h-4" />}
      {!isLoading && !isSuccess && !isError && <Send className="w-4 h-4" />}

      <span>
        {isLoading
          ? "Envoi en cours..."
          : isSuccess
            ? "Message envoyé !"
            : isError
              ? "Erreur — réessayer"
              : "Envoyer le message"}
      </span>
    </button>
  );
};

/* ─────────────────────────────────────────
   SECTION PRINCIPALE
───────────────────────────────────────── */
export const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const setCursorType = useStore((state) => state.setCursorType);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<FormState>("idle");

  const handleChange = (id: keyof FormData, val: string) =>
    setForm((prev) => ({ ...prev, [id]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulation envoi (remplace par ton endpoint / Resend / EmailJS)
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("success");
    setTimeout(() => {
      setForm(INITIAL);
      setStatus("idle");
    }, 4000);
  };

  /* Header + form entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-left > *",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
      gsap.fromTo(
        ".contact-right",
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100
                        bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start max-w-5xl mx-auto">
          {/* Gauche — infos */}
          <div className="contact-left space-y-8">
            <div>
              <Badge
                variant="outline"
                className="mb-4"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                Contact
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Travaillons{" "}
                <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-violet-400">
                  ensemble
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Tu as un projet, une idée, ou juste envie d&apos;échanger ? Je
                réponds dans les 24h.
              </p>
            </div>

            {/* Disponibilité */}
            <div
              className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20
                            rounded-xl w-fit"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-400 font-medium">
                Disponible pour de nouveaux projets
              </span>
            </div>

            {/* Liens sociaux */}
            <div className="space-y-3">
              {socialLinks.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                  className={`flex items-center gap-3 text-sm text-muted-foreground
                               ${color} transition-all duration-300 group`}
                >
                  <div
                    className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center
                                  group-hover:border-primary/40 group-hover:bg-primary/5 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Droite — formulaire */}
          <div className="contact-right">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="Ton nom"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                />
                <FormField
                  label="Ton email"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jean@mail.com"
                />
              </div>
              <FormField
                label="Sujet"
                id="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Projet SaaS, collaboration, question…"
              />
              <FormField
                label="Ton message"
                id="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Décris ton projet ou ta question…"
                rows={5}
              />
              <SubmitButton state={status} />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
