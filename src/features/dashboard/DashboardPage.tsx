"use client";

import React, { useState, useEffect } from "react";
import { FileText, LucideIcon, Activity, CheckCircle, ShieldAlert, HelpCircle } from "lucide-react";
import { KPIPacientesActivos }  from "./components/KPIPacientesActivos";
import { AlertasPrioritarias }  from "./components/AlertasPrioritarias";
import { SolicitudesWidget }    from "./components/SolicitudesWidget";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type Alerta = { id: number; nombre: string; diagnostico: string; riesgo_pct: number; tendencia: string };
type Kpis   = { pacientes_activos: number; alertas_criticas: number; por_autorizar: number; ejecucion_pct: number };

const MiniKpi = ({ title, value, icon: Icon, color, bg, tooltip }: { title: string; value: string; icon: LucideIcon; color: string; bg: string; tooltip?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">{title}</p>
          {tooltip && (
            <div className="relative flex-shrink-0">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
              {show && <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl z-50 leading-relaxed pointer-events-none">{tooltip}<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" /></div>}
            </div>
          )}
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${bg}`}><Icon className={`h-4 w-4 ${color}`} /></div>
      </div>
      <div className="mt-4"><p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p></div>
    </div>
  );
};

function KpiSkeleton() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 animate-pulse">
      <div className="flex items-center justify-between"><div className="h-3 w-28 rounded bg-slate-200" /><div className="h-8 w-8 rounded-md bg-slate-200" /></div>
      <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
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

        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20">EPS Sura Operaciones</span>
              <span className="text-sm font-medium text-slate-500">Mayo 2026</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-slate-900">Consola OLGA HealthTech</h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado de Red</p>
            <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 justify-end"><Activity size={14} /> Sistema Nominal</p>
          </div>
        </header>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></>
          ) : (
            <>
              <KPIPacientesActivos value={kpis.pacientes_activos} />
              <MiniKpi title="Alertas críticas" value={String(kpis.alertas_criticas).padStart(2, "0")} icon={ShieldAlert} color="text-rose-600" bg="bg-rose-50" tooltip="Pacientes con visita no confirmada en 48h o signos vitales fuera de rango." />
              <MiniKpi title="Por autorizar" value={String(kpis.por_autorizar).padStart(2, "0")} icon={FileText} color="text-amber-600" bg="bg-amber-50" tooltip="Solicitudes de autorización pendientes de revisión." />
              <MiniKpi title="Ejecución mes" value={`${kpis.ejecucion_pct}%`} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" tooltip="Porcentaje de servicios programados ejecutados y verificados." />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AlertasPrioritarias alertas={alertas} loading={loading} />
          <SolicitudesWidget solicitudes={topSolicitudes} />
        </div>

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
