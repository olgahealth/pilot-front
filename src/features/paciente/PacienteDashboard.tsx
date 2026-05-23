"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, ClipboardList, Heart, LogOut, AlertTriangle,
  CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type Paciente = {
  nombre: string; cedula: string; diagnostico: string; dias_post_alta: number;
  riesgo: string; riesgo_pct: number; adherencia: number; tendencia: string;
  medico: string; eps: string;
};
type Vital = {
  fecha: string; pa_sistolica: number | null; pa_diastolica: number | null;
  fc: number | null; spo2: number | null;
};
type Visita = {
  id: number; fecha: string; servicio: string;
  profesional: string; entidad: string | null; estado: string;
};
type Solicitud = {
  plan_nombre: string; tipo_servicio: string; estado: string;
  fecha: string; complejidad: string;
} | null;
type DashboardData = { paciente: Paciente; vitales: Vital[]; timeline: Visita[]; solicitud: Solicitud };

const ESTADO_VISITA: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  cumplido:    { label: "Cumplida",    color: "text-emerald-700", bg: "bg-emerald-50",  icon: CheckCircle },
  pendiente:   { label: "Pendiente",   color: "text-amber-700",   bg: "bg-amber-50",    icon: Clock       },
  no_cumplido: { label: "No cumplida", color: "text-rose-700",    bg: "bg-rose-50",     icon: XCircle     },
};

const ESTADO_SOL: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pendiente:  { label: "Pendiente de revisión", color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"  },
  autorizado: { label: "Autorizado",            color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  rechazado:  { label: "Rechazado",             color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200"   },
};

export default function PacienteDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/paciente/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSalir = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">No se pudo cargar la información.</p>
      </div>
    );
  }

  const { paciente: p, vitales, timeline, solicitud } = data;
  const proximas = timeline.filter((v) => v.estado === "pendiente");
  const historial = timeline.filter((v) => v.estado !== "pendiente");
  const ultimoVital = vitales[0] ?? null;

  const riesgoColor =
    p.riesgo === "alto"  ? "bg-rose-100 text-rose-700 border-rose-200" :
    p.riesgo === "medio" ? "bg-amber-100 text-amber-700 border-amber-200" :
                           "bg-emerald-100 text-emerald-700 border-emerald-200";

  const TendIcon = p.tendencia === "deteriorando" ? TrendingDown : p.tendencia === "mejorando" ? TrendingUp : Minus;
  const tendColor = p.tendencia === "deteriorando" ? "text-rose-500" : p.tendencia === "mejorando" ? "text-emerald-500" : "text-slate-400";

  return (
    <div className="min-h-screen bg-emerald-50/60 font-sans antialiased">

      {/* Header */}
      <header className="bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-xl tracking-tight text-slate-900" style={{ letterSpacing: "-1px" }}>olga</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            Paciente
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 hidden sm:block">{user?.name ?? p.nombre}</span>
          <button
            onClick={handleSalir}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <h1 className="text-2xl font-bold text-slate-900">
          Hola, {p.nombre.split(" ")[0]} 👋
        </h1>

        {/* Fila 1: Info paciente + Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Info del paciente */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Mi estado de salud</h2>
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">{p.diagnostico}</p>
              <p className="text-xs text-slate-500 mt-0.5">{p.dias_post_alta} días post-alta · {p.medico}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${riesgoColor}`}>
                Riesgo {p.riesgo}
              </span>
              <span className={`flex items-center gap-1 text-xs font-semibold ${tendColor}`}>
                <TendIcon className="w-3.5 h-3.5" />
                {p.tendencia}
              </span>
            </div>
            {/* Barra adherencia */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Adherencia al tratamiento</span>
                <span className="font-bold text-slate-700">{p.adherencia}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all ${p.adherencia >= 80 ? "bg-emerald-500" : p.adherencia >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${p.adherencia}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">{p.eps} · Cédula {p.cedula}</p>
          </div>

          {/* Plan de atención */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Mi plan de atención</h2>
            </div>
            {!solicitud ? (
              <p className="text-sm text-slate-400">No hay un plan de atención activo.</p>
            ) : (() => {
              const est = ESTADO_SOL[solicitud.estado] ?? ESTADO_SOL.pendiente;
              return (
                <>
                  <p className="text-base font-semibold text-slate-900">{solicitud.plan_nombre}</p>
                  <p className="text-xs text-slate-500">{solicitud.tipo_servicio}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${est.bg} ${est.color} ${est.border}`}>
                      {est.label}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
                      {solicitud.complejidad}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Solicitado el {solicitud.fecha}</p>
                </>
              );
            })()}
          </div>
        </div>

        {/* Vitales */}
        {ultimoVital && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Últimos signos vitales</h2>
              <span className="ml-auto text-[10px] text-slate-400">{ultimoVital.fecha}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Presión arterial</p>
                <p className="text-xl font-bold text-rose-900">
                  {ultimoVital.pa_sistolica ?? "—"}/{ultimoVital.pa_diastolica ?? "—"}
                </p>
                <p className="text-[10px] text-rose-400 mt-0.5">mmHg</p>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-xl border border-pink-100">
                <p className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mb-1">Frecuencia cardíaca</p>
                <p className="text-xl font-bold text-pink-900">{ultimoVital.fc ?? "—"}</p>
                <p className="text-[10px] text-pink-400 mt-0.5">bpm</p>
              </div>
              <div className="text-center p-3 bg-sky-50 rounded-xl border border-sky-100">
                <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">Saturación O₂</p>
                <p className="text-xl font-bold text-sky-900">{ultimoVital.spo2 ?? "—"}%</p>
                <p className="text-[10px] text-sky-400 mt-0.5">SpO₂</p>
              </div>
            </div>
            {vitales.length > 1 && (
              <p className="text-[10px] text-slate-400 mt-3 text-center">
                Medición anterior: {vitales[1].fecha} · TA {vitales[1].pa_sistolica}/{vitales[1].pa_diastolica} · FC {vitales[1].fc}
              </p>
            )}
          </div>
        )}

        {/* Visitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Próximas */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest px-1">
              Próximas visitas ({proximas.length})
            </h2>
            {proximas.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center text-slate-400 text-sm">
                No hay visitas programadas
              </div>
            ) : proximas.map((v) => {
              const cfg = ESTADO_VISITA.pendiente;
              const Icon = cfg.icon;
              return (
                <div key={v.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4 flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{v.servicio}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{v.fecha}</p>
                    <p className="text-xs text-slate-400">{v.profesional}{v.entidad ? ` · ${v.entidad}` : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Historial */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
              Historial ({historial.length})
            </h2>
            {historial.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center text-slate-400 text-sm">
                Sin historial aún
              </div>
            ) : historial.slice(0, 6).map((v) => {
              const cfg = ESTADO_VISITA[v.estado] ?? ESTADO_VISITA.pendiente;
              const Icon = cfg.icon;
              return (
                <div key={v.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-3">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{v.servicio}</p>
                      <span className={`flex-shrink-0 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{v.fecha}</p>
                    <p className="text-xs text-slate-400">{v.profesional}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-400 pt-4 pb-2">
          © 2026 OLGA Healthtech · {p.eps}
        </p>

      </main>
    </div>
  );
}
