// src/features/pacientes-pagador/PacienteDetallePage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle, Clock, XCircle,
  AlertTriangle, Phone,
  MapPin, PenLine, AlertCircle, Circle,
  ClipboardList, HeartPulse, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "@/components/ConfirmModal";
import { api } from "@/lib/api";

// ── tipos ────────────────────────────────────────────────
type Riesgo    = "alto" | "medio" | "bajo";
type Tendencia = "mejorando" | "estable" | "deteriorando";
type Estado    = "cumplido" | "pendiente" | "no_cumplido";
type ModalType = "modificar" | "derivar" | null;

interface Plan {
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  medico_solicitante: string;
  hospital: string;
  costo_estimado: number;
  urgencia: string;
  estado_solicitud: string;
  fecha_solicitud: string;
  cie_codigo?: string | null;
  cie_version?: string | null;
}

interface TimelineItem {
  id: number;
  fecha: string;
  servicio: string;
  profesional: string;
  entidad: string;
  estado: Estado;
  nota?: string | null;
}

interface VitalItem {
  fecha: string;
  pa_sistolica: number | null;
  pa_diastolica: number | null;
  fc: number | null;
  spo2?: number | null;
  glucemia?: number | null;
}

interface PatientDetail {
  id: number;
  nombre: string;
  cedula: string;
  diagnostico: string;
  dias_post_alta: number;
  riesgo: Riesgo;
  riesgo_pct: number;
  adherencia: number;
  tendencia: Tendencia;
  eps: string;
  medico: string;
  address: string;
  phone: string;
  timeline: TimelineItem[];
  vitales: VitalItem[];
  plan: Plan | null;
}

