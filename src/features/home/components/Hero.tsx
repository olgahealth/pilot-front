"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_METRICS = [
  { id: 'metric-1', value: 'USD 14.5B', label: 'en cuidado domiciliario pagados sin verificación electrónica en NY en un año' },
  { id: 'metric-2', value: '10%',       label: 'de pacientes reingresan al hospital dentro de los 30 días post-alta en Colombia' },
  { id: 'metric-3', value: '$2,500',    label: 'USD costo promedio por evento prevenible' },
  { id: 'metric-4', value: '0',         label: 'plataformas que integren todo el ecosistema en LATAM' },
];

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

      <section className="relative z-10 w-full pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-20"
            style={{ gridTemplateColumns: '1fr 0.9fr' }}
          >

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
            <div className="flex flex-col gap-5 relative">

              {/* Label */}
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                El costo oculto de la atención desconectada
              </p>

              {/* 4 metric cards */}
              <div className="grid grid-cols-2 gap-[18px]">
                {HERO_METRICS.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col gap-2 rounded-[28px] p-8 border border-[#0FB888]/18 bg-[#cffff0]/70 backdrop-blur-sm"
                    style={{ boxShadow: '0 24px 70px rgba(15,184,136,0.13)' }}
                  >
                    <span
                      className="text-4xl md:text-5xl font-extrabold text-[#0A1F1A] leading-none"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {m.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 leading-snug">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bohu — guía de visibilidad clínica (comentado temporalmente)
              <div className="flex justify-end items-end gap-4 mt-2">
                <AnimatePresence>
                  {showBubble && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="relative mb-2"
                    >
                      <div className="bg-white border border-[#0FB888]/30 rounded-2xl shadow-xl px-5 py-3 max-w-[220px]">
                        <p className="text-sm font-semibold text-[#0A1F1A] leading-snug">
                          "Hago visible el cuidado fuera del hospital."
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">— Bohu, guía clínica</p>
                      </div>
                      <div
                        className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-[#0FB888]/30 rotate-45"
                        style={{ boxShadow: '2px 2px 4px rgba(15,184,136,0.08)' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setShowBubble((v) => !v)}
                  onMouseEnter={() => setShowBubble(true)}
                  onMouseLeave={() => setShowBubble(false)}
                  className="cursor-pointer focus:outline-none flex-shrink-0"
                  aria-label="Bohu — guía de visibilidad clínica de OLGA"
                  title="Bohu — guía de visibilidad clínica"
                >
                  <img
                    src="/buhoolga-Photoroom.png"
                    alt="Bohu, guía de visibilidad clínica de OLGA"
                    className="w-32 h-32 object-contain drop-shadow-md"
                    style={{ animation: 'float 3s ease-in-out infinite' }}
                  />
                </button>
              </div>
              */}

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default OlgaHero;
