import React from 'react';

// 1. Contratos claros.
interface Metric {
  id: string;
  value: string;
  label: string;
}

// 2. Datos estáticos fuera del componente para evitar re-renders innecesarios.
const HERO_METRICS: Metric[] = [
  {
    id: 'metric-preventable-er',
    value: 'USD 14.5B',
    label: 'en cuidado domiciliario pagados sin verificación electrónica en NY en un año'
  },
  {
    id: 'metric-unmonitored',
    value: '10%',
    label: 'de pacientes reingresan al hospital dentro de los 30 días post-alta en Colombia'
  },
  { 
    id: 'metric-cost', 
    value: '$2,500', 
    label: 'USD costo promedio por evento prevenible' 
  },
  { 
    id: 'metric-integration', 
    value: '0', 
    label: 'plataformas que integren todo el ecosistema en LATAM' 
  },
];

const OlgaHero: React.FC = () => {
  return (
    <div id="Inicio" className="relative min-h-[100svh] bg-white overflow-hidden flex items-center">
      
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #ffffff 0%, #ffffff 65%, #cffff0 100%)" }}
        />
      </div>

      {/* HERO SECTION CONTENT */}
      <section className="relative z-10 w-full min-h-[calc(100vh-72px)] flex items-center px-6 py-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT: BRANDING */}
            <div className="text-left flex flex-col justify-center">
              
              {/* Giant "olga" Heading matching the logo style */}


              {/* Tagline / Kicker */}
              <div className="inline-block">
                                <p className="inline-flex text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#0FB888] px-5 py-2.5 bg-[#0FB888]/10 rounded-full border border-[#0FB888]/20 backdrop-blur-sm shadow-sm">
                  The Operating System for Care Outside the Hospital
                </p>
                              <h1 
                className="text-[80px] md:text-[110px] lg:text-[140px] font-extrabold tracking-tighter leading-none mb-6 text-[#0A1F1A]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <span className="text-[#0FB888]">o</span>lga<span className="text-[#0FB888]">.</span>
              </h1>
                <p className="max-w-xl text-lg md:text-xl text-[#0A1F1A] font-light leading-relaxed">
                Una plataforma donde hospitales, aseguradores, prestadores y familias se ven, se conectan y coordinan — <strong className="text-[#0A1F1A] font-medium">para que el paciente nunca esté solo.</strong>
              </p>
              </div>

            </div>

            {/* RIGHT: STATS */}
            <div className="relative mt-8 lg:mt-0">
              {/* Resplandor de fondo ajustado para modo claro */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0FB888]/20 to-[#2BB38E]/20 rounded-[34px] blur-xl opacity-70"></div>
              
              {/* Tarjeta de métricas con Light Glassmorphism */}
              <dl className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 bg-[#a8f0d8]/60 backdrop-blur-xl p-8 md:p-10 rounded-[32px] border border-[#7de0c0]/40 shadow-[0_20px_50px_rgba(10,31,26,0.07)]">
                {HERO_METRICS.map((metric) => (
                  <div key={metric.id} className="flex flex-col text-center group">

                    <dt className="order-2 text-[11px] leading-relaxed uppercase tracking-wider text-slate-500 mt-2 transition-colors group-hover:text-[#4A6B62]">
                      {metric.label}
                    </dt>

                    <dd
                      className="order-1 text-4xl md:text-5xl font-extrabold text-[#0A1F1A] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[#0FB888] m-0"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {metric.value}
                    </dd>
                    
                  </div>
                ))}
              </dl>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default OlgaHero;