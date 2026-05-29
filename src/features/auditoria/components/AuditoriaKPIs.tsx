"use client";

import { Tip } from "./Tip";

export function AuditoriaKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-indigo-500">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Presupuesto</p>
          <Tip text="Porcentaje del presupuesto mensual de atención domiciliaria que ya se ejecutó. Si supera el 90% antes de cerrar el mes, se activa alerta de sobrecosto." wide />
        </div>
        <p className="text-4xl font-bold tabular-nums text-indigo-700 tracking-tight">83%</p>
        <p className="text-xs text-slate-400 mt-1">$18.4M de $22M ejecutados</p>
      </div>

      <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-emerald-500">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Servicios<br/>pactados vs realizados</p>
          <Tip text="Cuántos servicios se verificaron como prestados vs. los que estaban contratados. Los que faltan están en conciliación o con fallo técnico." wide />
        </div>
        <p className="text-4xl font-bold tabular-nums text-emerald-700 tracking-tight">138/142</p>
        <p className="text-xs text-slate-400 mt-1">97.2% de cumplimiento</p>
      </div>

      <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-amber-400">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">% Reingresos<br/>30 días</p>
          <Tip text="Porcentaje de pacientes que regresaron al hospital dentro de los 30 días posteriores al alta. Meta: menos del 10%." wide />
        </div>
        <p className="text-4xl font-bold tabular-nums text-amber-600 tracking-tight">8%</p>
        <p className="text-xs text-slate-400 mt-1">↓ 2pp vs Abril · Meta: &lt;10%</p>
      </div>

      <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-t-2 border-t-slate-400">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Índice de<br/>confiabilidad</p>
          <Tip text="Puntaje promedio de todos los prestadores activos, de 1 a 5. Determina prioridad de pago y renovación de contratos." wide />
        </div>
        <p className="text-4xl font-bold tabular-nums text-slate-800 tracking-tight">4.1/5</p>
        <p className="text-xs text-slate-400 mt-1">Promedio red activa · Mayo 2026</p>
      </div>
    </div>
  );
}
