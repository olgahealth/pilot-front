"use client";

import { ClipboardList } from "lucide-react";
import { type Plan } from "../types";
import { ESTADO_SOL_STYLES, formatCOP } from "../constants";

interface Props { plan: Plan | null; }

export function ClinicalOrderCard({ plan }: Props) {
  if (!plan) return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col items-center justify-center py-8 text-gray-300">
      <ClipboardList className="w-8 h-8 mb-2" />
      <p className="text-xs font-medium">Sin orden registrada</p>
    </div>
  );

  const estilo = ESTADO_SOL_STYLES[plan.estado_solicitud] ?? ESTADO_SOL_STYLES["pendiente"];

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-gray-400" />
        <h2 className="text-sm font-bold text-gray-900">Orden Clínica</h2>
      </div>
      <div className="space-y-2.5">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipo de servicio</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{plan.tipo_servicio}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</p>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mt-0.5 ${estilo.bg} ${estilo.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${estilo.dot}`} />{estilo.label}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fecha solicitud</p>
          <p className="text-sm font-medium text-gray-700 mt-0.5">{plan.fecha_solicitud}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valor facturable</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{formatCOP(plan.costo_estimado)}<span className="text-[10px] font-normal text-gray-400"> / mes</span></p>
        </div>
        {plan.cie_codigo && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Clasificación</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              {plan.cie_version ?? "CIE-10"} {plan.cie_codigo}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
