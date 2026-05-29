"use client";

import { Users2 } from "lucide-react";
import { CUPS_MEDICOS } from "../data";
import { Tip } from "./Tip";

export function CupsTable() {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users2 className="h-4 w-4 text-indigo-500" />
          <h2 className="text-base font-semibold text-slate-900">Atenciones efectivas por CUPS</h2>
          <Tip text="Agrupa los servicios por tipo de procedimiento (código CUPS del Ministerio de Salud). Permite detectar qué tipo de atención domiciliaria se está prestando más y si el volumen es coherente con los contratos." wide />
        </div>
        <span className="text-xs text-slate-400">Mayo 2026</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 font-medium">IPS</th>
              <th className="px-4 py-3 font-medium"><span className="flex items-center gap-1">CUPS <Tip text="Código único del procedimiento según el Ministerio de Salud." /></span></th>
              <th className="px-4 py-3 font-medium text-center"><span className="flex items-center justify-center gap-1">Atenciones <Tip text="Número de veces que se prestó este servicio en el mes." /></span></th>
              <th className="px-4 py-3 font-medium text-right"><span className="flex items-center justify-end gap-1">Monto total <Tip text="Total facturado por este tipo de servicio en el mes." /></span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {CUPS_MEDICOS.map((row) => (
              <tr key={row.cups} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-slate-500">{row.ips}</td>
                <td className="px-4 py-3 text-slate-700 text-xs font-mono">{row.cups}</td>
                <td className="px-4 py-3 text-center text-slate-900 font-semibold">{row.atenciones}</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-900">{row.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
