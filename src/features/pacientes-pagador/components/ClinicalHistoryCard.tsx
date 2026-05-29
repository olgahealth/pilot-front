"use client";

import { HeartPulse, AlertCircle } from "lucide-react";
import { type Riesgo, type Tendencia } from "../types";
import { TENDENCIA_ICON } from "../constants";

const CONDITIONS = [
  { label: "Cardiopatía",    key: /cardia|cardio|icc|insuficiencia card/i },
  { label: "Diabetes",       key: /diabet/i },
  { label: "EPOC",           key: /epoc/i },
  { label: "HTA",            key: /hipertens|hta/i },
  { label: "Oncológico",     key: /cáncer|cancer|oncol|quimio/i },
  { label: "Renal",          key: /renal|nefro|riñón/i },
  { label: "Neurológico",    key: /acv|neurolog|parkins|dement/i },
  { label: "Post-quirúrgico",key: /post.quirúrgico|post.operat|prótesis|fractura/i },
];

interface Props {
  diagnostico: string;
  riesgo: Riesgo;
  tendencia: Tendencia;
  medico: string;
  eps: string;
}

export function ClinicalHistoryCard({ diagnostico, riesgo, tendencia, medico, eps }: Props) {
  const t = TENDENCIA_ICON[tendencia] ?? TENDENCIA_ICON["estable"];
  const activeConditions = CONDITIONS.filter(c => c.key.test(diagnostico));

  return (
    <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
      <div className="flex items-center gap-2">
        <HeartPulse className="w-4 h-4 text-gray-400" />
        <h2 className="text-sm font-bold text-gray-900">Historia Clínica</h2>
      </div>

      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dx principal</p>
        <p className="text-xs font-semibold text-gray-800 mt-0.5 leading-snug">{diagnostico}</p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Condiciones activas</p>
        <div className="space-y-1">
          {activeConditions.map(c => (
            <div key={c.label} className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />{c.label}
            </div>
          ))}
          {riesgo === "alto" && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />Polifarmacia probable
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tendencia</p>
        <div className={`flex items-center gap-1 mt-0.5 text-xs font-bold ${t.color}`}>
          <t.Icon className="w-3.5 h-3.5" /> {t.label}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 space-y-0.5">
        <p className="text-[11px] text-gray-500"><span className="font-semibold text-gray-700">{medico}</span></p>
        <p className="text-[11px] text-gray-400">{eps}</p>
      </div>
    </div>
  );
}
