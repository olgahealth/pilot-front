"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, XCircle, ArrowUpRight, MapPin } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type EstadoVisita = "cumplido" | "pendiente" | "no_cumplido";

interface Visita {
  id: number;
  fecha: string;
  servicio: string;
  profesional: string;
  entidad: string | null;
  estado: EstadoVisita;
  paciente: { nombre: string; cedula: string; diagnostico: string };
  evidencia: { id: number; estado: string; timestamp: string | null } | null;
}

const ESTADO = {
  cumplido:    { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Cumplido" },
  pendiente:   { icon: Clock,       color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Pendiente" },
  no_cumplido: { icon: XCircle,     color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200",    label: "No cumplido" },
};

const EV_ESTADO: Record<string, { label: string; color: string }> = {
  pendiente:          { label: "Sin evidencia",       color: "text-slate-400" },
  pendiente_revision: { label: "En revisión",         color: "text-amber-600" },
  verificado:         { label: "Verificado",           color: "text-emerald-600" },
  rechazado:          { label: "Rechazado",            color: "text-rose-600" },
};

export default function VisitasProveedorPage() {
  const router = useRouter();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/proveedor/visitas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setVisitas(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendientes = visitas.filter((v) => v.estado === "pendiente");
  const resto = visitas.filter((v) => v.estado !== "pendiente");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mis visitas</h1>
        <p className="text-sm text-slate-500 mt-1">
          {loading ? "Cargando..." : `${visitas.length} visitas asignadas`}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && pendientes.length > 0 && (
        <section>
          <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">
            Pendientes de evidencia ({pendientes.length})
          </h2>
          <div className="space-y-3">
            {pendientes.map((v) => <VisitaCard key={v.id} visita={v} router={router} />)}
          </div>
        </section>
      )}

      {!loading && resto.length > 0 && (
        <section>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            Historial
          </h2>
          <div className="space-y-3">
            {resto.map((v) => <VisitaCard key={v.id} visita={v} router={router} />)}
          </div>
        </section>
      )}

      {!loading && visitas.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No tenés visitas asignadas aún</p>
        </div>
      )}
    </div>
  );
}

function VisitaCard({ visita: v, router }: { visita: Visita; router: ReturnType<typeof useRouter> }) {
  const est = ESTADO[v.estado] ?? ESTADO.pendiente;
  const Icon = est.icon;
  const evEst = v.evidencia ? (EV_ESTADO[v.evidencia.estado] ?? EV_ESTADO.pendiente) : EV_ESTADO.pendiente;
  const puedeCargar = v.estado === "pendiente" || (v.evidencia?.estado === "rechazado");

  return (
    <div className={`bg-white rounded-2xl border ${est.border} shadow-sm p-5 flex items-center gap-4`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${est.bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${est.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-900 truncate">{v.paciente.nombre}</p>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${est.bg} ${est.color}`}>
            {est.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{v.servicio}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {v.fecha} · {v.entidad ?? "OLGA Servicios"}
        </p>
        {v.evidencia && (
          <p className={`text-[11px] font-semibold mt-1 ${evEst.color}`}>
            Evidencia: {evEst.label}
          </p>
        )}
      </div>

      {puedeCargar && (
        <button
          onClick={() => router.push(`/proveedor/evidencia/${v.id}`)}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Subir evidencia
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      )}

      {!puedeCargar && v.evidencia && (
        <button
          onClick={() => router.push(`/proveedor/evidencia/${v.id}`)}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
        >
          Ver evidencia
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
