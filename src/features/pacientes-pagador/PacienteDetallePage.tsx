"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertTriangle, Phone, Circle, Download } from "lucide-react";
import { api } from "@/lib/api";
import { type PatientDetail } from "./types";
import { PlanCard }           from "./components/PlanCard";
import { ClinicalOrderCard }  from "./components/ClinicalOrderCard";
import { ClinicalHistoryCard }from "./components/ClinicalHistoryCard";
import { VisitTimeline }      from "./components/VisitTimeline";
import { VitalsChart }        from "./components/VitalsChart";
import { ModifyPlanModal }    from "./components/ModifyPlanModal";
import { ReferralModal }      from "./components/ReferralModal";

type ModalType = "modificar" | "derivar" | null;

export default function PacienteDetallePage({ id }: { id: number }) {
  const router = useRouter();
  const [data, setData]       = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [modal, setModal]     = useState<ModalType>(null);
  const [accionHecha, setAccionHecha] = useState<string | null>(null);

  useEffect(() => {
    api.get<PatientDetail>(`/api/v1/eps/pacientes/${id}`)
      .then(setData)
      .catch(() => setError("No se pudo cargar el paciente"))
      .finally(() => setLoading(false));
  }, [id]);

  function exportarExcel() {
    if (!data) return;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{
      Nombre: data.nombre, Cédula: data.cedula, Diagnóstico: data.diagnostico,
      Riesgo: data.riesgo, "Riesgo %": data.riesgo_pct, "Adherencia %": data.adherencia,
      Tendencia: data.tendencia, Médico: data.medico, EPS: data.eps,
      "Días post-alta": data.dias_post_alta, Plan: data.plan?.nombre ?? "Sin plan",
      "Plan descripción": data.plan?.descripcion ?? "", "Costo estimado": data.plan?.costo_estimado ?? "",
      "Médico solicitante": data.plan?.medico_solicitante ?? "", Hospital: data.plan?.hospital ?? "",
    }]), "Paciente");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      data.timeline.length ? data.timeline.map(t => ({ Fecha: t.fecha, Servicio: t.servicio, Profesional: t.profesional, Entidad: t.entidad ?? "", Estado: t.estado, Nota: t.nota ?? "" }))
      : [{ Fecha: "Sin visitas" }]
    ), "Visitas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      data.vitales.length ? data.vitales.map(v => ({ Fecha: v.fecha, "PA Sistólica": v.pa_sistolica ?? "", "PA Diastólica": v.pa_diastolica ?? "", "FC (lpm)": v.fc ?? "", "SpO2 (%)": v.spo2 ?? "", "Glucemia (mg/dL)": v.glucemia ?? "" }))
      : [{ Fecha: "Sin registros" }]
    ), "Signos Vitales");
    XLSX.writeFile(wb, `historia_clinica_${data.cedula.replace(/\./g, "")}.xlsx`);
  }

  function handleAccion(msg: string) {
    setAccionHecha(msg);
    setModal(null);
    setTimeout(() => setAccionHecha(null), 3000);
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !data) return (
    <div className="p-8 text-center text-gray-500">
      <p className="text-sm">{error ?? "Paciente no encontrado"}</p>
      <button onClick={() => router.back()} className="mt-4 text-emerald-600 text-sm font-semibold hover:underline">← Volver</button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto pb-24">

      {/* Toast */}
      <AnimatePresence>
        {accionHecha && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg">
            <CheckCircle className="w-4 h-4" />{accionHecha}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => router.push("/pacientes")} className="mt-1 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{data.nombre}</h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-wider">Plan Autorizado</span>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${data.riesgo === "alto" ? "bg-red-50 text-red-700 border-red-200" : data.riesgo === "medio" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
              <Circle className={`w-2 h-2 fill-current ${data.riesgo === "alto" ? "text-red-600" : data.riesgo === "medio" ? "text-amber-500" : "text-blue-500"}`} />
              Riesgo {data.riesgo}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1 font-medium">{data.diagnostico} · Día {data.dias_post_alta} · {data.eps}</p>
        </div>
      </div>

      {/* Alertas */}
      {data.riesgo === "alto" && (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="text-amber-600 h-4 w-4 shrink-0" />
            <span className="text-sm text-amber-800"><strong>Alerta polifarmacia:</strong> Revisar interacciones medicamentosas. Paciente con múltiples comorbilidades activas.</span>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">Alerta de sistema</h3>
              <p className="text-sm text-red-800 mt-0.5 font-medium">Adherencia crítica ({data.adherencia}%) — Revisar plan de visitas asignado.</p>
            </div>
          </div>
        </>
      )}

      {/* 3 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <PlanCard plan={data.plan} diasPostAlta={data.dias_post_alta} adherencia={data.adherencia} />
        <ClinicalOrderCard plan={data.plan} />
        <ClinicalHistoryCard diagnostico={data.diagnostico} riesgo={data.riesgo} tendencia={data.tendencia} medico={data.medico} eps={data.eps} />
      </div>

      {/* Timeline + Vitales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitTimeline timeline={data.timeline} />
        <VitalsChart vitales={data.vitales} adherencia={data.adherencia} diagnostico={data.diagnostico} />
      </div>

      {/* Botones fijos */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => handleAccion("Llamada al prestador iniciada...")}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              <Phone className="w-4 h-4" /> Contactar prestador
            </button>
            <button onClick={exportarExcel}
              className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Exportar Excel
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setModal("modificar")} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">Modificar plan</button>
            <button onClick={() => setModal("derivar")} className="px-8 py-3 bg-red-50 text-red-700 border border-red-200 font-bold rounded-xl hover:bg-red-100 transition-colors shadow-sm">Derivar a urgencias</button>
          </div>
        </div>
      </div>

      <ModifyPlanModal isOpen={modal === "modificar"} paciente={data.nombre} onConfirm={() => handleAccion("Plan actualizado")} onClose={() => setModal(null)} />
      <ReferralModal   isOpen={modal === "derivar"}    nombre={data.nombre} diagnostico={data.diagnostico} onConfirm={() => handleAccion("Ambulancia despachada")} onClose={() => setModal(null)} />
    </div>
  );
}
