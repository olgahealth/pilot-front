"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { type VitalItem } from "../types";

interface Props {
  vitales: VitalItem[];
  adherencia: number;
  diagnostico: string;
}

export function VitalsChart({ vitales, adherencia, diagnostico }: Props) {
  const tieneEPOC     = diagnostico.toLowerCase().includes("epoc");
  const tieneDiabetes = diagnostico.toLowerCase().includes("diabet");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-gray-900">Signos vitales recientes</h2>
          <p className="text-xs text-gray-500 mt-0.5">De visitas verificadas</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Adherencia</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{adherencia}%</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${adherencia >= 90 ? "bg-emerald-100 text-emerald-700" : adherencia >= 70 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
              {adherencia >= 90 ? "Óptima" : adherencia >= 70 ? "Regular" : "Crítica"}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 flex-1">
        {vitales.length === 0 ? (
          <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">Sin signos vitales registrados aún</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={vitales} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: "10px" }} />
              <Line type="monotone" dataKey="pa_sistolica"  name="PA Sistólica"  stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pa_diastolica" name="PA Diastólica" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="fc"            name="FC (lpm)"      stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              {tieneEPOC     && <Line type="monotone" dataKey="spo2"    name="SpO₂ (%)"  stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />}
              {tieneDiabetes && <Line type="monotone" dataKey="glucemia" name="Glucemia" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
