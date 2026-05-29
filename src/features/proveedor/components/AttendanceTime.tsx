"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

interface Props { onChange: (llegada: string, salida: string) => void; }

function calcMinutos(l: string, s: string) {
  const [lh, lm] = l.split(":").map(Number);
  const [sh, sm] = s.split(":").map(Number);
  return Math.max(0, (sh * 60 + sm) - (lh * 60 + lm));
}

export function AttendanceTime({ onChange }: Props) {
  const [llegada, setLlegada] = useState("");
  const [salida,  setSalida]  = useState("");

  function update(campo: "llegada" | "salida", val: string) {
    const nl = campo === "llegada" ? val : llegada;
    const ns = campo === "salida"  ? val : salida;
    if (campo === "llegada") setLlegada(val); else setSalida(val);
    onChange(nl, ns);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-emerald-600" />
        <h3 className="text-sm font-bold text-slate-800">Tiempo de atención</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Hora de llegada</label>
          <input type="time" value={llegada} onChange={(e) => update("llegada", e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Hora de salida</label>
          <input type="time" value={salida} onChange={(e) => update("salida", e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
        </div>
      </div>
      {llegada && salida && calcMinutos(llegada, salida) > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2 font-semibold">
          <Clock className="w-4 h-4" /> Tiempo total: {calcMinutos(llegada, salida)} minutos
        </div>
      )}
    </div>
  );
}
