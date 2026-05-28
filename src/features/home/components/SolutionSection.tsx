import React from 'react';

// 1. Contratos claros para evitar mutaciones en tiempo de ejecución.
interface ProcessStep {
  id: string;
  number: number;
  title: string;
  desc: string;
}

// 2. Datos estáticos extraídos para evitar reasignación de memoria en cada render.
const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "step-request",
    number: 1,
    title: "Solicitud y autorización",
    desc: "El hospital solicita servicios domiciliarios. El asegurador autoriza dentro de la plataforma. Sin correos ni llamadas.",
  },
  {
    id: "step-scheduling",
    number: 2,
    title: "Agendamiento inteligente",
    desc: "OLGA conecta al paciente con el prestador adecuado según ubicación y especialidad. Aceptación vía app.",
  },
  {
    id: "step-execution",
    number: 3,
    title: "Ejecución verificada",
    desc: "GPS confirma ubicación. Registro estructurado, captura de signos vitales y firma digital del paciente.",
  },
  {
    id: "step-visibility",
    number: 4,
    title: "Visibilidad instantánea",
    desc: "Todos los actores ven el resultado en tiempo real. Hospital, asegurador y familia tienen evidencia clara.",
  },
  {
    id: "step-action",
    number: 5,
    title: "Acción proactiva",
    desc: "Si hay deterioro o un servicio no se cumple, OLGA genera alertas para actuar antes de llegar a urgencias.",
  },
];

const SolutionSection: React.FC = () => {
  return (
    <section 
      id="solucion" 
      aria-labelledby="solution-heading"
      className="bg-white py-24 px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA */}
        <div className="mb-16 md:text-center max-w-4xl md:mx-auto">
          <span className="inline-block px-4 py-1.5 bg-[#0FB888]/10 border border-[#0FB888]/20 text-[#0FB888] rounded-full text-[11px] font-bold tracking-[0.15em] uppercase mb-6">
            La solución
          </span>

          <h2 
            id="solution-heading"
            className="text-4xl md:text-5xl lg:text-6xl text-[#0A1F1A] mb-6 font-extrabold leading-[1.05] tracking-tighter"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            OLGA reemplaza el silencio con <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FB888] to-[#2BB38E]">
              coordinación en tiempo real
            </span>
          </h2>

          <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-light md:mx-auto">
            Un flujo donde cada servicio es solicitado, autorizado, agendado, ejecutado, verificado y visible — <strong className="text-[#0A1F1A] font-medium">todo dentro de una sola plataforma.</strong>
          </p>
        </div>

        {/* TIMELINE / PROCESS FLOW */}
        <div className="relative mt-20">
          
          {/* 
            El "Riel" unificado (Track): 
            Mobile: Línea vertical a la izquierda.
            Desktop: Línea horizontal en la parte superior.
          */}
          <div 
            aria-hidden="true" 
            className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-slate-100 lg:top-[23px] lg:bottom-auto lg:left-6 lg:right-6 lg:h-[2px] lg:w-auto z-0" 
          />
          
          {/* Línea de progreso simulada (Añade un toque de color sutil al riel) */}
          <div 
            aria-hidden="true" 
            className="absolute left-[23px] top-4 h-1/2 w-[2px] bg-gradient-to-b from-[#0FB888] to-transparent lg:top-[23px] lg:h-[2px] lg:w-1/2 lg:bg-gradient-to-r lg:left-6 z-0 opacity-40" 
          />

          {/* Lista Semántica */}
          <ol className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-6">
            {PROCESS_STEPS.map((step) => (
              <li 
                key={step.id} 
                className="relative flex flex-row lg:flex-col items-start gap-6 lg:gap-8 flex-1 group"
              >
                
                {/* NÚMERO (Nodo interactivo) */}
                <div 
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-white border-[3px] border-slate-100 text-slate-400 font-bold text-lg shadow-sm transition-all duration-300 group-hover:border-[#0FB888] group-hover:bg-[#0FB888] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(15,184,136,0.3)] group-hover:scale-110 relative z-10"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {step.number}
                </div>

                {/* TARJETA DE CONTENIDO (Glass/Soft UI) */}
                <div className="flex-1 bg-white border border-slate-100 rounded-[28px] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(15,184,136,0.08)] group-hover:border-[#0FB888]/20">
                  
                  {/* Pequeño acento visual dentro de la tarjeta */}
                  <div aria-hidden="true" className="w-8 h-1 bg-[#0FB888]/30 mb-5 rounded-full transition-all duration-300 group-hover:w-12 group-hover:bg-[#0FB888]" />
                  
                  <h3 
                    className="text-[#0A1F1A] text-xl font-bold mb-3 tracking-tight transition-colors duration-300 group-hover:text-[#0FB888]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
};

export default SolutionSection;