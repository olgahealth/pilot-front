"use client";

import { CheckCircle, Cpu, ShieldX } from "lucide-react";
import { PRESTADORES, TOTAL_OPS, TOTAL_APROBADO, TOTAL_CUARENTENA, TOTAL_RECHAZADO, TOTAL_FALLOS, type Prestador } from "../data";
import { Tip, CapitalCell } from "./Tip";

interface Props { onVerDetalle: (p: Prestador) => void; }

export function LiquidacionTable({ onVerDetalle }: Props) {
  return (
    <div className="lg:col-span-2 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Estado de Liquidación</h2>
          <p className="text-xs text-slate-400 mt-0.5">Capital dividido por estado de conciliación</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-emerald-700">■ Aprobado</span>
          <span className="text-amber-600">■ Cuarentena</span>
          <span className="text-rose-600">■ Rechazado</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 font-medium">Prestador</th>
              <th className="px-3 py-3 font-medium text-center"><span className="flex items-center justify-center gap-1">Verificación <Tip text="GPS: confirma que el profesional llegó al domicilio. Firma: el paciente confirma que fue atendido. Ambas son obligatorias para aprobar el pago." wide /></span></th>
              <th className="px-3 py-3 font-medium text-right"><span className="flex items-center justify-end gap-1">Costo/visita <Tip text="Costo promedio por visita con evidencia completa." wide /></span></th>
              <th className="px-3 py-3 font-medium text-right"><span className="flex items-center justify-end gap-1">Aprobado <Tip text="Dinero listo para pagar." /></span></th>
              <th className="px-3 py-3 font-medium text-right"><span className="flex items-center justify-end gap-1">Cuarentena <Tip text="Retenido por fallo técnico." wide /></span></th>
              <th className="px-3 py-3 font-medium text-right"><span className="flex items-center justify-end gap-1">Rechazado <Tip text="Bloqueado por fraude comprobado." wide /></span></th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PRESTADORES.map((p) => {
              const gpsOk = p.gps === p.servicios;
              const firmaOk = p.firma === p.servicios;
              return (
                <tr key={p.nombre} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900 whitespace-nowrap">{p.nombre}</td>
                  <td className="px-3 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 w-8 text-right">GPS</span>
                        <span className={`font-semibold tabular-nums ${gpsOk ? "text-emerald-700" : "text-rose-600"}`}>{p.gps}/{p.servicios}</span>
                        {gpsOk ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Cpu className="w-3 h-3 text-rose-400" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 w-8 text-right">Firma</span>
                        <span className={`font-semibold tabular-nums ${firmaOk ? "text-emerald-700" : "text-amber-600"}`}>{p.firma}/{p.servicios}</span>
                        {firmaOk ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <ShieldX className="w-3 h-3 text-amber-400" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums text-slate-600 text-sm font-medium">{p.gps > 0 ? `$${Math.round(p.cap_aprobado / p.gps / 1000)}K` : "—"}</td>
                  <td className="px-3 py-4 text-right"><CapitalCell value={p.cap_aprobado} variant="aprobado" /></td>
                  <td className="px-3 py-4 text-right">
                    <CapitalCell value={p.cap_cuarentena} variant="cuarentena" />
                    {p.cap_cuarentena > 0 && <p className="text-[10px] text-amber-500 font-medium mt-0.5">Pendiente aclaración</p>}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <CapitalCell value={p.cap_rechazado} variant="rechazado" />
                    {p.cap_rechazado > 0 && <p className="text-[10px] text-rose-500 font-medium mt-0.5">Fraude comprobado</p>}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {p.fallos.length > 0
                      ? <button onClick={() => onVerDetalle(p)} className="whitespace-nowrap text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">Ver detalles →</button>
                      : <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50/80 border-t-2 border-slate-200">
            <tr>
              <td className="px-5 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">Total</td>
              <td className="px-3 py-3 text-center text-xs text-slate-400">GPS {PRESTADORES.reduce((s, p) => s + p.gps, 0)}/{TOTAL_OPS} · Firma {PRESTADORES.reduce((s, p) => s + p.firma, 0)}/{TOTAL_OPS}</td>
              <td className="px-3 py-3" />
              <td className="px-3 py-3 text-right text-xs font-bold text-emerald-700 tabular-nums">${(TOTAL_APROBADO/1_000_000).toFixed(1)}M</td>
              <td className="px-3 py-3 text-right text-xs font-bold text-amber-700 tabular-nums">${(TOTAL_CUARENTENA/1_000_000).toFixed(1)}M</td>
              <td className="px-3 py-3 text-right text-xs font-bold text-rose-700 tabular-nums">${(TOTAL_RECHAZADO/1_000_000).toFixed(1)}M</td>
              <td className="px-4 py-3 text-xs text-slate-400">{TOTAL_FALLOS} irregularidades</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
