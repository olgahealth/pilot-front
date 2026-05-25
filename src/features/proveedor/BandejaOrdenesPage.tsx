"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface Orden {
  id: number;
  cedula: string;
  diagnostico: string;
  planNombre: string;
  tipoServicio: string;
  urgencia: string;
  estado: string;
  fecha: string;
  medicoSolicitante: string;
  hospital: string;
}

const URGENCIA_COLORS: Record<string, string> = {
  urgente:    "bg-rose-100 text-rose-700",
  programado: "bg-blue-100 text-blue-700",
};

const ESTADO_COLORS: Record<string, string> = {
  pendiente:  "bg-amber-100 text-amber-700",
  aprobado:   "bg-emerald-100 text-emerald-700",
  negado:     "bg-rose-100 text-rose-700",
  autorizado: "bg-emerald-100 text-emerald-700",
};

const URGENCIA_LABELS: Record<string, string> = { urgente: "Urgente", programado: "Programado" };
const ESTADO_LABELS: Record<string, string>   = { pendiente: "Pendiente", aprobado: "Aprobado", negado: "Negado", autorizado: "Autorizado" };

export default function BandejaOrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroUrgencia, setFiltroUrgencia] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/proveedor/ordenes`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then(setOrdenes)
      .catch(() => setError("No se pudo cargar la bandeja de órdenes"))
      .finally(() => setLoading(false));
  }, []);

  const filtradas = ordenes.filter((o) => {
    const matchBusqueda = !busqueda || o.cedula.includes(busqueda) || o.diagnostico.toLowerCase().includes(busqueda.toLowerCase()) || o.planNombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchUrgencia = filtroUrgencia === "todos" || o.urgencia === filtroUrgencia;
    const matchEstado   = filtroEstado   === "todos" || o.estado   === filtroEstado;
    return matchBusqueda && matchUrgencia && matchEstado;
  });

  if (loading) return <div className="flex items-center justify-center min-h-96"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  if (error)   return <div className="p-8 text-center text-rose-600">{error}</div>;

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bandeja de órdenes</h1>
          <p className="text-sm text-gray-500">{filtradas.length} órdenes</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <input
          type="text"
          placeholder="Buscar por cédula, diagnóstico o plan..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1">
            {["todos", "urgente", "programado"].map((v) => (
              <button key={v} onClick={() => setFiltroUrgencia(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filtroUrgencia === v ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {v === "todos" ? "Todos" : URGENCIA_LABELS[v]}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {["todos", "pendiente", "aprobado", "negado"].map((v) => (
              <button key={v} onClick={() => setFiltroEstado(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filtroEstado === v ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {v === "todos" ? "Todos" : ESTADO_LABELS[v] ?? v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium">Paciente / Cédula</th>
                <th className="px-4 py-3 text-left font-medium">Diagnóstico</th>
                <th className="px-4 py-3 text-left font-medium">Plan</th>
                <th className="px-4 py-3 text-left font-medium">Tipo servicio</th>
                <th className="px-4 py-3 text-left font-medium">Médico · Hospital</th>
                <th className="px-4 py-3 text-left font-medium">Urgencia</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtradas.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Sin órdenes que coincidan con los filtros</td></tr>
              ) : filtradas.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">—</p>
                    <p className="text-xs text-gray-400">{o.cedula}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">{o.diagnostico}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{o.planNombre}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{o.tipoServicio}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{o.medicoSolicitante}</p>
                    <p className="text-xs text-gray-400">{o.hospital}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${URGENCIA_COLORS[o.urgencia] ?? "bg-gray-100 text-gray-600"}`}>
                      {URGENCIA_LABELS[o.urgencia] ?? o.urgencia}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[o.estado] ?? "bg-gray-100 text-gray-600"}`}>
                      {ESTADO_LABELS[o.estado] ?? o.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{o.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
