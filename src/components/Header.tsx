"use client";

import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Optimización: passive true para no bloquear el scroll del navegador
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Inicio', href: '#Inicio' },
    { label: 'Problema', href: '#problem' },
    { label: 'Solución', href: '#solution' },
    { label: 'Plataforma', href: '#platform' },
    { label: 'Capacidades', href: '#features' },
    { label: 'Fase 2', href: '#future' },
    { label: 'Contacto', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 py-3 md:py-4"
          : "bg-transparent border-b border-transparent py-5 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        
        {/* LOGO - Optimizado con clases de Tailwind */}
        {/* Nota: Asegúrate de importar 'DM Sans' en tu archivo global.css o layout.jsx */}
        <a 
          href="#Inicio"
          className={`relative z-[110] text-3xl font-extrabold tracking-tighter transition-colors duration-300 flex items-center ${
            isScrolled || isMenuOpen ? "text-slate-900" : "text-white"
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <span className={isScrolled || isMenuOpen ? "text-[#0FB888]" : "text-white/80"}>
            o
          </span>
          lga
        </a>

        {/* NAVEGACIÓN CENTRAL - Estilo Píldora Flotante (Desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block">
          <nav className="flex items-center gap-1 bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full p-1.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-slate-600 text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-300 hover:text-[#0FB888] group"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 bg-[#0FB888]/10 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 rounded-full transition-all duration-300 ease-out"></span>
              </a>
            ))}
          </nav>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center gap-4 z-[110]">
          <a
            href="/login"
            className="hidden sm:inline-flex items-center justify-center bg-[#0FB888] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(15,184,136,0.39)] transition-all duration-300 hover:bg-[#0AA577] hover:shadow-[0_6px_20px_rgba(15,184,136,0.23)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Iniciar sesión
          </a>

          {/* Botón Hamburguesa */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Alternar menú"
            className={`lg:hidden p-2.5 rounded-full transition-all duration-300 ${
              isScrolled || isMenuOpen 
                ? "bg-slate-100 text-slate-900 hover:bg-slate-200" 
                : "bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      <div 
        className={`fixed inset-0 top-0 left-0 w-full h-screen bg-white transition-all duration-500 ease-[0.22,1,0.36,1] lg:hidden flex flex-col justify-center items-center z-[100] ${
          isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <nav className="flex flex-col items-center gap-6 w-full px-6">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-900 text-2xl font-bold hover:text-[#0FB888] transition-colors duration-300"
              style={{
                transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)'
              }}
            >
              {link.label}
            </a>
          ))}
          
          <div className="h-px w-24 bg-slate-200 my-4"></div>
          
          <a
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="w-full max-w-xs text-center bg-[#0FB888] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#0FB888]/20 transition-transform active:scale-95"
            style={{
               transitionDelay: isMenuOpen ? `${navLinks.length * 50}ms` : '0ms',
               opacity: isMenuOpen ? 1 : 0
            }}
          >
            Iniciar sesión
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;