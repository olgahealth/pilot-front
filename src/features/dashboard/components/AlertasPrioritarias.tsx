"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight, Zap } from "lucide-react";

type Alerta = { id: number; nombre: string; diagnostico: string; riesgo_pct: number; tendencia: string };

function AlertaSkeleton() {
  return (
    <div className="flex items-center gap-5 p-4 rounded-r-xl rounded-l-sm border-l-4 border-l-slate-200 ring-1 ring-slate-200 bg-white animate-pulse">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-200" />
      <div className="flex-1 space-y-2"><div className="h-4 w-40 rounded bg-slate-200" /><div className="h-3 w-56 rounded bg-slate-200" /></div>
    </div>
  );
}

interface Props { alertas: Alerta[]; loading: boolean; }

export function AlertasPrioritarias({ alertas, loading }: Props) {
  return (
    <div className="lg:col-span-3 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600" />
          </span>
          Atención Prioritaria
        </h2>
        <span className="animate-pulse flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-100">
          <Zap size={10} fill="currentColor" /> ACCIÓN REQUERIDA
        </span>
      </div>

      <div className="grid gap-3">
        {loading ? (
          <><AlertaSkeleton /><AlertaSkeleton /><AlertaSkeleton /></>
        ) : alertas.map((alerta, idx) => {
          const isCritical = idx < 2 || alerta.tendencia === "deteriorando";
          return (
            <Link key={alerta.id} href={`/pacientes/${alerta.id}`}
              className={`group flex items-center justify-between p-4 transition-all duration-200 shadow-sm border-l-4 rounded-r-xl rounded-l-sm ${isCritical ? 'bg-rose-50/40 border-l-rose-600 hover:bg-rose-50 ring-1 ring-rose-200' : 'bg-white border-l-amber-500 hover:bg-slate-50 ring-1 ring-slate-200'}`}>
              <div className="flex items-center gap-5 min-w-0">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${isCritical ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500/10 text-amber-700'}`}>
                  <AlertTriangle className={isCritical ? "w-6 h-6" : "w-5 h-5"} />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <p className={`text-base font-bold ${isCritical ? 'text-rose-900' : 'text-slate-900'}`}>{alerta.nombre}</p>
                    {isCritical && <span className="text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded uppercase">Alta Prioridad</span>}
                  </div>
                  <p className={`text-sm font-medium ${isCritical ? 'text-rose-700/80' : 'text-slate-500'}`}>{alerta.diagnostico} · Riesgo {alerta.riesgo_pct}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-rose-600' : 'text-slate-400'}`}>Intervenir</span>
                <ChevronRight className={`w-5 h-5 ${isCritical ? 'text-rose-400' : 'text-slate-300'} group-hover:translate-x-1 transition-all`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
