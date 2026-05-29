"use client";

import { Activity, Search } from "lucide-react";
import PaginationBar from "@/components/PaginationBar";

type PacientePagador = {
  id: number; nombre: string; cedula: string; diagnostico: string;
  dias_post_alta: number; riesgo: string; riesgo_pct: number;
  adherencia: number; tendencia: string; edad?: number | null;
};

const RIESGO_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  alto:  { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    label: "Alto"  },
  medio: { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  label: "Medio" },
  bajo:  { bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500",label: "Bajo"  },
};
const PAQUETE_STYLES: Record<string, { bg: string; text: string }> = {
  PHD:          { bg: "bg-violet-100", text: "text-violet-700" },
  PAD:          { bg: "bg-blue-100",   text: "text-blue-700"   },
  PARD:         { bg: "bg-indigo-100", text: "text-indigo-700" },
  Paliativo:    { bg: "bg-rose-100",   text: "text-rose-700"   },
  "Alto Costo": { bg: "bg-amber-100",  text: "text-amber-700"  },
};
function getPaquete(p: PacientePagador): string {
  if (/cáncer|cancer|oncol|palia|terminal/i.test(p.diagnostico)) return "Paliativo";
  if (p.dias_post_alta > 180) return "Alto Costo";
  if (p.riesgo === "alto" && p.dias_post_alta < 30) return "PHD";
  if (p.riesgo === "alto") return "PAD";
  return "PARD";
}
function AdherenciaBadge({ pct }: { pct: number }) {
  const cfg = pct >= 90 ? { bg: "bg-emerald-100", text: "text-emerald-700", icon: "🟢" } : pct >= 70 ? { bg: "bg-amber-100", text: "text-amber-700", icon: "🟡" } : { bg: "bg-red-100", text: "text-red-700", icon: "🔴" };
  return <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} flex items-center gap-1 w-fit`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{pct}%</span>;
}
function TendenciaBadge({ t }: { t: string }) {
  const cfg: Record<string, { label: string; color: string }> = {
    mejorando:    { label: "↑ Mejorando",    color: "text-emerald-600" },
    estable:      { label: "— Estable",      color: "text-slate-500"   },
    deteriorando: { label: "↓ Deteriorando", color: "text-red-600"     },
  };
  const c = cfg[t] ?? cfg["estable"];
  return <span className={`text-[10px] font-black uppercase tracking-tight ${c.color}`}>{c.label}</span>;
}

interface Props {
  items: PacientePagador[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  onNext: () => void;
  onPrev: () => void;
  onRowClick: (id: number) => void;
}

export function PatientTable({ items, currentPage, totalPages, totalItems, isFirstPage, isLastPage, onNext, onPrev, onRowClick }: Props) {
  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 shadow-sm overflow-hidden border-t-2 border-t-indigo-500">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {["#", "Paciente", "Diagnóstico Clínico", "Paquete", "Seguimiento", "Riesgo Bio", "Adherencia", "Tendencia"].map((h) => (
                <th key={h} className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] first:px-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((p, idx) => {
              const rs = RIESGO_STYLES[p.riesgo];
              const globalIdx = (currentPage - 1) * 10 + idx + 1;
              return (
                <tr key={p.id} onClick={() => onRowClick(p.id)} className="group hover:bg-slate-50 transition-all cursor-pointer">
                  <td className="px-6 py-4 text-[11px] text-slate-400 font-bold">{globalIdx.toString().padStart(2, "0")}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{p.nombre}</p>
                    <p className="text-[10px] font-medium text-slate-400 tracking-widest">
                      {p.cedula}
                      {p.edad != null && <><span className="text-slate-300"> · </span><span className="text-slate-500">{p.edad} años</span></>}
                    </p>
                  </td>
                  <td className="px-4 py-4"><p className="text-[11px] font-medium text-slate-600 leading-relaxed max-w-[200px] italic">{p.diagnostico}</p></td>
                  <td className="px-4 py-4">{(() => { const pq = getPaquete(p); const s = PAQUETE_STYLES[pq]; return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s?.bg} ${s?.text}`}>{pq}</span>; })()}</td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2"><Activity size={12} className="text-indigo-500" /><span className="text-xs font-bold text-slate-900">Día {p.dias_post_alta}</span></div></td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center justify-center gap-1.5 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter w-fit ${rs.bg} ${rs.text} ring-1 ring-current/10`}>{rs.label}</span>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">{p.riesgo_pct}% score</p>
                  </td>
                  <td className="px-4 py-4"><AdherenciaBadge pct={p.adherencia} /></td>
                  <td className="px-4 py-4"><TendenciaBadge t={p.tendencia} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50">
            <Search className="w-10 h-10 mx-auto mb-4 text-slate-200" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No se encontraron registros en la red</p>
          </div>
        )}
      </div>
      <div className="bg-slate-50/50 border-t border-slate-100">
        <PaginationBar currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={10} onNext={onNext} onPrev={onPrev} isFirstPage={isFirstPage} isLastPage={isLastPage} />
      </div>
    </div>
  );
}
