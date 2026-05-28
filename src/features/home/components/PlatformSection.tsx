import React from 'react';

// Íconos auto-contenidos. No dependen de sprites ni librerías externas.
const Ico = ({ id, className = "w-5 h-5", style }: { id: string, className?: string, style?: React.CSSProperties }) => {
  const paths = {
    'i-shield': <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    'i-check': <polyline points="20 6 9 17 4 12" />,
    'i-dollar': <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    'i-search': <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    'i-trending': <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    'i-hospital': <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M10 9h4M12 7v4" />,
    'i-eye': <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    'i-refresh': <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    'i-clipboard': <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></>,
    'i-zap': <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    'i-stethoscope': <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />, // Pulso clínico
    'i-smartphone': <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    'i-pin': <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    'i-star': <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    'i-home': <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    'i-users': <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    'i-circle-dot': <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></>,
    'i-phone-call': <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/></>,
    'i-heart': <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      className={`${className} fill-none stroke-current stroke-2`} 
      style={style}
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {paths[id as keyof typeof paths] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

// Componente Benefit con Micro-interacciones
const Benefit = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="group flex gap-5 p-4 -ml-4 rounded-2xl transition-all duration-300 hover:bg-[#0FB888]/5 border border-transparent hover:border-[#0FB888]/10">
    <div className="w-12 h-12 min-w-[48px] rounded-xl bg-[#0FB888]/10 text-[#0FB888] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0FB888] group-hover:text-white shadow-sm">
      <Ico id={icon} />
    </div>
    <div>
      <h5 className="text-[#0A1F1A] text-base font-bold mb-1.5 tracking-tight transition-colors group-hover:text-[#0FB888]">
        {title}
      </h5>
      <p className="text-slate-500 text-sm leading-relaxed font-light">
        {desc}
      </p>
    </div>
  </div>
);

const OlgaPlatform = () => {
  return (
    <div className="bg-white overflow-hidden">
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto" id="platform">
        
        {/* CABECERA */}
        <div className="mb-24 md:text-center max-w-4xl md:mx-auto">
          <span className="inline-block px-4 py-1.5 bg-[#0FB888]/10 border border-[#0FB888]/20 text-[#0FB888] rounded-full text-[11px] font-bold tracking-[0.15em] uppercase mb-6">
            La plataforma
          </span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl text-[#0A1F1A] font-extrabold mb-6 leading-[1.05] tracking-tighter"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Lo que ve cada actor en <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FB888] to-[#2BB38E]">
              el ecosistema OLGA
            </span>
          </h2>
        </div>

        {/* =========================================
            1. BLOQUE ASEGURADOR (EPS / PREPAGADA)
        ========================================= */}
        <div className="mb-32">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#0A1F1A] text-white flex items-center justify-center shadow-xl shadow-[#0A1F1A]/20">
              <Ico id="i-shield" className="w-8 h-8 text-[#0FB888]" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#0A1F1A] tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>Asegurador</h3>
              <div className="text-slate-500 font-light mt-1">Verificación en tiempo real · Eliminación de fraude · Visibilidad</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-start">
            {/* UI Mockup */}
            <div className="lg:col-span-7 bg-[#0A1F1A] rounded-[2.5rem] p-8 border border-slate-800 shadow-[0_20px_50px_rgba(10,31,26,0.3)] relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0FB888]/10 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="flex gap-2 mb-8 opacity-30">
                <div className="w-2.5 h-2.5 rounded-full bg-white" /><div className="w-2.5 h-2.5 rounded-full bg-white" /><div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
                {[
                  { label: 'Verificados hoy', val: '142', sub: 'servicios confirmados', color: 'text-[#0FB888]', bg: 'bg-[#0FB888]', progress: '94%' },
                  { label: 'Alertas fraude', val: '3', sub: 'flagged para revisión', color: 'text-red-400', bg: 'bg-red-400', progress: '12%' },
                  { label: 'Urgencias evitadas', val: '28', sub: 'este mes', color: 'text-teal-300', bg: 'bg-teal-300', progress: '72%' },
                  { label: 'Ahorro (COP)', val: '$86M', sub: 'este trimestre', color: 'text-orange-300', bg: 'bg-orange-300', progress: '68%' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className={`${stat.color} text-[10px] font-black uppercase mb-2 tracking-wider`}>{stat.label}</div>
                    <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{stat.val}</div>
                    <div className="text-[10px] text-white/40 leading-tight h-6">{stat.sub}</div>
                    <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden"><div className={`h-full ${stat.bg}`} style={{ width: stat.progress }} /></div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="text-white/40 text-[10px] font-black uppercase mb-4 tracking-widest">Mapa de verificación GPS</div>
                  <div className="h-24 bg-black/20 rounded-xl flex items-center justify-center gap-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,184,136,0.1)_0,transparent_70%)]" />
                    <div className="w-3 h-3 rounded-full bg-[#0FB888] shadow-[0_0_12px_rgba(15,184,136,0.8)] relative z-10 animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-[#0FB888] shadow-[0_0_12px_rgba(15,184,136,0.8)] relative z-10" />
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] relative z-10" />
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="text-white/40 text-[10px] font-black uppercase mb-4 tracking-widest">Facturación</div>
                  <ul className="text-xs text-white/80 space-y-3 font-light">
                    <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#0FB888] shadow-[0_0_8px_#0FB888]"/> 142 listos para facturar</li>
                    <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-yellow-400"/> 8 pendientes firma</li>
                    <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#0FB888] shadow-[0_0_8px_#0FB888]"/> $18.4M COP facturable</li>
                    <li className="flex items-center gap-3 text-[#0FB888] font-bold"><span className="w-2 h-2 rounded-full bg-[#0FB888] shadow-[0_0_8px_#0FB888]"/> 100% con evidencia clínica</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <Benefit icon="i-check" title="Cero visitas fantasma" desc="Cada servicio verificado con GPS, timestamp, firma digital y evidencia fotográfica." />
              <Benefit icon="i-dollar" title="Facturación con evidencia" desc="Servicios soportados integralmente. Sin glosas ni discusiones administrativas." />
              <Benefit icon="i-search" title="Detección de fraude" desc="Alertas automáticas: GPS desviado, servicios simultáneos irreales, notas sin visita." />
              <Benefit icon="i-trending" title="Reducción de siniestralidad" desc="Menos reingresos a urgencias se traduce directamente en un menor costo por afiliado." />
            </div>
          </div>
        </div>

        {/* =========================================
            2. BLOQUE HOSPITAL / CLÍNICA
        ========================================= */}
        <div className="mb-32">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#0FB888] text-white flex items-center justify-center shadow-xl shadow-[#0FB888]/20">
              <Ico id="i-hospital" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#0A1F1A] tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hospital / Clínica</h3>
              <div className="text-slate-500 font-light mt-1">Visibilidad post-alta · Giro cama · Continuidad del cuidado</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-start">
            {/* UI Mockup (Light theme) */}
            <div className="lg:col-span-7 bg-[#F8FAFC] rounded-[2.5rem] p-8 border border-slate-200 shadow-xl">
              <div className="flex gap-2 mb-8 opacity-20">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" /><div className="w-2.5 h-2.5 rounded-full bg-slate-800" /><div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
                <div className="text-[#0FB888] text-[10px] font-black uppercase mb-5 tracking-widest">Pacientes post-alta en seguimiento</div>
                <ul className="space-y-4 text-sm font-medium text-slate-700">
                  <li className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <span className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#0FB888] shadow-[0_0_8px_#0FB888]"/> María G. — Estable — Día 12</span>
                    <span className="text-slate-400 text-xs font-light">Hace 2h</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <span className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"/> Carlos R. — Vigilar — Día 5</span>
                    <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-md text-xs">PA elevada</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-3 font-bold text-red-600"><span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"/> Luis M. — Urgente — Día 3</span>
                    <span className="text-slate-400 text-xs font-light">Equipo contactado</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-indigo-500 text-[10px] font-black uppercase mb-2 tracking-widest">Reingreso 30d</div>
                  <div className="text-4xl font-extrabold text-[#0A1F1A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>6.4%</div>
                  <div className="text-xs text-slate-400 mt-2">vs. 28.9% promedio nacional</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[#0FB888] text-[10px] font-black uppercase mb-2 tracking-widest">Plan de cuidado</div>
                  <div className="text-4xl font-extrabold text-[#0A1F1A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>91%</div>
                  <div className="text-xs text-slate-400 mt-2">servicios completados a tiempo</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <Benefit icon="i-eye" title="El paciente nunca desaparece" desc="Visibilidad continua después del alta. Semáforo clínico de riesgo (Verde/Amarillo/Rojo)." />
              <Benefit icon="i-refresh" title="Mayor giro cama" desc="Alta temprana segura con seguimiento garantizado en casa. Libera camas para pacientes críticos." />
              <Benefit icon="i-clipboard" title="Cumplimiento del plan" desc="Visualización en tiempo real del cumplimiento de las órdenes médicas domiciliarias." />
              <Benefit icon="i-zap" title="Alertas predictivas" desc="Intervención temprana ante el menor signo de deterioro, evitando el retorno a urgencias." />
            </div>
          </div>
        </div>

        {/* =========================================
            3. BLOQUE PRESTADOR (IPS DOMICILIARIA)
        ========================================= */}
        <div className="mb-32 bg-slate-50 rounded-[3rem] p-8 md:p-12 lg:p-16 border border-slate-200">
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-[#0A1F1A] text-white flex items-center justify-center shadow-xl"><Ico id="i-stethoscope" className="w-8 h-8 text-teal-400" /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#0A1F1A] tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>Prestador Extramural (IPS)</h3>
              <div className="text-slate-500 font-light mt-1">Centro de Comando · Facturación Garantizada · Logística Óptima</div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            <div className="lg:col-span-7 bg-[#112A24] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(15,184,136,0.08)_0,transparent_50%)] pointer-events-none" />
              
              <div className="text-[#0FB888] text-[10px] font-black uppercase mb-6 tracking-widest relative z-10">Dashboard Operativo Central</div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/5">
                  <div className="text-teal-400 text-[10px] font-bold uppercase mb-1">En campo hoy</div>
                  <div className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>24</div>
                  <div className="text-[10px] text-white/40">profesionales activos en ruta</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/5">
                  <div className="text-orange-400 text-[10px] font-bold uppercase mb-1">Visitas Programadas</div>
                  <div className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>87</div>
                  <div className="text-[10px] text-white/40">52 completadas · 35 pendientes</div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/5 relative z-10">
                <div className="text-white/40 text-[10px] font-black uppercase mb-4 tracking-widest">Estado en vivo del equipo</div>
                <ul className="text-sm text-white/80 space-y-4 font-light">
                  <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#0FB888] shadow-[0_0_8px_#0FB888]"/> <strong className="font-medium">Sandra M.</strong> — En ruta visita 3/5</li>
                  <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#0FB888] shadow-[0_0_8px_#0FB888]"/> <strong className="font-medium">Jorge L.</strong> — En domicilio (GPS Verificado)</li>
                  <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"/> <strong className="font-medium">Diana R.</strong> — Retrasada 15 min por tráfico</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <Benefit icon="i-smartphone" title="Gestión logística centralizada" desc="Un solo tablero para ver quién está dónde, qué visitas faltan y quién va retrasado en su ruta." />
              <Benefit icon="i-dollar" title="Ciclo de caja acelerado" desc="Al tener evidencia estructurada (firmas, GPS), las facturas no se glosan y se pagan más rápido." />
              <Benefit icon="i-pin" title="Nuevos pacientes" desc="Recepción de solicitudes directas de hospitales de la red sin invertir en equipos comerciales." />
              <Benefit icon="i-star" title="Reputación medible" desc="Los prestadores con mejores métricas clínicas (Score OLGA) reciben preferencia en la asignación." />
            </div>
          </div>
        </div>

        {/* =========================================
            4. BLOQUE PACIENTE Y FAMILIA
        ========================================= */}
        <div>
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#0FB888] text-white flex items-center justify-center shadow-lg shadow-[#0FB888]/20">
              <Ico id="i-home" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#0A1F1A] tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>Paciente y Familia</h3>
              <div className="text-slate-500 font-light mt-1">Visibilidad total · Tranquilidad · Acompañamiento continuo</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              {/* Web Portal Mockup for Patient */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-[#0A1F1A] text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Portal de Familia</h4>
                    <p className="text-slate-400 text-sm">Paciente: Carlos Ruiz</p>
                  </div>
                  <div className="bg-[#0FB888]/10 text-[#0FB888] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0FB888] animate-pulse" /> Monitoreo Activo
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-black uppercase mb-3 tracking-widest">Estado Actual</div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0FB888]/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[#0FB888] shadow-[0_0_12px_#0FB888]" />
                      </div>
                      <div>
                        <div className="text-[#0A1F1A] font-bold">Estable</div>
                        <div className="text-slate-500 text-xs">Signos vitales normales</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    <div className="text-orange-500 text-[10px] font-black uppercase mb-3 tracking-widest">Próxima Visita</div>
                    <div className="text-[#0A1F1A] font-bold">Terapia Física</div>
                    <div className="text-orange-700/70 text-sm mt-1">Hoy — 2:00 PM (En 3 hrs)</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                  <div className="text-slate-400 text-[10px] font-black uppercase mb-4 tracking-widest">Historial de Cuidados</div>
                  <ul className="text-sm space-y-3 font-medium text-slate-600">
                    <li className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="flex items-center gap-3"><Ico id="i-check" className="w-4 h-4 text-[#0FB888]"/> Visita de Enfermería</span>
                      <span className="text-xs text-slate-400">Ayer, 9:30 AM</span>
                    </li>
                    <li className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="flex items-center gap-3"><Ico id="i-check" className="w-4 h-4 text-[#0FB888]"/> Entrega de medicamentos</span>
                      <span className="text-xs text-slate-400">Lun, 4:15 PM</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2 order-1 lg:order-2">
              <Benefit icon="i-users" title="Nunca más solos" desc="La familia sabe exactamente la fecha y hora de la próxima visita y quién es el profesional a cargo." />
              <Benefit icon="i-circle-dot" title="Semáforo de salud transparente" desc="Acceso al estado clínico general. Verde = tranquilidad. Amarillo = en observación. Rojo = equipo en camino." />
              <Benefit icon="i-phone-call" title="Botón de ayuda directa" desc="Contacto inmediato con el centro de comando clínico sin intermediarios ni conmutadores." />
              <Benefit icon="i-heart" title="Evidencia compartida" desc="Confirmación de que el servicio se prestó correctamente, brindando paz mental a los familiares lejanos." />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default OlgaPlatform;