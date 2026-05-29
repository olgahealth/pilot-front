"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hook: dispara cuando el elemento entra en viewport
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const HERO_METRICS = [
  { id: 'metric-1', value: 'USD 14.5B', label: 'en cuidado domiciliario pagados sin verificación electrónica en NY en un año' },
  { id: 'metric-2', value: '10%',       label: 'de pacientes reingresan al hospital dentro de los 30 días post-alta en Colombia' },
  { id: 'metric-3', value: '$2,500',    label: 'USD costo promedio por evento prevenible' },
  { id: 'metric-4', value: '0',         label: 'plataformas que integren todo el ecosistema en LATAM' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function MetricsGrid() {
  const { ref, inView } = useInView(0.2);

  return (
    <div className="flex flex-col gap-5 relative" ref={ref}>
      <motion.p
        className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        El costo oculto de la atención desconectada
      </motion.p>

      <div className="grid grid-cols-2 gap-[18px]">
        {HERO_METRICS.map((m, i) => (
          <motion.div
            key={m.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            whileHover={{ scale: 1.04, y: -6, boxShadow: '0 32px 80px rgba(15,184,136,0.22)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="flex flex-col gap-2 rounded-[20px] md:rounded-[28px] p-5 md:p-8 border border-[#0FB888]/20 bg-[#cffff0]/70 backdrop-blur-sm cursor-default"
            style={{ boxShadow: '0 24px 70px rgba(15,184,136,0.13)' }}
          >
            <span
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0A1F1A] leading-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {m.value}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 leading-snug">
              {m.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const OlgaHero: React.FC = () => {
  const [showBubble, setShowBubble] = useState(false);

  return (
    <div id="inicio" className="relative bg-white overflow-hidden">

      {/* Keyframe flotación */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>

      {/* Fondo gradiente */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #ffffff 0%, #ffffff 65%, #cffff0 100%)" }}
        />
      </div>

      <section className="relative z-10 w-full pt-20 md:pt-24 pb-14 md:pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] items-center gap-10 lg:gap-20">

            {/* ── IZQUIERDA ── */}
            <div className="flex flex-col gap-6 max-w-[640px]">

              {/* Pill */}
              <span className="inline-flex w-fit text-[11px] font-bold tracking-[0.18em] uppercase text-[#0FB888] px-4 py-2 bg-[#0FB888]/10 rounded-full border border-[#0FB888]/20">
                El sistema operativo del cuidado domiciliario
              </span>

              {/* Logo */}
              <h1
                className="font-extrabold tracking-tighter leading-[0.9] text-[#0A1F1A]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(80px, 10vw, 148px)' }}
              >
                <span className="text-[#0FB888]">o</span>lga<span className="text-[#0FB888]">.</span>
              </h1>

              {/* Headline */}
              <p
                className="text-2xl md:text-3xl font-semibold text-[#0A1F1A] leading-tight tracking-tight -mt-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                El paciente no desaparece<br className="hidden md:block" /> cuando sale del hospital.
              </p>

              {/* Body */}
              <p className="text-lg text-slate-500 leading-relaxed font-light max-w-[560px]">
                Hospitales, aseguradores, prestadores y familias coordinan cada visita, autorización y alerta en un solo flujo de trabajo — para que ningún paciente se pierda después del alta.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-[#0FB888] text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-[#0FB888]/25 hover:bg-[#0AA577] hover:-translate-y-0.5 transition-all duration-200"
                >
                  Solicitar demo
                </a>
                <a
                  href="#platform"
                  className="inline-flex items-center gap-2 bg-white text-[#0A1F1A] font-semibold text-sm px-7 py-3.5 rounded-full border border-slate-200 hover:border-[#0FB888]/40 hover:text-[#0FB888] transition-all duration-200"
                >
                  Ver plataforma →
                </a>
              </div>
            </div>

            {/* ── DERECHA ── */}
            <MetricsGrid />

            {/* Bohu — guía de visibilidad clínica (comentado temporalmente)
            <div className="flex justify-end items-end gap-4 mt-2">
              <button onClick={() => setShowBubble((v) => !v)} onMouseEnter={() => setShowBubble(true)} onMouseLeave={() => setShowBubble(false)} className="cursor-pointer focus:outline-none flex-shrink-0">
                <img src="/buhoolga-Photoroom.png" alt="Bohu" className="w-32 h-32 object-contain drop-shadow-md" style={{ animation: 'float 3s ease-in-out infinite' }} />
              </button>
            </div>
            */}

          </div>
        </div>
      </section>
    </div>
  );
};

export default OlgaHero;
