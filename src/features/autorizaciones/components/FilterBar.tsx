"use client";

import { Filter, Search, ChevronDown } from "lucide-react";
import { type EstadoSolicitud } from "@/data/mock/solicitudes";
import { TIPOS_SERVICIO } from "../constants";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filterUrgencia: "todos" | "urgente" | "programado";
  onFilterUrgencia: (v: "todos" | "urgente" | "programado") => void;
  filterEstado: EstadoSolicitud | "todos";
  onFilterEstado: (v: EstadoSolicitud | "todos") => void;
  filterTipo: string;
  onFilterTipo: (v: string) => void;
}

export function FilterBar({
  search, onSearch,
  filterUrgencia, onFilterUrgencia,
  filterEstado, onFilterEstado,
  filterTipo, onFilterTipo,
}: Props) {
  return (
    <div data-tour="filtros" className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
      {/* Fila 1 */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente, diagnóstico, médico..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {(["todos", "urgente", "programado"] as const).map((u) => (
              <button
                key={u}
                onClick={() => onFilterUrgencia(u)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  filterUrgencia === u ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {u === "todos" ? "Todos" : u === "urgente" ? "Urgentes" : "Programados"}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <select
            value={filterTipo}
            onChange={(e) => onFilterTipo(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none bg-white"
          >
            {TIPOS_SERVICIO.map((t) => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Fila 2: estado */}
      <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado:</span>
        {([
          { value: "todos",               label: "Todas"           },
          { value: "pendiente",           label: "Pendiente"       },
          { value: "aprobado",            label: "Aprobadas"       },
          { value: "aprobado_condiciones",label: "Con condiciones" },
          { value: "negado",              label: "Negadas"         },
        ] as const).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterEstado(value)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              filterEstado === value
                ? value === "aprobado"            ? "bg-emerald-600 text-white"
                : value === "aprobado_condiciones"? "bg-amber-500 text-white"
                : value === "negado"              ? "bg-red-600 text-white"
                : "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
