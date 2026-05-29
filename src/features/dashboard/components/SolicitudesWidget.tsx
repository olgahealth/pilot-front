"use client";

import { ArrowUpRight } from "lucide-react";

type Solicitud = { id: number; paciente: string; plan_nombre: string; urgencia: string };

interface Props { solicitudes: Solicitud[]; }

export function SolicitudesWidget({ solicitudes }: Props) {
  return (
    <div className="space-y-4">
      <div className="px-2"><h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Solicitudes</h2></div>
      <div className="bg-white ring-1 ring-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full border-t-2 border-t-indigo-500">
        <div className="p-4 space-y-3 flex-1">
          {solicitudes.map((s) => (
            <div key={s.id} className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100 group hover:bg-white hover:border-indigo-200 transition-all cursor-default">
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-slate-900 leading-tight">{s.paciente}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${s.urgencia === "urgente" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-white text-slate-400 border-slate-100"}`}>
                  {s.urgencia === "urgente" ? "Urgente" : "Programado"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">{s.plan_nombre}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button className="w-full py-3 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.1em]">
            Autorizar Lote <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
