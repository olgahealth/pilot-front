"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck, FileSearch, ClipboardList, XCircle,
  ArrowRight, Loader2, Users, UserPlus, Clock, CheckCircle,
  AlertTriangle, ChevronRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface ProveedorActivo {
  id: number;
  nombre: string;
  email: string;
  cellphone: string | null;
  visitas_pendientes: number;
  visitas_cumplidas: number;
  evidencias_revision: number;
  ultima_actividad: string | null;
}

interface ActividadItem {
  paciente: string;
  profesional: string;
  servicio: string;
  estado: string;
  timestamp: string | null;
}

interface SolicitudUrgente {
  id: number;
  cedula: string;
  diagnostico: string;
  hospital: string;
  costo_estimado: number;
  fecha: string;
}

interface AdminDashboard {
  usuarios_por_rol: { role: string; count: number }[];
  visitas: { total: number; pendientes: number; cumplidas: number };
  evidencias: { total: number; pendiente: number; pendiente_revision: number; verificado: number; rechazado: number };
  solicitudes: { total: number; pendientes: number; autorizadas: number; rechazadas: number };
  proveedores_activos: ProveedorActivo[];
  actividad_reciente: ActividadItem[];
  solicitudes_urgentes: SolicitudUrgente[];
}

const ROL_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  proveedor:   { label: "Proveedores",  color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  eps:         { label: "EPS",          color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200" },
  hospital:    { label: "Hospital",     color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  paciente:    { label: "Pacientes",    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  admin_olga:  { label: "Admins",       color: "text-slate-700",   bg: "bg-slate-100",  border: "border-slate-200" },
};

const EV_ESTADO: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pendiente:          { label: "Sin evidencia",  color: "text-slate-600",  bg: "bg-slate-50",   border: "border-slate-200" },
  pendiente_revision: { label: "En revisión",    color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200" },
  verificado:         { label: "Verificado",     color: "text-emerald-700",bg: "bg-emerald-50", border: "border-emerald-200" },
  rechazado:          { label: "Rechazado",      color: "text-rose-700",   bg: "bg-rose-50",    border: "border-rose-200" },
};

function relativeTime(iso: string | null): string {
  if (!iso) return "Sin actividad";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora mismo";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Hace ${days}d`;
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function initials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const PAGE_SIZE = 10;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/admin/dashboard`, {
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
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No se pudieron cargar los datos del dashboard.
      </div>
    );
  }

  const proveedoresPag = data.proveedores_activos.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(data.proveedores_activos.length / PAGE_SIZE);

  const hoy = new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-screen-2xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold bg-slate-900 text-white px-2.5 py-1 rounded-full uppercase tracking-widest">
              OLGA Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Sala de control</h1>
          <p className="text-sm text-slate-400 mt-0.5 capitalize">{hoy}</p>
        </div>
        <button
          onClick={() => router.push("/admin/usuarios")}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Agregar profesional
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Visitas totales"
          value={data.visitas.total}
          sub={`${data.visitas.pendientes} pendientes`}
          subColor="text-amber-600"
          icon={CalendarCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Evidencias en revisión"
          value={data.evidencias.pendiente_revision}
          sub={`de ${data.evidencias.total} totales`}
          subColor="text-slate-400"
          icon={FileSearch}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          onClick={() => router.push("/auditoria")}
        />
        <KpiCard
          title="Solicitudes pendientes"
          value={data.solicitudes.pendientes}
          sub={`de ${data.solicitudes.total} totales`}
          subColor="text-slate-400"
          icon={ClipboardList}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          onClick={() => router.push("/autorizaciones")}
        />
        <KpiCard
          title="Evidencias rechazadas"
          value={data.evidencias.rechazado}
          sub="requieren atención"
          subColor={data.evidencias.rechazado > 0 ? "text-rose-600" : "text-slate-400"}
          icon={XCircle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => router.push("/auditoria")}
          alert={data.evidencias.rechazado > 0}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tabla proveedores */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Profesionales activos</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {data.proveedores_activos.length}
              </span>
            </div>
            <button
              onClick={() => router.push("/admin/usuarios")}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Agregar
            </button>
          </div>

          {data.proveedores_activos.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-16 text-slate-400 text-sm">
              No hay profesionales registrados aún.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-5 py-3">Profesional</th>
                      <th className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">Pendientes</th>
                      <th className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">Cumplidas</th>
                      <th className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">En revisión</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">Última actividad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {proveedoresPag.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {initials(p.nombre)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm leading-tight">{p.nombre}</p>
                              <p className="text-[11px] text-slate-400">{p.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-center">
                          {p.visitas_pendientes > 0 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                              {p.visitas_pendientes}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-center">
                          <span className="text-sm font-semibold text-emerald-600">{p.visitas_cumplidas}</span>
                        </td>
                        <td className="px-3 py-4 text-center">
                          {p.evidencias_revision > 0 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                              {p.evidencias_revision}
                            </span>
                          ) : (
                            <CheckCircle className="w-4 h-4 text-slate-200 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-300 flex-shrink-0" />
                            <span className="text-[11px] text-slate-500">{relativeTime(p.ultima_actividad)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, data.proveedores_activos.length)} de {data.proveedores_activos.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-3 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="px-3 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Columna derecha */}
        <div className="space-y-5">

          {/* Actividad reciente */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">Actividad reciente</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {data.actividad_reciente.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Sin actividad registrada</p>
              ) : (
                data.actividad_reciente.map((item, i) => {
                  const est = EV_ESTADO[item.estado] ?? EV_ESTADO.pendiente;
                  return (
                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {initials(item.profesional)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 truncate">{item.profesional}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${est.color} ${est.bg} ${est.border}`}>
                            {est.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{item.paciente} · {item.servicio}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{relativeTime(item.timestamp)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Solicitudes urgentes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/40 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900">Solicitudes urgentes</h2>
              {data.solicitudes_urgentes.length > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded-full">
                  {data.solicitudes_urgentes.length}
                </span>
              )}
            </div>
            <div className="divide-y divide-slate-50">
              {data.solicitudes_urgentes.length === 0 ? (
                <div className="flex items-center gap-2 px-5 py-5 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Sin solicitudes urgentes pendientes
                </div>
              ) : (
                data.solicitudes_urgentes.map((s) => (
                  <div key={s.id} className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{s.diagnostico}</p>
                        <p className="text-[11px] text-slate-500 truncate">{s.hospital} · CC {s.cedula}</p>
                        <p className="text-[11px] font-semibold text-rose-600 mt-0.5">
                          ${s.costo_estimado.toLocaleString("es-CO")} · {s.fecha}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {data.solicitudes_urgentes.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => router.push("/autorizaciones")}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Ver todas las solicitudes
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Distribución de roles */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Usuarios por rol</h2>
        <div className="flex flex-wrap gap-3">
          {data.usuarios_por_rol
            .sort((a, b) => b.count - a.count)
            .map((r) => {
              const cfg = ROL_CONFIG[r.role] ?? { label: r.role, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" };
              return (
                <button
                  key={r.role}
                  onClick={() => router.push(`/admin/usuarios?role=${r.role}`)}
                  className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${cfg.bg} ${cfg.border} hover:shadow-sm transition-all`}
                >
                  <span className={`text-lg font-bold ${cfg.color}`}>{r.count}</span>
                  <div className="text-left">
                    <p className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</p>
                  </div>
                  <ChevronRight className={`w-3 h-3 ${cfg.color} opacity-0 group-hover:opacity-100 transition-opacity ml-1`} />
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title, value, sub, subColor, icon: Icon, iconColor, iconBg, onClick, alert,
}: {
  title: string;
  value: number;
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
      className={`group bg-white rounded-xl ring-1 ${alert ? "ring-rose-200" : "ring-slate-200"} shadow-sm p-5 text-left w-full transition-all ${onClick ? "hover:shadow-md hover:ring-emerald-200 cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
        </div>
        {onClick && (
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-tight leading-tight">{title}</p>
      {sub && <p className={`text-[11px] font-semibold mt-1 ${subColor}`}>{sub}</p>}
    </Wrapper>
  );
}
