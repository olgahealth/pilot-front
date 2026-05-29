"use client";

import { ClipboardList } from "lucide-react";
import { type Plan } from "../types";
import { PLAN_STYLES, formatCOP } from "../constants";

interface Props { plan: Plan | null; diasPostAlta: number; adherencia: number; }

export function PlanCard({ plan, diasPostAlta, adherencia }: Props) {
  if (!plan) return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col items-center justify-center py-8 text-gray-300">
      <ClipboardList className="w-8 h-8 mb-2" />
      <p className="text-xs font-medium">Sin plan registrado</p>
    </div>
  );

  const style = PLAN_STYLES[plan.nombre] ?? PLAN_STYLES["PARD"];

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-black px-2.5 py-1 rounded-md border uppercase tracking-wider ${style.bg} ${style.text} ${style.border}`}>
          {plan.nombre}
        </span>
        <h2 className="text-sm font-bold text-gray-900">Plan de Atención</h2>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-gray-600">Día {diasPostAlta} de tratamiento</span>
          <span className={`text-xs font-bold ${adherencia >= 90 ? "text-emerald-600" : adherencia >= 70 ? "text-amber-600" : "text-red-600"}`}>
            {adherencia}% adherencia
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${adherencia >= 90 ? "bg-emerald-500" : adherencia >= 70 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${adherencia}%` }} />
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-3">{plan.descripcion}</p>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
        <span>{plan.medico_solicitante}</span>
        <span className="text-gray-200">·</span>
        <span>{plan.hospital}</span>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${plan.urgencia === "urgente" ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-100 text-gray-500"}`}>
          {plan.urgencia === "urgente" ? "Urgente" : "Programado"}
        </span>
        <span className="text-xs font-bold text-gray-700">{formatCOP(plan.costo_estimado)}<span className="text-[10px] font-normal text-gray-400">/mes</span></span>
      </div>
    </div>
  );
}
