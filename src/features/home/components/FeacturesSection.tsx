import React from 'react';

// Ico no fuerza fill — cada symbol lo controla
const Ico = ({ id, className = "w-6 h-6" }: { id: string, className?: string }) => (
  <svg className={className}>
    <use href={`#${id}`} />
  </svg>
);

const FeaturesSection = () => {
  const features = [
    { id: "i-pin",          title: "Geofencing",                  desc: "Verificación GPS automática de que el profesional llegó al domicilio del paciente." },
    { id: "i-pencil",       title: "Firma digital",               desc: "El paciente confirma cada servicio recibido directamente en la plataforma." },
    { id: "i-bell",         title: "Alertas clínicas",            desc: "Semáforo Verde/Amarillo/Rojo con escalamiento automático si hay deterioro." },
    { id: "i-bars",         title: "Dashboards en tiempo real",   desc: "Cada actor ve lo que necesita. Métricas, servicios, pacientes, costos." },
    { id: "i-link",         title: "Comunicación bidireccional",  desc: "Hospital ↔ Asegurador ↔ Prestador ↔ Paciente. Todo trazable, todo documentado." },
    { id: "i-shield-check", title: "Anti-fraude",                 desc: "Detección automática de visitas fantasma, servicios simultáneos, y anomalías." },
    { id: "i-calendar",     title: "Agendamiento inteligente",    desc: "Matching paciente-prestador por disponibilidad, ubicación y especialidad." },
    { id: "i-smartphone",   title: "App móvil (PWA)",             desc: "Los profesionales en campo gestionan todo desde su celular. Sin instalar nada." },
    { id: "i-star",         title: "Scoring de prestadores",      desc: "Calidad medible: tiempo de respuesta, completitud, satisfacción, compliance GPS." },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0A1F1A] text-white overflow-hidden relative" id="features">

      {/* ── SVG Sprite (oculto) ── */}
      <svg aria-hidden="true" style={{ display: 'none' }}>
        {/* Geofencing — map pin */}
        <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </symbol>

        {/* Firma digital — pencil */}
        <symbol id="i-pencil" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </symbol>

        {/* Alertas clínicas — bell */}
        <symbol id="i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </symbol>

        {/* Dashboards — layout grid */}
        <symbol id="i-bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </symbol>

        {/* Comunicación — chain link */}
        <symbol id="i-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </symbol>

        {/* Anti-fraude — shield check */}
        <symbol id="i-shield-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </symbol>

        {/* Agendamiento — calendar */}
        <symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </symbol>

        {/* App móvil — smartphone */}
        <symbol id="i-smartphone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </symbol>

        {/* Scoring — star */}
        <symbol id="i-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </symbol>
      </svg>

      {/* Luces Ambientales (Background glows) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0FB888]/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0FB888]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Cabecera */}
        <div className="mb-20 md:text-center max-w-4xl md:mx-auto flex flex-col md:items-center">
          <div className="inline-block px-4 py-1.5 bg-[#0FB888]/10 border border-[#0FB888]/20 text-[#0FB888] rounded-full text-[11px] font-bold tracking-[0.15em] uppercase mb-6 backdrop-blur-sm">
            Capacidades de la plataforma
          </div>
          
          {/* Título unificado con DM Sans */}
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-extrabold leading-[1.05] tracking-tighter"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Todo conectado. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FB888] to-[#2BB38E]">
              Todo verificable.
            </span>
          </h2>
          
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light">
            Comunicación bidireccional, verificación automática, y visibilidad en tiempo real <strong className="text-white font-medium">para cada actor del ecosistema.</strong>
          </p>
        </div>

        {/* Grid de Tarjetas (Dark Glassmorphism) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((feat) => (
            <article
              key={feat.id}
              className="group relative bg-[#122b24]/40 backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-white/5 hover:border-[#0FB888]/30 transition-all duration-500 hover:-translate-y-1.5 hover:bg-[#122b24]/80 hover:shadow-[0_20px_40px_rgba(15,184,136,0.08)] overflow-hidden"
            >
              {/* Brillo sutil en hover (Glow inside card) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0FB888]/10 rounded-full blur-3xl -translate-y-10 translate-x-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#0FB888]/10 text-[#0FB888] flex items-center justify-center mb-8 border border-[#0FB888]/20 group-hover:bg-[#0FB888] group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(15,184,136,0.3)] group-hover:scale-110">
                  <Ico id={feat.id} className="w-6 h-6" />
                </div>
                
                <h4 
                  className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight transition-colors duration-300"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {feat.title}
                </h4>
                
                <p className="text-slate-400 text-sm md:text-base leading-relaxed group-hover:text-slate-300 transition-colors duration-500 font-light">
                  {feat.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default FeaturesSection;