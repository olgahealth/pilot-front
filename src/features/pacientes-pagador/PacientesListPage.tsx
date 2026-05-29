"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { usePagination } from "@/utils/usePagination";
import { PatientTable } from "./components/PatientTable";

type Riesgo = "alto" | "medio" | "bajo";
type PacientePagador = {
  id: number; nombre: string; cedula: string; diagnostico: string;
  dias_post_alta: number; edad?: number | null;
  riesgo: Riesgo; riesgo_pct: number; adherencia: number; tendencia: string;
  eps: string; medico: string;
};

const RIESGO_STYLES: Record<Riesgo, { bg: string; text: string; dot: string; label: string }> = {
  alto:  { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500",    label: "Alto"  },
  medio: { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   label: "Medio" },
  bajo:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Bajo"  },
};

const PAQUETES = ["Todos", "PHD", "PAD", "PARD", "Paliativo", "Alto Costo"] as const;
type Paquete = typeof PAQUETES[number];

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

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function PacientesListPage() {
  const router = useRouter();
  const [pacientes, setPacientes]     = useState<PacientePagador[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch]           = useState("");
  const [filterRiesgo, setFilterRiesgo]   = useState<"todos" | Riesgo>("todos");
  const [filterPaquete, setFilterPaquete] = useState<Paquete>("Todos");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/eps/pacientes?per_page=100`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } })
      .then((r) => r.json())
      .then((d) => setPacientes(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  const filtered = useMemo(() => pacientes.filter((p) => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.cedula.includes(search) || p.diagnostico.toLowerCase().includes(search.toLowerCase());
    const matchRiesgo  = filterRiesgo  === "todos" || p.riesgo === filterRiesgo;
    const matchPaquete = filterPaquete === "Todos" || getPaquete(p) === filterPaquete;
    return matchSearch && matchRiesgo && matchPaquete;
  }), [pacientes, search, filterRiesgo, filterPaquete]);

  const { paginatedItems, currentPage, totalPages, goToNext, goToPrev, isFirstPage, isLastPage } = usePagination(filtered, 10);

  const counts = useMemo(() => ({
    alto:  pacientes.filter((p) => p.riesgo === "alto").length,
    medio: pacientes.filter((p) => p.riesgo === "medio").length,
    bajo:  pacientes.filter((p) => p.riesgo === "bajo").length,
  }), [pacientes]);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 antialiased p-4 lg:p-8 space-y-8">

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20">EPS Sura Operaciones</span>
            <span className="text-sm font-medium text-slate-500 tracking-tight">Mayo 2026</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-slate-900">Pacientes Monitoreados</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{loadingData ? "Cargando..." : `${pacientes.length} registros en red activa`}</p>
        </div>
        <div className="flex items-center gap-2">
          {(["alto", "medio", "bajo"] as const).map((r) => (
            <button key={r} onClick={() => setFilterRiesgo(filterRiesgo === r ? "todos" : r)}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] px-3 py-2 rounded-lg border transition-all ${filterRiesgo === r ? `${RIESGO_STYLES[r].bg} ${RIESGO_STYLES[r].text} border-current/20 ring-1 ring-current/10 shadow-sm` : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${RIESGO_STYLES[r].dot} ${filterRiesgo === r ? "animate-pulse" : ""}`} />
              {counts[r]} {r}
            </button>
          ))}
        </div>
      </header>

      {/* Paquete filter */}
      <div className="flex flex-wrap gap-2">
        {PAQUETES.map((p) => (
          <button key={p} onClick={() => setFilterPaquete(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filterPaquete === p ? p === "Todos" ? "bg-gray-800 text-white border-gray-800" : `${PAQUETE_STYLES[p]?.bg} ${PAQUETE_STYLES[p]?.text} border-current/20` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
            {p}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="BUSCAR POR NOMBRE, CÉDULA O DIAGNÓSTICO..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-400" />
        </div>
        <div className="relative">
          <select value={filterRiesgo} onChange={(e) => setFilterRiesgo(e.target.value as "todos" | Riesgo)}
            className="text-[11px] font-bold uppercase tracking-wider border border-slate-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 appearance-none bg-slate-50 cursor-pointer">
            <option value="todos">TODOS LOS RIESGOS</option>
            <option value="alto">ALTO RIESGO</option>
            <option value="medio">RIESGO MEDIO</option>
            <option value="bajo">BAJO RIESGO</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {(search || filterRiesgo !== "todos") && (
          <button onClick={() => { setSearch(""); setFilterRiesgo("todos"); }} className="text-[10px] font-black text-rose-600 hover:text-rose-700 uppercase tracking-widest ml-2">Limpiar Filtros</button>
        )}
      </div>

      <PatientTable
        items={paginatedItems}
        currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length}
        isFirstPage={isFirstPage} isLastPage={isLastPage}
        onNext={goToNext} onPrev={goToPrev}
        onRowClick={(id) => router.push(`/pacientes/${id}`)}
      />

      <footer className="pt-8 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 gap-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 OLGA HEALTHTECH · INFRAESTRUCTURA SURA</p>
        <div className="flex gap-6 text-[10px] font-bold text-slate-400 tracking-widest">
          <button className="hover:text-indigo-600 transition-colors uppercase">Consola de Red</button>
          <button className="hover:text-indigo-600 transition-colors uppercase">Protocolos de Seguridad</button>
        </div>
      </footer>
    </div>
  );
}
