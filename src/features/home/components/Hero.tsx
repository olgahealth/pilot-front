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
    <div id="Inicio" className="relative min-h-[100svh] bg-[#0A1F1A] overflow-hidden flex items-center">
      
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      {/* aria-hidden="true" - Excelente práctica de accesibilidad que ya tenías */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[20s] ease-out"
          style={{ backgroundImage: "url('/imagenhero.jpeg')" }}
        />
        {/* Overlay optimizado: Gradiente en lugar de color plano para darle profundidad al texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F1A]/95 via-[#0A1F1A]/80 to-[#0A1F1A]/40 backdrop-blur-[2px]" />
      </div>

      {/* HERO SECTION CONTENT */}
      <section className="relative z-10 w-full pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT SIDE: TITLES AND SUBTITLES */}
            <div className="lg:col-span-7 text-left">
              
              <p className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#0FB888] mb-6 px-3 py-1 bg-[#0FB888]/10 rounded-full border border-[#0FB888]/20 backdrop-blur-sm">
                The Operating System for Care Outside the Hospital
              </p>
              
              {/* TÍTULO PRINCIPAL - Usando DM Sans para hacer match con el logo */}
              <h1 
                className="text-5xl md:text-6xl lg:text-[76px] font-extrabold text-white mb-8 leading-[1.05] tracking-tighter"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Nadie sabe qué pasa con el paciente <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FB888] to-[#2BB38E]">
                  entre el hospital y su casa.
                </span>
              </h1>

              <p className="max-w-xl text-lg md:text-xl text-slate-300 font-light leading-relaxed">
                Una plataforma donde hospitales, aseguradores, prestadores y familias se ven, se conectan y coordinan — <strong className="text-white font-medium">para que el paciente nunca esté solo.</strong>
              </p>
            </div>

            {/* RIGHT SIDE: STATS */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              {/* Resplandor de fondo para destacar la tarjeta */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0FB888]/30 to-[#2BB38E]/30 rounded-[34px] blur-xl opacity-50"></div>
              
              {/* HTML Semántico preservado (<dl>) con Glassmorphism 2.0 */}
              <dl className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 bg-[#0A1F1A]/40 backdrop-blur-md p-8 md:p-10 rounded-[32px] border border-white/10 shadow-2xl">
                {HERO_METRICS.map((metric) => (
                  <div key={metric.id} className="flex flex-col text-left group">
                    
                    <dt className="order-2 text-[11px] leading-relaxed uppercase tracking-wider text-slate-400 mt-2 transition-colors group-hover:text-slate-300">
                      {metric.label}
                    </dt>
                    
                    {/* Valores de las métricas también con DM Sans para jerarquía visual */}
                    <dd 
                      className={`order-1 font-bold text-white transition-transform duration-300 group-hover:-translate-y-0.5 m-0 ${
                        metric.value.length > 6 ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'
                      }`}
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