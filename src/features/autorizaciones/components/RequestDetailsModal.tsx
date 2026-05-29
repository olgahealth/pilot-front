"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { type Solicitud } from "@/data/mock/solicitudes";

interface Props {
  solicitud: Solicitud | null;
  onClose: () => void;
}

export function RequestDetailsModal({ solicitud, onClose }: Props) {
  return (
    <AnimatePresence>
      {solicitud && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }} transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Documentos de soporte</h3>
                <p className="text-xs text-gray-500 mt-0.5">{solicitud.paciente} · {solicitud.plan_nombre}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-5 space-y-1">
              <p className="text-xs text-gray-500">Diagnóstico</p>
              <p className="text-sm font-semibold text-gray-900">{solicitud.diagnostico}</p>
              {solicitud.cie_codigo && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {solicitud.cie_version ?? "CIE-10"} {solicitud.cie_codigo}
                </span>
              )}
              <p className="text-xs text-gray-500 mt-1">{solicitud.plan_nombre} · {solicitud.plan_propuesto}</p>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Documentos adjuntos</p>
              {[
                { label: "Orden médica", sub: `${solicitud.medico_solicitante} · ${solicitud.hospital}` },
                { label: "Historia clínica resumida", sub: `${solicitud.paciente} · CC ${solicitud.cedula}` },
              ].map((doc) => (
                <button key={doc.label} className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-red-600">PDF</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{doc.label}</p>
                    <p className="text-xs text-gray-400">{doc.sub}</p>
                  </div>
                  <span className="text-xs text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                </button>
              ))}
            </div>

            <button onClick={onClose} className="w-full py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
