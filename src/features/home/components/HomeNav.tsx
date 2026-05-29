"use client";

import React, { useState, useEffect } from 'react';

const SVG_DEFS = `
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear el scroll del cuerpo cuando el menú esté abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Inicio',      href: '#inicio' },
    { label: 'Problema',    href: '#problem' },
    { label: 'Solución',    href: '#solucion' },
    { label: 'Plataforma',  href: '#platform' },
    { label: 'Capacidades', href: '#features' },
    { label: 'Fase 2',      href: '#fase2' },
    { label: 'Contacto',    href: '#contact' },
  ];

  // Estructura común del Logo (100% Negro Sólido)
  const Logo = () => (
    <div 
      className="text-black transition-colors duration-300"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: '800',
        letterSpacing: '-1.5px',
        fontSize: '1.65rem',
        lineHeight: '1',
        display: 'block'
      }}
    >
      olga
    </div>
  );

  return (
    <header 
      className={`fixed top-0 w-full z-[100] px-6 md:px-10 py-5 flex items-center justify-between transition-all duration-500 ${
        isScrolled
          ? "bg-white shadow-md border-b border-slate-100" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Estilos para las animaciones y la hamburguesa */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@800&display=swap');
        
        .burger-line {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease, background-color 0.3s ease;
        }
        .burger-open .line-1 {
          transform: translateY(6px) rotate(45deg);
        }
        .burger-open .line-2 {
          opacity: 0;
          transform: translateX(-4px);
        }
        .burger-open .line-3 {
          transform: translateY(-6px) rotate(-45deg);
        }
      `}</style>

      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs dangerouslySetInnerHTML={{ __html: SVG_DEFS }} />
      </svg>

      {/* LOGO PRINCIPAL: Se oculta en móvil si el menú está abierto */}
      <div className={`z-[110] transition-all duration-300 ${isMenuOpen ? "opacity-0 pointer-events-none md:opacity-100" : "opacity-100"}`}>
        <Logo />
      </div>

      {/* NAVEGACIÓN CENTRAL (ESCRITORIO) */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden xl:block">
        <nav className="flex items-center gap-1 bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-full px-2 py-1.5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-[#4A6B62] no-underline text-[0.82rem] font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:text-[#0FB888] group"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute inset-0 bg-[#0FB888]/5 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 ease-out"></span>
            </a>
          ))}
        </nav>
      </div>

      {/* ACCIONES DEL HEADER */}
      <div className="flex items-center gap-5 z-[110]">
        <a
          href="/login"
          className="hidden sm:inline-flex items-center bg-[#0FB888] text-white no-underline text-[0.85rem] font-bold px-6 py-2.5 rounded-full shadow-lg shadow-[#0FB888]/20 transition-all duration-300 hover:bg-[#0AA577] hover:shadow-[#0AA577]/40 hover:-translate-y-0.5"
        >
          Iniciar sesión
        </a>

        {/* Botón Hamburguesa */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col justify-center items-center w-11 h-11 rounded-xl transition-all duration-300 gap-[4px] focus:outline-none xl:hidden ${
            isMenuOpen 
              ? "bg-slate-100/80 text-[#0A1F1A] backdrop-blur-md" 
              : isScrolled
                ? "bg-slate-100 text-[#0A1F1A] hover:bg-slate-200"
                : "bg-slate-700/10 text-[#0A1F1A] backdrop-blur-sm hover:bg-slate-700/20"
          } ${isMenuOpen ? "burger-open" : ""}`}
          aria-label="Menu"
        >
          <span className="burger-line line-1 w-5 h-[2px] bg-current rounded-full" />
          <span className="burger-line line-2 w-5 h-[2px] bg-current rounded-full" />
          <span className="burger-line line-3 w-5 h-[2px] bg-current rounded-full" />
        </button>
      </div>

      {/* MENÚ MOBILE */}
      {/* 1. Backdrop de fondo difuminado */}
      <div 
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-md xl:hidden transition-opacity duration-500 z-[90] ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 2. Panel Lateral Direito */}
      <div className={`fixed top-0 right-0 h-screen w-[85%] max-w-[400px] bg-white border-l border-slate-100 xl:hidden z-[95] flex flex-col justify-between p-8 pb-12 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isMenuOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
      }`}>
        
        {/* Parte Superior: Logo Integrado + Navegación */}
        <div className="flex flex-col gap-6">
          {/* LOGO MUDADO AQUÍ ADENTRO (Aparece alineado con el espacio del menú móvil) */}
          <div 
            className="px-4 pt-4 mb-4"
            style={{ 
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
              opacity: isMenuOpen ? 1 : 0,
              transition: 'transform 0.4s ease 0.1s, opacity 0.4s ease 0.1s'
            }}
          >
            <Logo />
          </div>

          <nav className="flex flex-col gap-1">
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2 px-4">
              Navegación
            </p>
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-[#0A1F1A] text-lg font-semibold hover:text-[#0FB888] transition-all duration-200 w-full px-4 py-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between group"
                style={{ 
                  transitionDelay: isMenuOpen ? `${(i + 1) * 40}ms` : '0ms', // Modificado para esperar al logo
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(16px)',
                  opacity: isMenuOpen ? 1 : 0
                }}
              >
                <span>{link.label}</span>
                <span className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-sm">
                  →
                </span>
              </a>
            ))}
          </nav>
        </div>

        {/* Sección Inferior del Menú */}
        <div 
          className="flex flex-col gap-4 border-t border-slate-100 pt-6"
          style={{ 
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'transform 0.4s ease 0.3s, opacity 0.4s ease 0.3s'
          }}
        >
          <div className="px-4">
            <span className="block text-xs font-medium text-slate-500 mb-1">¿Ya eres cliente?</span>
            <p className="text-xs text-slate-400 leading-snug">Accede a tu panel operativo centralizado de control.</p>
          </div>
          <a
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="w-full text-center bg-[#0FB888] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#0FB888]/20 hover:bg-[#0AA577] transition-all duration-200"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;