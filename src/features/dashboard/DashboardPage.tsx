"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Users,
  FileText,
  ChevronRight,
  ArrowUpRight,
  LucideIcon,
  Activity,
  CheckCircle,
  ShieldAlert,
  Zap,
  HelpCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type Alerta = { id: number; nombre: string; diagnostico: string; riesgo_pct: number; tendencia: string };
type Kpis   = { pacientes_activos: number; alertas_criticas: number; por_autorizar: number; ejecucion_pct: number };

// --- COMPONENTS ---
const MiniKpi = ({ title, value, icon: Icon, color, bg, tooltip }: { title: string, value: string, icon: LucideIcon, color: string, bg: string, tooltip?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">{title}</p>
          {tooltip && (
            <div className="relative flex-shrink-0">
              <HelpCircle
                className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
              />
              {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl z-50 leading-relaxed pointer-events-none">
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-3xl font-semibold tracking-tight text-slate-900`}>{value}</p>
      </div>
    </div>
  );
};

function KpiSkeleton() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 rounded bg-slate-200" />
        <div className="h-8 w-8 rounded-md bg-slate-200" />
      </div>
      <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
    </div>
  );
}

function AlertaSkeleton() {
  return (
    <div className="flex items-center gap-5 p-4 rounded-r-xl rounded-l-sm border-l-4 border-l-slate-200 ring-1 ring-slate-200 bg-white animate-pulse">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-3 w-56 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function DashboardCompacto() {
  const [kpis, setKpis] = useState<Kpis>({ pacientes_activos: 0, alertas_criticas: 0, por_autorizar: 0, ejecucion_pct: 0 });
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [topSolicitudes, setTopSolicitudes] = useState<{ id: number; paciente: string; plan_nombre: string; urgencia: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
    Promise.all([
      fetch(`${API}/api/v1/eps/dashboard/kpis`, { headers }).then((r) => r.json()),
      fetch(`${API}/api/v1/eps/dashboard/alertas`, { headers }).then((r) => r.json()),
      fetch(`${API}/api/v1/eps/solicitudes?per_page=4`, { headers }).then((r) => r.json()),
    ])
      .then(([k, a, s]) => {
        setKpis(k);
        setAlertas(Array.isArray(a) ? a : (a?.data ?? []));
        setTopSolicitudes((s.data ?? []).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 antialiased">
      <main className="w-full max-w-[100vw] mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Header Institucional */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
                EPS Sura Operaciones
              </span>
              <span className="text-sm font-medium text-slate-500">Mayo 2026</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-slate-900">Consola OLGA HealthTech</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado de Red</p>
                <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 justify-end">
                   <Activity size={14} /> Sistema Nominal
                </p>
             </div>
          </div>
        </header>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton />
            </>
          ) : (
            <>
              <MiniKpi title="Pacientes activos" value={String(kpis.pacientes_activos)} icon={Users} color="text-indigo-600" bg="bg-indigo-50"
                tooltip="Total de afiliados con plan domiciliario autorizado y activo en la red de prestadores." />
              <MiniKpi title="Alertas críticas" value={String(kpis.alertas_criticas).padStart(2, "0")} icon={ShieldAlert} color="text-rose-600" bg="bg-rose-50"
                tooltip="Pacientes con visita no confirmada en 48h o signos vitales fuera de rango. Requieren intervención inmediata." />
              <MiniKpi title="Por autorizar" value={String(kpis.por_autorizar).padStart(2, "0")} icon={FileText} color="text-amber-600" bg="bg-amber-50"
                tooltip="Solicitudes de autorización pendientes de revisión. Incluye PHD, PAD, PARD y curaciones en casa." />
              <MiniKpi title="Ejecución mes" value={`${kpis.ejecucion_pct}%`} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50"
                tooltip="Porcentaje de servicios programados ejecutados y verificados con GPS + firma digital en el mes." />
            </>
          )}
        </div>

        {/* SECCIONES: 75% / 25% */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* COLUMNA ALERTAS (MODIFICADA PARA MÁS URGENCIA) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                Atención Prioritaria
              </h2>
              <div className="flex items-center gap-2">
                <span className="animate-pulse flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                  <Zap size={10} fill="currentColor" /> ACCIÓN REQUERIDA
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {loading ? (
                <><AlertaSkeleton /><AlertaSkeleton /><AlertaSkeleton /></>
              ) : alertas.map((alerta, idx) => {
                const isCritical = idx < 2 || alerta.tendencia === "deteriorando";
                return (
                  <Link
                    key={alerta.id}
                    href={`/pacientes/${alerta.id}`}
                    className={`group flex items-center justify-between p-4 transition-all duration-200 shadow-sm border-l-4 rounded-r-xl rounded-l-sm
                      ${isCritical
                        ? 'bg-rose-50/40 border-l-rose-600 hover:bg-rose-50 ring-1 ring-rose-200'
                        : 'bg-white border-l-amber-500 hover:bg-slate-50 ring-1 ring-slate-200'}`}
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                        ${isCritical ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500/10 text-amber-700'}`}>
                        <AlertTriangle className={isCritical ? "w-6 h-6" : "w-5 h-5"} />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <p className={`text-base font-bold ${isCritical ? 'text-rose-900' : 'text-slate-900'}`}>
                            {alerta.nombre}
                          </p>
                          {isCritical && (
                            <span className="text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded uppercase">Alta Prioridad</span>
                          )}
                        </div>
                        <p className={`text-sm font-medium ${isCritical ? 'text-rose-700/80' : 'text-slate-500'}`}>
                          {alerta.diagnostico} · Riesgo {alerta.riesgo_pct}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest
                        ${isCritical ? 'text-rose-600' : 'text-slate-400'}`}>Intervenir</span>
                      <ChevronRight className={`w-5 h-5 ${isCritical ? 'text-rose-400' : 'text-slate-300'} group-hover:translate-x-1 transition-all`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COLUMNA SOLICITUDES (1/4) - Preservada */}
          <div className="space-y-4">
            <div className="px-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Solicitudes</h2>
            </div>

            <div className="bg-white ring-1 ring-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full border-t-2 border-t-indigo-500">
              <div className="p-4 space-y-3 flex-1">
                {topSolicitudes.map((s) => (
                  <div key={s.id} className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100 group hover:bg-white hover:border-indigo-200 transition-all cursor-default">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{s.paciente}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${s.urgencia === "urgente" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-white text-slate-400 border-slate-100"}`}>
                        {s.urgencia === "urgente" ? "Urgente" : "Programado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">{s.plan_nombre}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full py-3 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.1em]">
                  Autorizar Lote <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Minimalista */}
        <footer className="pt-8 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 OLGA Healthtech · Infraestructura Sura</p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 tracking-widest">
            <button className="hover:text-indigo-600 transition-colors uppercase">Consola de Red</button>
            <button className="hover:text-indigo-600 transition-colors uppercase">Protocolos de Seguridad</button>
          </div>
        </footer>
      </main>
    </div>
  );
}