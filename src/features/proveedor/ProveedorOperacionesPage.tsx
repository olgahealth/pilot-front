"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Loader2, Users, XCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface Contador { agendados: number; en_curso: number; ejecutados: number; pendientes: number; no_realizados: number; }
interface Semaforo { verde: number; amarillo: number; gris: number; rojo: number; total: number; }
interface Profesional { id: number; nombre: string; visitas_hoy: number; cumplidas_hoy: number; pendientes_hoy: number; en_revision: number; }
interface Alerta { id: number; paciente: string; diagnostico: string; servicio: string; profesional: string; }
interface DashboardData { contadores: Contador; semaforo: Semaforo; profesionales: Profesional[]; alertas: Alerta[]; }

export default function ProveedorOperacionesPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/proveedor/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then(setData)
      .catch(() => setError("No se pudo cargar el centro de operaciones"))
      .finally(() => setLoading(false));
  }, []);

  const hoy = new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
  );
  if (error || !data) return (
    <div className="p-8 text-center text-rose-600">{error ?? "Error desconocido"}</div>
  );

  const { contadores, semaforo, profesionales, alertas } = data;
  const pct = (n: number) => semaforo.total > 0 ? Math.round((n / semaforo.total) * 100) : 0;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Centro de Operaciones</h1>
        <p className="text-sm text-gray-500 capitalize">{hoy}</p>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Agendados",     value: contadores.agendados,     color: "gray",    icon: Clock },
          { label: "En curso",      value: contadores.en_curso,      color: "amber",   icon: Clock },
          { label: "Ejecutados",    value: contadores.ejecutados,    color: "emerald", icon: CheckCircle },
          { label: "Pendientes",    value: contadores.pendientes,    color: "gray",    icon: Clock },
          { label: "No realizados", value: contadores.no_realizados, color: "rose",    icon: XCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className={`bg-white rounded-xl border p-4 ${color === "rose" ? "border-rose-200" : color === "emerald" ? "border-emerald-200" : color === "amber" ? "border-amber-200" : "border-gray-200"}`}>
            <div className={`flex items-center gap-2 mb-1 ${color === "rose" ? "text-rose-500" : color === "emerald" ? "text-emerald-500" : color === "amber" ? "text-amber-500" : "text-gray-400"}`}>
              <Icon className="w-4 h-4" />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
            <p className={`text-2xl font-bold ${color === "rose" ? "text-rose-600" : color === "emerald" ? "text-emerald-600" : color === "amber" ? "text-amber-600" : "text-gray-800"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Semáforo */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Semáforo de cumplimiento</h2>
        {semaforo.total === 0 ? (
          <p className="text-sm text-gray-400">No hay servicios programados para hoy.</p>
        ) : (
          <>
            <div className="flex h-5 rounded-full overflow-hidden gap-0.5 mb-3">
              {semaforo.verde   > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${pct(semaforo.verde)}%` }} />}
              {semaforo.amarillo > 0 && <div className="bg-amber-400 transition-all"  style={{ width: `${pct(semaforo.amarillo)}%` }} />}
              {semaforo.gris    > 0 && <div className="bg-gray-300 transition-all"    style={{ width: `${pct(semaforo.gris)}%` }} />}
              {semaforo.rojo    > 0 && <div className="bg-rose-500 transition-all"    style={{ width: `${pct(semaforo.rojo)}%` }} />}
            </div>
            <p className="text-sm text-gray-600">
              De <strong>{semaforo.total}</strong> servicios hoy:{" "}
              <span className="text-emerald-600 font-medium">{semaforo.verde} ejecutados</span> ·{" "}
              <span className="text-amber-600 font-medium">{semaforo.amarillo} en curso</span> ·{" "}
              <span className="text-gray-500 font-medium">{semaforo.gris} pendientes</span>
              {semaforo.rojo > 0 && <> · <span className="text-rose-600 font-medium">{semaforo.rojo} no realizados</span></>}
            </p>
          </>
        )}
      </div>

      {/* Tabla profesionales + alertas */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Profesionales */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700">Profesionales en campo (hoy)</h2>
          </div>
          {profesionales.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">Sin profesionales activos.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-5 py-2 text-left font-medium">Nombre</th>
                  <th className="px-3 py-2 text-center font-medium">Visitas</th>
                  <th className="px-3 py-2 text-center font-medium">Cumpl.</th>
                  <th className="px-3 py-2 text-center font-medium">Pend.</th>
                  <th className="px-3 py-2 text-center font-medium">Revisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {profesionales.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{p.nombre}</td>
                    <td className="px-3 py-3 text-center text-gray-600">{p.visitas_hoy}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-emerald-600 font-semibold">{p.cumplidas_hoy}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {p.pendientes_hoy > 0
                        ? <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">{p.pendientes_hoy}</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {p.en_revision > 0
                        ? <span className="bg-rose-100 text-rose-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">{p.en_revision}</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-gray-700">Servicios sin ejecutar hoy</h2>
          </div>
          {alertas.length === 0 ? (
            <div className="p-5 flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Sin alertas. ¡Todos los servicios en curso!</span>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {alertas.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-gray-900">{a.paciente}</p>
                  <p className="text-xs text-gray-500">{a.servicio} · {a.profesional}</p>
                  <p className="text-xs text-gray-400">{a.diagnostico}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
