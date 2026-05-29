"use client";

import Link from "next/link";
import { MapPin, PenLine, AlertCircle } from "lucide-react";
import { type TimelineItem } from "../types";
import { ESTADO_ICON } from "../constants";

interface Props { timeline: TimelineItem[]; }

export function VisitTimeline({ timeline }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">Ejecución cronológica</h2>
        <p className="text-xs text-gray-500 mt-0.5">{timeline.length} visitas registradas</p>
      </div>
      <div className="p-5 flex-1 overflow-y-auto max-h-[400px] relative">
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Sin visitas registradas aún</p>
        ) : timeline.map((item, idx) => {
          const s      = ESTADO_ICON[item.estado];
          const Icon   = s.icon;
          const isLast = idx === timeline.length - 1;
          return (
            <div key={item.id} className="flex gap-3 relative">
              {!isLast && <div className={`absolute left-[15px] top-8 w-0.5 h-full ${s.line} opacity-30`} />}
              <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full ${s.bg} flex items-center justify-center z-10`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="pb-5 flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-500">{item.fecha}</p>
                <p className={`text-sm font-semibold leading-tight mt-0.5 ${item.estado === "no_cumplido" ? "text-red-700" : "text-gray-900"}`}>
                  {item.servicio}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {item.profesional}
                  {item.entidad && <span className="text-gray-300"> · </span>}
                  {item.entidad}
                </p>
                {item.estado === "cumplido" && (
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <MapPin className="w-3 h-3 text-emerald-600" /> GPS verificado
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <PenLine className="w-3 h-3 text-emerald-600" /> Firma capturada
                    </span>
                  </div>
                )}
                {item.estado === "cumplido" && (
                  <Link href={`/evidencia/${item.id}`} className="inline-block mt-2 text-[11px] font-bold text-emerald-600 hover:underline">
                    Ver evidencia →
                  </Link>
                )}
                {item.nota && (
                  <div className={`mt-2 px-3 py-2 rounded-lg border flex items-start gap-2 ${item.estado === "no_cumplido" ? "bg-red-50 border-red-100 text-red-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-medium">{item.nota}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
