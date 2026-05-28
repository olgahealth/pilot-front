import React from 'react';

// Íconos inline — cada uno con paths verificados (Sin cambios)
const PHASE_2_ICONS: Record<string, React.ReactNode> = {
  'i-activity': (
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  ),
  'i-brain': (
    <>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.97-3.06 2.5 2.5 0 0 1-2.51-4.58 2.5 2.5 0 0 1 2.98-3.07A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.97-3.06 2.5 2.5 0 0 0 2.51-4.58 2.5 2.5 0 0 0-2.98-3.07A2.5 2.5 0 0 0 14.5 2z" />
    </>
  ),
  'i-stethoscope': (
    <>
      <circle cx="12" cy="17" r="3" />
      <path d="M8 6a4 4 0 0 0-4 4v2a8 8 0 0 0 8 8 8 8 0 0 0 8-8v-2a4 4 0 0 0-4-4" />
      <path d="M8 6V4M16 6V4" />
    </>
  ),
  'i-hospital': (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
      <line x1="12" y1="7" x2="12" y2="11" />
      <line x1="10" y1="9" x2="14" y2="9" />
    </>
  ),
  'i-trending': (
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
  ),
};

const Ico = ({ id, className = "w-6 h-6" }: { id: string, className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} fill-none stroke-current`}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {PHASE_2_ICONS[id]}
  </svg>
);

const PhaseTwo = () => {
  const cards = [
    {
      id: 'i-activity',
      title: 'Monitoreo IoT continuo',
      desc: 'Dispositivos médicos certificados en casa del paciente. Signos vitales 24/7 sin depender de visitas físicas.',
      accent: 'bg-blue-500'
    },
    {
      id: 'i-brain',
      title: 'Cerebro clínico',
      desc: 'Triage inteligente con protocolos por patología. Alertas predictivas que detectan el riesgo antes del deterioro.',
      accent: 'bg-purple-500'
    },
    {
      id: 'i-stethoscope',
      title: 'Panel de enfermería 24/7',
      desc: 'Equipo clínico monitoreando pacientes en tiempo real desde un centro de comando virtual permanente.',
      accent: 'bg-[#0FB888]'
    },
    {
      id: 'i-hospital',
      title: 'Hospital en Casa',
      desc: 'Atención hospitalaria completa en el domicilio. El paciente solo pisa urgencias si es estrictamente necesario.',
      accent: 'bg-red-500'
    },
    {
      id: 'i-trending',
      title: 'Inteligencia de datos',
      desc: 'Análisis poblacional y modelos predictivos que generan evidencia clínica para todo el ecosistema de salud.',
      accent: 'bg-orange-500'
    },
  ];

  return (
    <section className="py-24 md:py-32 px-6 bg-[#F8FAFC] relative overflow-hidden" id="fase2">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* CABECERA */}
        <div className="flex flex-col items-center text-center mb-20">
          
          {/* Badge Píldora animada */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0FB888]/10 border border-[#0FB888]/20 text-[#0FB888] text-[11px] font-bold uppercase tracking-[0.15em] mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FB888] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FB888]" />
            </span>
            Fase 2 — Escalamiento
          </div>

          <h2 
            className="text-4xl md:text-5xl lg:text-[64px] text-[#0A1F1A] mb-8 font-extrabold leading-[1.05] tracking-tighter"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            De verificación a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FB888] to-[#2BB38E]">
              Hospital en Casa
            </span>
          </h2>

          <p className="max-w-2xl text-slate-500 text-lg md:text-xl font-light leading-relaxed">
            Una vez conectado el ecosistema, OLGA escala el modelo para habilitar
            atención hospitalaria de <strong className="text-[#0A1F1A] font-medium">alta complejidad fuera de la institución.</strong>
          </p>
        </div>

        {/* GRID DE TARJETAS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative p-8 md:p-10 rounded-[2rem] bg-white border border-slate-100 hover:border-[#0FB888]/20 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(15,184,136,0.06)] flex flex-col items-start overflow-hidden"
            >
              {/* Dot decorativo */}
              <div className={`absolute top-8 right-8 w-2 h-2 rounded-full ${card.accent} opacity-20 group-hover:opacity-100 transition-opacity duration-300 shadow-sm`} />

              {/* Ícono */}
              <div className="w-14 h-14 rounded-2xl bg-[#F0FBF6] text-[#0FB888] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#0FB888] group-hover:text-white transition-all duration-500 shadow-sm">
                <Ico id={card.id} className="w-7 h-7" />
              </div>

              {/* Contenido */}
              <h4 
                className="text-[#0A1F1A] text-xl md:text-2xl font-bold mb-3 tracking-tight transition-colors group-hover:text-[#0FB888]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {card.title}
              </h4>

              <p className="text-slate-500 text-[0.95rem] leading-relaxed font-light transition-colors group-hover:text-slate-600">
                {card.desc}
              </p>

              {/* Línea de progreso animada en el fondo */}
              <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-[#0FB888]/80 to-[#2BB38E]/40 transition-all duration-700 ease-out" />
            </div>
          ))}

          {/* TARJETA CTA FINAL (Ocupa el último hueco en desktop) */}
          <div className="hidden lg:flex p-10 rounded-[2rem] bg-gradient-to-br from-[#0A1F1A] to-[#12332B] items-center justify-center text-center relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#0FB888] via-transparent to-transparent blur-2xl" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div 
                className="text-white font-bold text-2xl tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                El futuro ya es real.
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            BANNER DE AUTORIDAD 
        ========================================= */}
        <div className="bg-gradient-to-br from-[#0A1F1A] to-[#112A24] rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Efectos de luz del banner */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#0FB888]/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            
            {/* Lado Izquierdo - Título */}
            <div>
              <h3 
                className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-8 tracking-tighter"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Inspirado en estándares <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FB888] to-teal-400">
                  globales de salud.
                </span>
              </h3>
              <div className="flex gap-4 items-center">
                <div className="h-[2px] w-12 bg-white/20 rounded-full" />
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">JAMA Clinical Update 2026</span>
              </div>
            </div>

            {/* Lado Derecho - Texto de autoridad */}
            <div className="text-slate-300 text-lg md:text-xl font-light leading-relaxed border-l-2 border-white/10 pl-6 md:pl-10">
              USA acaba de extender 5 años más su programa de{' '}
              <span className="text-white font-bold underline decoration-[#0FB888]/80 decoration-2 underline-offset-4 tracking-tight">
                Hospital at Home
              </span>.
              <br className="mb-6 block" />
              Lo que ocurre hoy en los sistemas más avanzados es la <strong className="text-white font-medium">hoja de ruta de OLGA</strong> para Latinoamérica.
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
};

export default PhaseTwo;