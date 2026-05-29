"use client";

import { Building2 } from "lucide-react";
import { Tip } from "./Tip";

const MODALIDADES = [
  { modalidad: "PAD",                   color: "bg-blue-100 text-blue-700",    activos: 38, reingresos: 7, meta: 10 },
  { modalidad: "PHD",                   color: "bg-violet-100 text-violet-700", activos: 32, reingresos: 3, meta: 10 },
  { modalidad: "Rehabilitación en casa", color: "bg-indigo-100 text-indigo-700",activos: 35, reingresos: 0, meta: 5  },
];

export function IngresosModalidad() {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-indigo-500" />
          <h2 className="text-base font-semibold text-slate-900">Ingresos hospitalarios por modalidad</h2>
          <Tip text="Número de pacientes de cada modalidad que requirieron ingreso hospitalario no planificado. La Rehabilitación debería estar en cero. PAD concentra los reingresos por ser pacientes crónicos." wide />
        </div>
        <span className="text-xs text-slate-400">Mayo 2026</span>
      </div>
      <div className="p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modalidad</th>
              <th className="text-right pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activos</th>
              <th className="text-right pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reingresos</th>
              <th className="text-right pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tasa</th>
              <th className="text-right pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MODALIDADES.map((row) => {
              const tasa = row.activos > 0 ? Math.round((row.reingresos / row.activos) * 100) : 0;
              const isOk = tasa < row.meta;
              return (
                <tr key={row.modalidad} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.color}`}>{row.modalidad}</span></td>
                  <td className="py-3.5 text-right font-semibold text-slate-700">{row.activos}</td>
                  <td className="py-3.5 text-right"><span className={`text-sm font-bold ${row.reingresos === 0 ? "text-emerald-600" : !isOk ? "text-rose-600" : "text-amber-600"}`}>{row.reingresos}</span></td>
                  <td className="py-3.5 text-right"><span className={`text-sm font-bold ${isOk ? "text-emerald-600" : "text-rose-600"}`}>{tasa}%</span></td>
                  <td className="py-3.5 text-right">
                    {row.reingresos === 0
                      ? <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Óptimo</span>
                      : !isOk
                      ? <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">Acción</span>
                      : <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Vigilancia</span>}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t border-slate-200 bg-slate-50/50">
              <td className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</td>
              <td className="py-3 text-right text-sm font-bold text-slate-700">105</td>
              <td className="py-3 text-right text-sm font-bold text-slate-900">10</td>
              <td className="py-3 text-right text-sm font-bold text-amber-700">9.5%</td>
              <td className="py-3 text-right"><span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">En meta</span></td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          PAD concentra la mayor tasa (18%). La Rehabilitación mantiene <strong className="text-emerald-600">0 reingresos</strong>.
        </p>
      </div>
    </div>
  );
}