// ── constantes de UI ────────────────────────────────────
const PLAN_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  PHD:                { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200"  },
  PAD:                { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"    },
  PARD:               { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200"  },
  "Curaciones en Casa":{ bg: "bg-rose-50",   text: "text-rose-700",    border: "border-rose-200"    },
};

const ESTADO_SOL_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  aprobado:             { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Aprobado"            },
  aprobado_condiciones: { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500",   label: "Aprobado con cond." },
  pendiente:            { bg: "bg-gray-100",     text: "text-gray-600",    dot: "bg-gray-400",    label: "Pendiente"          },
  negado:               { bg: "bg-red-100",      text: "text-red-700",     dot: "bg-red-500",     label: "Negado"             },
};

const TENDENCIA_ICON = {
  mejorando:    { Icon: TrendingUp,   color: "text-emerald-600", label: "Mejorando" },
  estable:      { Icon: Minus,        color: "text-gray-500",    label: "Estable"   },
  deteriorando: { Icon: TrendingDown, color: "text-red-600",     label: "Deteriorando" },
};

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

const ESTADO_ICON = {
  cumplido:    { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", line: "bg-emerald-500" },
  pendiente:   { icon: Clock,       color: "text-gray-400",    bg: "bg-gray-100",    line: "bg-gray-300"   },
  no_cumplido: { icon: XCircle,     color: "text-red-600",     bg: "bg-red-100",     line: "bg-red-400"    },
};

// ── componente ───────────────────────────────────────────
export default function PacienteDetallePage({ id }: { id: number }) {
  const router = useRouter();
  const [data, setData]       = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [modal, setModal]     = useState<ModalType>(null);
  const [derivarNota, setDerivarNota] = useState("");
  const [accionHecha, setAccionHecha] = useState<string | null>(null);

  useEffect(() => {
    api.get<PatientDetail>(`/api/v1/eps/pacientes/${id}`)
      .then(setData)
      .catch(() => setError("No se pudo cargar el paciente"))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAccion(tipo: string) {
    setAccionHecha(tipo);
    setModal(null);
    setTimeout(() => setAccionHecha(null), 3000);
  }

  // ── estados de carga ────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="p-8 text-center text-gray-500">
      <p className="text-sm">{error ?? "Paciente no encontrado"}</p>
      <button onClick={() => router.back()}
        className="mt-4 text-emerald-600 text-sm font-semibold hover:underline">
        ← Volver
      </button>
    </div>
  );

  const tieneDiabetes = data.diagnostico.toLowerCase().includes("diabet");
  const tieneEPOC     = data.diagnostico.toLowerCase().includes("epoc");

  // ── render (igual que antes, solo cambia la fuente de datos) ──
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto pb-24">

      {/* Toast */}
      <AnimatePresence>
        {accionHecha && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg"
          >
            <CheckCircle className="w-4 h-4" />
            {accionHecha}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => router.push("/pacientes")}
          className="mt-1 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{data.nombre}</h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-wider">
              Plan Autorizado
            </span>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${
              data.riesgo === "alto"  ? "bg-red-50 text-red-700 border-red-200" :
              data.riesgo === "medio" ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              <Circle className={`w-2 h-2 fill-current ${
                data.riesgo === "alto"  ? "text-red-600" :
                data.riesgo === "medio" ? "text-amber-500" : "text-blue-500"
              }`} />
              Riesgo {data.riesgo}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            {data.diagnostico} · Día {data.dias_post_alta} · {data.eps}
          </p>
          {(() => {
            const CIE10: Record<string, string> = { icc: "I50.0", epoc: "J44.1", diabetes: "E11.9", acv: "I63.9", irc: "N18.5", cáncer: "C80.1", cancer: "C80.1", hipertens: "I10", fractura: "S72.0", cirrosis: "K74.6" };
            const key = Object.keys(CIE10).find(k => data.diagnostico.toLowerCase().includes(k));
            return key ? <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">CIE-10: {CIE10[key]}</span> : null;
          })()}
        </div>
      </div>

      {/* Alerta polifarmacia */}
      {data.riesgo === "alto" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle className="text-amber-600 h-4 w-4 shrink-0" />
          <span className="text-sm text-amber-800">
            <strong>Alerta polifarmacia:</strong> Revisar interacciones medicamentosas. Paciente con múltiples comorbilidades activas.
          </span>
        </div>
      )}

      {/* Alerta riesgo alto */}
      {data.riesgo === "alto" && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">Alerta de sistema</h3>
            <p className="text-sm text-red-800 mt-0.5 font-medium">
              Adherencia crítica ({data.adherencia}%) — Revisar plan de visitas asignado.
            </p>
          </div>
        </div>
      )}

      {/* ── 3 cards: Plan · Orden · Historia clínica ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Card A · Plan de Atención (2/5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          {data.plan ? (
            <>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-2.5 py-1 rounded-md border uppercase tracking-wider ${
                  (PLAN_STYLES[data.plan.nombre] ?? PLAN_STYLES["PARD"]).bg
                } ${(PLAN_STYLES[data.plan.nombre] ?? PLAN_STYLES["PARD"]).text
                } ${(PLAN_STYLES[data.plan.nombre] ?? PLAN_STYLES["PARD"]).border}`}>
                  {data.plan.nombre}
                </span>
                <h2 className="text-sm font-bold text-gray-900">Plan de Atención</h2>
              </div>

              {/* Día + barra de progreso */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-600">Día {data.dias_post_alta} de tratamiento</span>
                  <span className={`text-xs font-bold ${
                    data.adherencia >= 90 ? "text-emerald-600" :
                    data.adherencia >= 70 ? "text-amber-600" : "text-red-600"
                  }`}>{data.adherencia}% adherencia</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      data.adherencia >= 90 ? "bg-emerald-500" :
                      data.adherencia >= 70 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${data.adherencia}%` }}
                  />
                </div>
              </div>

              {/* Descripción del plan */}
              <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-3">
                {data.plan.descripcion}
              </p>

              {/* Médico + hospital */}
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <span>{data.plan.medico_solicitante}</span>
                <span className="text-gray-200">·</span>
                <span>{data.plan.hospital}</span>
              </div>

              {/* Urgencia + costo */}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  data.plan.urgencia === "urgente"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {data.plan.urgencia === "urgente" ? "Urgente" : "Programado"}
                </span>
                <span className="text-xs font-bold text-gray-700">{formatCOP(data.plan.costo_estimado)}<span className="text-[10px] font-normal text-gray-400">/mes</span></span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-300">
              <ClipboardList className="w-8 h-8 mb-2" />
              <p className="text-xs font-medium">Sin plan registrado</p>
            </div>
          )}
        </div>

        {/* Card B · Orden Clínica (1.5/5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">Orden Clínica</h2>
          </div>
          {data.plan ? (
            <>
              <div className="space-y-2.5">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipo de servicio</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{data.plan.tipo_servicio}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      (ESTADO_SOL_STYLES[data.plan.estado_solicitud] ?? ESTADO_SOL_STYLES["pendiente"]).bg
                    } ${(ESTADO_SOL_STYLES[data.plan.estado_solicitud] ?? ESTADO_SOL_STYLES["pendiente"]).text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${(ESTADO_SOL_STYLES[data.plan.estado_solicitud] ?? ESTADO_SOL_STYLES["pendiente"]).dot}`} />
                      {(ESTADO_SOL_STYLES[data.plan.estado_solicitud] ?? ESTADO_SOL_STYLES["pendiente"]).label}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fecha solicitud</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{data.plan.fecha_solicitud}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valor facturable</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{formatCOP(data.plan.costo_estimado)}<span className="text-[10px] font-normal text-gray-400"> / mes</span></p>
                </div>
                {data.plan.cie_codigo && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Clasificación</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {data.plan.cie_version ?? "CIE-10"} {data.plan.cie_codigo}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-300">
              <ClipboardList className="w-8 h-8 mb-2" />
              <p className="text-xs font-medium">Sin orden registrada</p>
            </div>
          )}
        </div>

        {/* Card C · Historia Clínica (1.5/5) */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">Historia Clínica</h2>
          </div>

          {/* Dx principal */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dx principal</p>
            <p className="text-xs font-semibold text-gray-800 mt-0.5 leading-snug">{data.diagnostico}</p>
          </div>

          {/* Condiciones activas */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Condiciones activas</p>
            <div className="space-y-1">
              {[
                { label: "Cardiopatía",   key: /cardia|cardio|icc|insuficiencia card/i },
                { label: "Diabetes",      key: /diabet/i },
                { label: "EPOC",          key: /epoc/i },
                { label: "HTA",           key: /hipertens|hta/i },
                { label: "Oncológico",    key: /cáncer|cancer|oncol|quimio/i },
                { label: "Renal",         key: /renal|nefro|riñón/i },
                { label: "Neurológico",   key: /acv|neurolog|parkins|dement/i },
                { label: "Post-quirúrgico",key: /post.quirúrgico|post.operat|prótesis|fractura/i },
              ]
                .filter(c => c.key.test(data.diagnostico))
                .map(c => (
                  <div key={c.label} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {c.label}
                  </div>
                ))}
              {data.riesgo === "alto" && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  Polifarmacia probable
                </div>
              )}
            </div>
          </div>

          {/* Tendencia */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tendencia</p>
            {(() => {
              const t = TENDENCIA_ICON[data.tendencia] ?? TENDENCIA_ICON["estable"];
              return (
                <div className={`flex items-center gap-1 mt-0.5 text-xs font-bold ${t.color}`}>
                  <t.Icon className="w-3.5 h-3.5" /> {t.label}
                </div>
              );
            })()}
          </div>

          {/* Médico + EPS */}
          <div className="pt-2 border-t border-gray-100 space-y-0.5">
            <p className="text-[11px] text-gray-500"><span className="font-semibold text-gray-700">{data.medico}</span></p>
            <p className="text-[11px] text-gray-400">{data.eps}</p>
          </div>
        </div>
      </div>

      {/* Timeline + Vitales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Ejecución cronológica</h2>
            <p className="text-xs text-gray-500 mt-0.5">{data.timeline.length} visitas registradas</p>
          </div>
          <div className="p-5 flex-1 overflow-y-auto max-h-[400px] relative">
            {data.timeline.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Sin visitas registradas aún</p>
            ) : data.timeline.map((item, idx) => {
              const s      = ESTADO_ICON[item.estado];
              const Icon   = s.icon;
              const isLast = idx === data.timeline.length - 1;
              return (
                <div key={item.id} className="flex gap-3 relative">
                  {!isLast && (
                    <div className={`absolute left-[15px] top-8 w-0.5 h-full ${s.line} opacity-30`} />
                  )}
                  <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full ${s.bg} flex items-center justify-center z-10`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div className="pb-5 flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-500">{item.fecha}</p>
                    <p className={`text-sm font-semibold leading-tight mt-0.5 ${
                      item.estado === "no_cumplido" ? "text-red-700" : "text-gray-900"
                    }`}>
                      {item.servicio}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {item.profesional}
                      {item.entidad && <span className="text-gray-300"> · </span>}
                      {item.entidad}
                    </p>
                    {item.estado === "cumplido" && (
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                          <MapPin className="w-3 h-3 text-emerald-600" /> GPS verificado
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                          <PenLine className="w-3 h-3 text-emerald-600" /> Firma capturada
                        </span>
                      </div>
                    )}
                    {item.estado === "cumplido" && (
                      <Link href={`/evidencia/${item.id}`}
                        className="inline-block mt-2 text-[11px] font-bold text-emerald-600 hover:underline">
                        Ver evidencia →
                      </Link>
                    )}
                    {item.nota && (
                      <div className={`mt-2 px-3 py-2 rounded-lg border flex items-start gap-2 ${
                        item.estado === "no_cumplido"
                          ? "bg-red-50 border-red-100 text-red-700"
                          : "bg-amber-50 border-amber-100 text-amber-700"
                      }`}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-medium">{item.nota}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vitales */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900">Signos vitales recientes</h2>
              <p className="text-xs text-gray-500 mt-0.5">De visitas verificadas</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Adherencia</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{data.adherencia}%</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  data.adherencia >= 90 ? "bg-emerald-100 text-emerald-700" :
                  data.adherencia >= 70 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {data.adherencia >= 90 ? "Óptima" : data.adherencia >= 70 ? "Regular" : "Crítica"}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 flex-1">
            {data.vitales.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
                Sin signos vitales registrados aún
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.vitales} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: "10px" }} />
                  <Line type="monotone" dataKey="pa_sistolica"  name="PA Sistólica"  stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="pa_diastolica" name="PA Diastólica" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="fc"            name="FC (lpm)"      stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  {tieneEPOC && (
                    <Line type="monotone" dataKey="spo2"    name="SpO₂ (%)"  stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                  {tieneDiabetes && (
                    <Line type="monotone" dataKey="glucemia" name="Glucemia" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Botones fijos */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => handleAccion("Llamada al prestador iniciada...")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4" />
            Contactar prestador
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => setModal("modificar")}
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
              Modificar plan
            </button>
            <button onClick={() => setModal("derivar")}
              className="px-8 py-3 bg-red-50 text-red-700 border border-red-200 font-bold rounded-xl hover:bg-red-100 transition-colors shadow-sm">
              Derivar a urgencias
            </button>
          </div>
        </div>
      </div>

      {/* Modal Modificar */}
      <AnimatePresence>
        {modal === "modificar" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold text-gray-900 mb-1">Modificar plan de cuidado</h3>
              <p className="text-xs text-gray-500 mb-4">{data.nombre}</p>
              <textarea
                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                rows={3}
                placeholder="Justificación clínica para la modificación..."
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl">
                  Cancelar
                </button>
                <button onClick={() => handleAccion("Plan actualizado")}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl">
                  Guardar cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Derivar */}
      <AnimatePresence>
        {modal === "derivar" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-700">Derivar a urgencias</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">{data.nombre} · {data.diagnostico}</p>
              <select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 mb-3 bg-white">
                <option>Descompensación hemodinámica</option>
                <option>Falla respiratoria</option>
                <option>Abandono de tratamiento</option>
                <option>Otro</option>
              </select>
              <textarea
                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none"
                rows={3}
                placeholder="Notas para el equipo de traslado..."
                value={derivarNota}
                onChange={(e) => setDerivarNota(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl">
                  Cancelar
                </button>
                <button onClick={() => handleAccion("Ambulancia despachada")}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl">
                  Confirmar derivación
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}