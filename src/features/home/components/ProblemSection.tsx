import React from 'react';

const ProblemSection = () => {
  // Datos actualizados con URLs de imágenes (usando Unsplash como placeholders de alta calidad)
  const problems = [
    {
      title: 'Correos electrónicos',
      desc: 'Solicitudes de autorización, aceptaciones, y reportes que llegan días después — si es que llegan.',
      img: '/Correos electrónicos.webp'
    },
    {
      title: 'Grupos de WhatsApp',
      desc: 'Auditores, coordinadores y prestadores intercambian información crítica en chats que se pierden.',
      img: '/Grupos de WhatsApp.webp'
    },
    {
      title: 'Cuadros de turnos',
      desc: 'La programación de visitas vive en hojas de cálculo estáticas que nadie más puede ver en tiempo real.',
      img: '/Cuadros de turnos.webp'
    },
    {
      title: 'Llamadas sin registro',
      desc: 'Coordinaciones telefónicas que no quedan documentadas. Si alguien pregunta qué pasó, nadie tiene el dato.',
      img: '/Llamadas sin registro.webp'
    },
    {
      title: 'Visitas fantasma',
      desc: 'Servicios que se reportan como prestados pero nadie verifica si el profesional realmente llegó al domicilio.',
      img: '/Visitas fantasma.webp'
    },
    {
      title: 'Pérdida de trazabilidad',
      desc: 'El paciente desaparece del radar clínico. Nadie sabe si mejoró, empeoró, o necesita intervención urgente.',
      img: '/Pérdida de trazabilidad.webp'
    },
  ];

  return (
    <section id="problem" className="bg-[#F8FAFC] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera - Consistente con tipografía DM Sans */}
        <div className="mb-16 md:text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-[#0FB888]/10 border border-[#0FB888]/20 text-[#0FB888] rounded-full text-[11px] font-bold tracking-[0.15em] uppercase mb-6">
            El problema
          </div>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl text-[#0A1F1A] mb-6 font-extrabold leading-[1.05] tracking-tighter"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            El <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FB888] to-[#2BB38E]">Silencio Clínico</span> deteriora pacientes
          </h2>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-light md:mx-auto">
            Cuando un paciente sale del hospital, todos los actores quedan ciegos. La comunicación se reduce a herramientas genéricas que no fueron diseñadas para salvar vidas.
          </p>
        </div>

        {/* GRID DE IMÁGENES (Bento Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-6 mb-20">
          {problems.map((prob, index) => (
            <article
              key={index}
              // Hacemos que el 1er y 4to elemento ocupen 2 columnas en Desktop para un look "Bento Grid"
              className={`group relative overflow-hidden rounded-[32px] bg-[#0A1F1A] shadow-md flex flex-col justify-end min-h-[340px] md:min-h-[380px] ${
                index === 0 || index === 3 ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
              }`}
            >
              {/* Imagen de fondo optimizada */}
              <img 
                src={prob.img} 
                alt={prob.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105 opacity-80"
              />
              
              {/* Gradiente Overlay para legibilidad (Oscurece al hacer hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F1A] via-[#0A1F1A]/40 to-transparent opacity-65 transition-opacity duration-500 group-hover:opacity-80" />
              
              {/* Contenido (Texto) */}
              <div className="relative z-10 p-8 md:p-10 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                <h4 
                  className="text-white text-2xl md:text-3xl font-bold mb-3 tracking-tight"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {prob.title}
                </h4>
                <p className="text-slate-200 text-base md:text-lg leading-relaxed font-light">
                  {prob.desc}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Silence Box - Optimizado */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1F1A] to-[#12332B] rounded-[40px] p-10 md:p-16 text-center shadow-2xl border border-white/5">
          {/* Luces de fondo (Glow effects) */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#0FB888]/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0FB888]/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
          
          <h3 
            className="relative z-10 text-3xl md:text-5xl text-white mb-6 leading-tight font-extrabold tracking-tighter"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Hospital <span className="text-[#0FB888]/50 mx-2">→</span> Alta <span className="text-[#0FB888]/50 mx-2">→</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600 relative inline-block">Silencio</span> <span className="text-[#0FB888]/50 mx-2">→</span> Urgencias
          </h3>
          <p className="relative z-10 text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            El paciente se deteriora en silencio. La familia está sola. El asegurador paga a ciegas. 
            El hospital no sabe qué pasó. <strong className="text-white font-medium">Todos operan en la oscuridad.</strong>
          </p>
        </div>

      </div>
    </section>
  );
};

export default ProblemSection;