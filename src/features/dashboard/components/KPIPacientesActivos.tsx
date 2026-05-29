"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronUp } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type PacientePagador = { diagnostico: string; dias_post_alta: number; riesgo: string; [key: string]: unknown };

function getPaquete(p: PacientePagador): string {
  if (/cáncer|cancer|oncol|palia|terminal/i.test(p.diagnostico)) return "Paliativo";
  if (p.dias_post_alta > 180) return "Alto Costo";
  if (p.riesgo === "alto" && p.dias_post_alta < 30) return "PHD";
  if (p.riesgo === "alto") return "PAD";
  return "PARD";
}

interface Props { value: number; }

export function KPIPacientesActivos({ value }: Props) {
  const [show, setShow]         = useState(false);
  const [modalidades, setMod]   = useState<{ pad: number; phd: number; rehab: number } | null>(null);
  const [loading, setLoading]   = useState(false);

  async function fetchModalidades() {
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    try {
      const r = await fetch(`${API}/api/v1/eps/pacientes`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      const data = await r.json();
      const ps: PacientePagador[] = data.data ?? data ?? [];
      let pad = 0, phd = 0, rehab = 0;
      for (const p of ps) { const m = getPaquete(p); if (m === "PAD") pad++; else if (m === "PHD") phd++; else if (m === "PARD") rehab++; }
      setMod({ pad, phd, rehab });
    } finally { setLoading(false); }
  }

  return (
    <div className="relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">Pacientes activos</p>
        <button
          onClick={() => { setShow((v) => !v); if (!modalidades && !loading) fetchModalidades(); }}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 hover:ring-2 ring-indigo-300 transition-all cursor-pointer"
          title="Ver desglose por modalidad">
          {show ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <Users className="h-4 w-4 text-indigo-600" />}
        </button>
      </div>
      <div className="mt-4"><p className="text-3xl font-semibold tracking-tight text-slate-900">{String(value)}</p></div>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
              {[{ label: "PAD", val: modalidades?.pad, bg: "bg-blue-50", text: "text-blue-600", val2: "text-blue-700" },
                { label: "PHD", val: modalidades?.phd, bg: "bg-violet-50", text: "text-violet-600", val2: "text-violet-700" },
                { label: "Rehab", val: modalidades?.rehab, bg: "bg-indigo-50", text: "text-indigo-600", val2: "text-indigo-700" }
              ].map(({ label, val, bg, text, val2 }) => (
                <div key={label} className={`flex flex-col items-center ${bg} rounded-lg p-2`}>
                  <span className={`text-[10px] font-bold ${text} uppercase tracking-tight text-center leading-tight`}>{label}</span>
                  <span className={`text-lg font-bold ${val2}`}>{loading ? "…" : (val ?? "–")}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
