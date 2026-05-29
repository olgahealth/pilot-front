"use client";

import {
  Shield,
  MapPin,
  Mail,
  Linkedin,
  ArrowUp,
  Activity,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const quickLinks = [
  { name: "Plataforma", href: "#platform" },
  { name: "Fase 2", href: "#future" },
  { name: "Contacto", href: "#contact" },
  { name: "OLGA Healthtech", href: "https://olga.health" },
];

const olgaServices = [
  { name: "Verificación GPS & Antifraude" },
  { name: "Continuidad del Cuidado" },
  { name: "Evidencia Clínica Digital" },
  { name: "Gestión de Pacientes Post-Alta" },
  { name: "Dashboard de Operaciones IPS" },
  { name: "Infraestructura Hospital at Home" },
];

const contactInfo = [

  { 
    icon: <Globe className="w-4 h-4" />, 
    text: "www.olga.health", 
    href: "https://olga.health" 
  },
  { 
    icon: <MapPin className="w-4 h-4" />, 
    text: "Bogotá, Colombia", 
    href: "#" 
  },
];

const socialLinks = [
  {
    icon: <Linkedin className="w-5 h-5" />,
    href: "https://www.linkedin.com/company/olga-healthtech",
    color: "bg-[#0FB888]/10 text-[#0FB888] hover:bg-[#0FB888] hover:text-white border border-[#0FB888]/20",
    name: "OLGA LinkedIn",
  },

];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2024); // Fallback inicial

  // Asegurar que el año se renderice solo en el cliente para evitar errores de hidratación
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative bg-[#0A1F1A] text-white overflow-hidden border-t border-white/10">
      
      {/* Patrón de fondo sutil (Matriz de puntos) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0FB888 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Acento superior esmeralda iluminado */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0FB888]/60 to-transparent shadow-[0_0_15px_rgba(15,184,136,0.5)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="space-y-6 lg:pr-8">
            <div className="flex items-center gap-3">

              
              <div className="flex flex-col">
                <span 
                  className="text-3xl font-extrabold tracking-tighter leading-none text-white"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  olga
                </span>
                <span className="text-[9px] text-[#0FB888] font-black uppercase tracking-[0.25em] mt-1 ml-0.5">
                  Healthtech
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-sm font-light">
              Infraestructura tecnológica para la coordinación, verificación y visibilidad total del cuidado de salud extramural en Latinoamérica.
            </p>

            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 
              className="text-white text-base font-bold mb-6 tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Navegación
            </h3>
            <ul className="space-y-3.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-[#0FB888] transition-colors duration-300 flex items-center gap-3 group text-sm font-light"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0FB888] opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* OLGA Core Solutions */}
          <div>
            <h3 
              className="text-white text-base font-bold mb-6 tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Soluciones
            </h3>
            <ul className="space-y-3.5">
              {olgaServices.map((service, index) => (
                <li key={index} className="text-slate-400 flex items-center gap-3 text-sm font-light group">
                  <Shield className="w-3.5 h-3.5 text-[#0FB888]/50 group-hover:text-[#0FB888] transition-colors" />
                  <span className="group-hover:text-slate-200 transition-colors">{service.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 
              className="text-white text-base font-bold mb-6 tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Contacto
            </h3>
            <ul className="space-y-5">
              {contactInfo.map((info, index) => (
                <li key={index}>
                  <a
                    href={info.href}
                    className="text-slate-400 hover:text-white transition-colors duration-300 flex items-start gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0FB888] group-hover:text-white transition-all duration-300 border border-white/5 group-hover:border-[#0FB888]">
                      {info.icon}
                    </div>
                    <span className="text-sm font-light leading-relaxed truncate mt-1">
                      {info.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Global Context Note (CTA Banner Premium) */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden shadow-2xl">
            {/* Brillo de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0FB888]/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
            
            <div className="text-center md:text-left relative z-10">
              <h4 
                className="text-white text-xl md:text-2xl font-bold mb-2 tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                ¿Listo para conectar su ecosistema?
              </h4>
              <p className="text-slate-400 text-sm font-light">
                Agende una demostración técnica de la plataforma y descubra el impacto en su operación.
              </p>
            </div>
            

          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">
              © {currentYear} OLGA Healthtech S.A.S.
            </p>
            <p className="text-slate-500 text-[11px] mt-1.5 font-light">
              Infraestructura para la transparencia clínica.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-slate-400 hover:text-[#0FB888] transition-colors duration-300 focus:outline-none"
            aria-label="Volver arriba"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest transition-colors">Volver arriba</span>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-[#0FB888]/30 group-hover:bg-[#0FB888]/10 flex items-center justify-center transition-all duration-300">
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform text-[#0FB888]" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
}