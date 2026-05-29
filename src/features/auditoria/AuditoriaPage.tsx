"use client";

import { useState } from "react";
import { type Prestador, TOTAL_OPS, TOTAL_FALLOS } from "./data";
import { AuditoriaKPIs }     from "./components/AuditoriaKPIs";
import { LiquidacionTable }  from "./components/LiquidacionTable";
import { ScoringPanel }      from "./components/ScoringPanel";
import { CupsTable }         from "./components/CupsTable";
import { ReingresosChart }   from "./components/ReingresosChart";
import { IngresosModalidad } from "./components/IngresosModalidad";
import { ExportSection }     from "./components/ExportSection";
import { FalloModal }        from "./components/FalloModal";

export default function AuditoriaPage() {
  const [falloModal, setFalloModal] = useState<Prestador | null>(null);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-6 font-sans text-slate-900">
      <div className="space-y-8 max-w-[1200px] mx-auto">

        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20">EPS Sura</span>
              <span className="text-sm font-medium text-slate-500">Mayo 2026</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-slate-900">Auditoría Domiciliaria</h1>
            <p className="text-sm text-slate-500 mt-1">{TOTAL_OPS} operaciones auditadas · {TOTAL_FALLOS} con fallo registrado · Conciliación financiera activa.</p>
          </div>
        </header>

        <AuditoriaKPIs />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LiquidacionTable onVerDetalle={setFalloModal} />
          <ScoringPanel />
        </div>

        <CupsTable />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReingresosChart />
          <IngresosModalidad />
        </div>

        <ExportSection />

      </div>

      {falloModal && <FalloModal prestador={falloModal} onClose={() => setFalloModal(null)} />}
    </div>
  );
}
