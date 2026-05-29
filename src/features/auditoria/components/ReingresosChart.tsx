"use client";

import { TrendingDown, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { REINGRESO } from "../data";
import { Tip } from "./Tip";

export function ReingresosChart() {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-amber-500" />
          <h2 className="text-base font-semibold text-slate-900">Tasa de reingreso hospitalario por prestador</h2>
          <Tip text="Porcentaje de pacientes que volvieron al hospital dentro de los 30 días siguientes al alta. Meta: menos del 10%." wide />
        </div>
        <span className="text-xs text-slate-400">30 días post-alta · Mayo 2026</span>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-4 text-[11px] font-medium text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Menos del 10%</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> 10–15% vigilancia</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Más del 15% acción</span>
        </div>
        <div className="space-y-3">
          {Object.entries(REINGRESO).sort((a, b) => a[1] - b[1]).map(([ips, pct]) => {
            const color     = pct < 10 ? "bg-emerald-500" : pct <= 15 ? "bg-amber-400" : "bg-rose-500";
            const textColor = pct < 10 ? "text-emerald-700" : pct <= 15 ? "text-amber-700" : "text-rose-700";
            const bgLight   = pct < 10 ? "bg-emerald-50"  : pct <= 15 ? "bg-amber-50"  : "bg-rose-50";
            const Icon      = pct >= 15 ? AlertCircle : pct >= 10 ? TrendingUp : CheckCircle;
            return (
              <div key={ips} className={`flex items-center gap-4 p-3 rounded-xl ${bgLight}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${textColor}`} />
                <div className="w-28 flex-shrink-0"><p className="text-sm font-semibold text-slate-900">{ips}</p></div>
                <div className="flex-1">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(pct * 4, 100)}%` }} />
                  </div>
                </div>
                <span className={`text-sm font-bold tabular-nums w-10 text-right ${textColor}`}>{pct}%</span>
                {pct >= 10 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pct >= 15 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {pct >= 15 ? 'Acción' : 'Vigilancia'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          Reducir la tasa del 12% al 8% en IPS SurOccidente representaría un ahorro estimado de <strong className="text-slate-600">$4.2M COP</strong> mensuales.
        </p>
      </div>
    </div>
  );
}
