"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList, CheckCircle, XCircle, Users,
  ArrowRight, Loader2, AlertTriangle, Activity,
  Stethoscope,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface HospitalKpis {
  total_solicitudes: number;
  pendientes: number;
  autorizadas: number;
  rechazadas: number;
  tasa_autorizacion: number;
}

interface HospitalPacientes {
  total: number;
  alto_riesgo: number;
  baja_adherencia: number;
}

interface SolicitudReciente {
  id: number;
  cedula: string;
  diagnostico: string;
  complejidad: string;
  plan_nombre: string;
  medico_solicitante: string;
  hospital: string;
  costo_estimado: number;
  tipo_servicio: string;
  urgencia: string;
  estado: string;
  fecha: string;
}

interface HospitalDashboardData {
  kpis: HospitalKpis;
  pacientes: HospitalPacientes;
  solicitudes_recientes: SolicitudReciente[];
}

const COMPLEJIDAD_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  alta:  { label: "Alta",  color: "text-rose-700",   bg: "bg-rose-50"   },
  media: { label: "Media", color: "text-amber-700",  bg: "bg-amber-50"  },
  baja:  { label: "Baja",  color: "text-emerald-700",bg: "bg-emerald-50"},
};

const ESTADO_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pendiente:  { label: "Pendiente",   color: "text-slate-600",   bg: "bg-slate-100",  border: "border-slate-200"  },
  autorizado: { label: "Autorizado",  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  rechazado:  { label: "Rechazado",   color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200"   },
};

export default function HospitalDashboard() {
  const router = useRouter();
  const [data, setData] = useState<HospitalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/hospital/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No se pudieron cargar los datos del panel.
      </div>
    );
  }

  const total = data.kpis.total_solicitudes || 1;
  const hoy = new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-screen-2xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full uppercase tracking-widest">
              Hospital
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Panel del Hospital</h1>
          <p className="text-sm text-slate-400 mt-0.5 capitalize">{hoy}</p>
        </div>
        <p className="text-xs text-slate-400 self-start sm:self-auto max-w-xs text-right hidden sm:block">
          Seguimiento de solicitudes de autorización y pacientes dados de alta
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Solicitudes enviadas"
          value={data.kpis.total_solicitudes}
          sub={`${data.kpis.pendientes} pendientes`}
          subColor="text-amber-600"
          icon={ClipboardList}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          onClick={() => router.push("/autorizaciones")}
        />
        <KpiCard
          title="Tasa de autorización"
          value={`${data.kpis.tasa_autorizacion}%`}
          sub={`${data.kpis.autorizadas} autorizadas`}
          subColor="text-emerald-600"
          icon={CheckCircle}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          onClick={() => router.push("/autorizaciones")}
        />
        <KpiCard
          title="Solicitudes rechazadas"
          value={data.kpis.rechazadas}
          sub={data.kpis.rechazadas > 0 ? "requieren revisión" : "sin rechazos"}
          subColor={data.kpis.rechazadas > 0 ? "text-rose-600" : "text-slate-400"}
          icon={XCircle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => router.push("/autorizaciones")}
          alert={data.kpis.rechazadas > 0}
        />
        <KpiCard
          title="Pacientes en seguimiento"
          value={data.pacientes.total}
          sub={`${data.pacientes.alto_riesgo} alto riesgo`}
          subColor={data.pacientes.alto_riesgo > 0 ? "text-rose-600" : "text-slate-400"}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          onClick={() => router.push("/pacientes")}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tabla solicitudes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Últimas solicitudes</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {data.solicitudes_recientes.length}
              </span>
            </div>
          </div>

          {data.solicitudes_recientes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-16 text-slate-400 text-sm">
              No hay solicitudes registradas aún.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-5 py-3">Paciente</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3 hidden md:table-cell">Diagnóstico</th>
                      <th className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">Complejidad</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3 hidden lg:table-cell">Médico</th>
                      <th className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3 hidden lg:table-cell">Costo</th>
                      <th className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.solicitudes_recientes.map((s) => {
                      const comp = COMPLEJIDAD_CONFIG[s.complejidad] ?? COMPLEJIDAD_CONFIG.media;
                      const est = ESTADO_CONFIG[s.estado] ?? ESTADO_CONFIG.pendiente;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900 text-sm leading-tight">{s.plan_nombre}</p>
                            <p className="text-[11px] text-slate-400">CC {s.cedula} · {s.fecha}</p>
                          </td>
                          <td className="px-3 py-4 hidden md:table-cell">
                            <p className="text-xs text-slate-700 truncate max-w-[180px]">{s.diagnostico}</p>
                            <p className="text-[10px] text-slate-400">{s.tipo_servicio}</p>
                          </td>
                          <td className="px-3 py-4 text-center">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${comp.bg} ${comp.color}`}>
                              {comp.label}
                            </span>
                          </td>
                          <td className="px-3 py-4 hidden lg:table-cell">
                            <p className="text-xs text-slate-600 truncate max-w-[140px]">{s.medico_solicitante}</p>
                          </td>
                          <td className="px-3 py-4 text-right hidden lg:table-cell">
                            <p className="text-xs font-semibold text-slate-700">
                              ${s.costo_estimado.toLocaleString("es-CO")}
                            </p>
                          </td>
                          <td className="px-3 py-4 text-center">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${est.bg} ${est.color} ${est.border}`}>
                              {est.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => router.push("/autorizaciones")}
                  className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
                >
                  Ver todas las solicitudes
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Columna derecha */}
        <div className="space-y-5">

          {/* Pacientes en casa */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Pacientes en casa</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600">Total en seguimiento</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{data.pacientes.total}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-sm text-slate-600">Alto riesgo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {data.pacientes.alto_riesgo > 0 && (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span className={`text-lg font-bold ${data.pacientes.alto_riesgo > 0 ? "text-rose-600" : "text-slate-900"}`}>
                    {data.pacientes.alto_riesgo}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm text-slate-600">Baja adherencia</span>
                </div>
                <span className={`text-lg font-bold ${data.pacientes.baja_adherencia > 0 ? "text-amber-600" : "text-slate-900"}`}>
                  {data.pacientes.baja_adherencia}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push("/pacientes")}
              className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              Ver pacientes
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Desglose estado solicitudes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Estado de solicitudes</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Pendientes",  value: data.kpis.pendientes,  color: "bg-amber-400",  textColor: "text-amber-700" },
                { label: "Autorizadas", value: data.kpis.autorizadas, color: "bg-emerald-500", textColor: "text-emerald-700" },
                { label: "Rechazadas",  value: data.kpis.rechazadas,  color: "bg-rose-500",    textColor: "text-rose-700" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">{item.label}</span>
                    <span className={`text-xs font-bold ${item.textColor}`}>{item.value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${item.color}`}
                      style={{ width: `${Math.round((item.value / total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-slate-400 pt-1">Total: {data.kpis.total_solicitudes} solicitudes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title, value, sub, subColor, icon: Icon, iconColor, iconBg, onClick, alert,
}: {
  title: string;
  value: number | string;
  sub: string;
  subColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  onClick?: () => void;
  alert?: boolean;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`group bg-white rounded-xl ring-1 ${alert ? "ring-rose-200" : "ring-slate-200"} shadow-sm p-5 text-left w-full transition-all ${onClick ? "hover:shadow-md hover:ring-blue-200 cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        {onClick && (
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-tight leading-tight">{title}</p>
      {sub && <p className={`text-[11px] font-semibold mt-1 ${subColor}`}>{sub}</p>}
    </Wrapper>
  );
}
