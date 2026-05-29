"use client";

import { SCORING } from "../data";
import { Tip, Stars } from "./Tip";

export function ScoringPanel() {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-semibold text-slate-900">Índice de Confiabilidad</h2>
          <Tip text="Puntaje de 1 a 5 calculado automáticamente por OLGA según: tasa GPS, tasa firma, irregularidades históricas y tiempos de respuesta. Determina la prioridad de pago y la elegibilidad de nuevos contratos." wide />
        </div>
        <p className="text-xs text-slate-400 mt-0.5">Métrica compuesta de cumplimiento</p>
      </div>
      <div className="p-2 flex-1 overflow-y-auto">
        {SCORING.map((s) => (
          <div key={s.nombre} className="flex items-start justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-900">{s.nombre}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.razon}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
              <span className="text-sm font-semibold tabular-nums text-slate-900">{s.score}</span>
              <Stars score={s.score} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
