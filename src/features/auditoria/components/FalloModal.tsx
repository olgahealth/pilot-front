"use client";

import { X, Cpu, ShieldX, Clock } from "lucide-react";
import { type Prestador, fmtM } from "../data";

interface Props { prestador: Prestador; onClose: () => void; }

export function FalloModal({ prestador, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Detalle de fallos</p>
            <h3 className="text-base font-semibold text-slate-900">{prestador.nombre}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          {([["Aprobado", prestador.cap_aprobado, "text-emerald-700"], ["Cuarentena", prestador.cap_cuarentena, "text-amber-700"], ["Rechazado", prestador.cap_rechazado, "text-rose-700"]] as const).map(([label, val, cls]) => (
            <div key={label} className="px-5 py-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
              <p className={`text-sm font-bold ${cls}`}>{fmtM(val as number)}</p>
            </div>
          ))}
        </div>
        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {prestador.fallos.map((f) => (
            <div key={f.codigo} className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${f.tipo === "hardware" ? "bg-slate-100" : "bg-rose-50"}`}>
                  {f.tipo === "hardware" ? <Cpu className="w-3.5 h-3.5 text-slate-600" /> : <ShieldX className="w-3.5 h-3.5 text-rose-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${f.tipo === "hardware" ? "bg-slate-100 text-slate-600" : "bg-rose-100 text-rose-700"}`}>
                      {f.tipo === "hardware" ? "Hardware / Red" : "Fraude clínico"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{f.codigo}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-0.5">{f.descripcion}</p>
                  <p className="text-xs text-slate-500 mb-1">{f.motivo}</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400 italic">{f.resolucion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="w-full py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
