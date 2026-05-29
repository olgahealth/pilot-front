"use client";

import { useState } from "react";
import { Download, Building2, ChevronRight, Loader2 } from "lucide-react";
import { PRESTADORES, EXPORTES } from "../data";
import { Tip } from "./Tip";

const ICONS: Record<string, typeof Download> = { supersalud: Building2, adres: Download, json: Download };

export function ExportSection() {
  const [exportando, setExportando] = useState<string | null>(null);

  function handleExport(id: string) {
    if (exportando) return;
    if (id === "json") {
      const blob = new Blob([JSON.stringify({ prestadores: PRESTADORES, fecha: new Date().toISOString() }, null, 2)], { type: "application/json" });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `auditoria-${new Date().toISOString().slice(0, 10)}.json` });
      a.click();
      return;
    }
    setExportando(id);
    setTimeout(() => setExportando(null), 2000);
  }

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-1.5 mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Módulos de Reporte Regulatorio</h2>
        <Tip text="Exportaciones a los entes reguladores del sistema de salud colombiano. RIPS: Registro Individual de Prestación de Servicios. Supersalud: ente de control y vigilancia. ADRES: Administradora de los Recursos del Sistema General de Seguridad Social." wide />
      </div>
      <div className="flex flex-wrap gap-3">
        {EXPORTES.map((e) => {
          const Icon = ICONS[e.id] ?? Download;
          const isProcessing = exportando === e.id;
          return (
            <button key={e.id} onClick={() => handleExport(e.id)} disabled={!!exportando}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : <Icon className="h-4 w-4 text-slate-400" />}
              {e.label}
              <ChevronRight className="h-3 w-3 text-slate-300 ml-1" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
