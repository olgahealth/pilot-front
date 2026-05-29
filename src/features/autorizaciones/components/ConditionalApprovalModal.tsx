"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { type Solicitud } from "@/data/mock/solicitudes";
import { formatCOP } from "../constants";

interface Props {
  solicitud: Solicitud | null;
  onConfirm: (condiciones: string, valorAutorizado?: number) => void;
  onClose: () => void;
}

export function ConditionalApprovalModal({ solicitud, onConfirm, onClose }: Props) {
  const [condiciones, setCondiciones] = useState("");
  const [valorAutorizado, setValorAutorizado] = useState("");
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  function handleClose() {
    setCondiciones(""); setValorAutorizado(""); setIntentoEnvio(false);
    onClose();
  }

  function handleConfirm() {
    setIntentoEnvio(true);
    if (condiciones.trim().length < 10) return;
    const valor = valorAutorizado ? Number(valorAutorizado.replace(/\D/g, "")) : undefined;
    onConfirm(condiciones.trim(), valor);
    setCondiciones(""); setValorAutorizado(""); setIntentoEnvio(false);
  }

  return (
    <AnimatePresence>
      {solicitud && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Especificar condiciones</h3>
                <p className="text-xs text-gray-500">Esta acción quedará registrada en el sistema</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
              <p className="text-sm font-semibold text-gray-900">{solicitud.paciente}</p>
              <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{solicitud.plan_nombre}</span> · {solicitud.plan_propuesto}</p>
              <p className="text-sm font-bold text-amber-700">{formatCOP(solicitud.costo_estimado)} / mes <span className="text-xs font-normal text-gray-400">(valor solicitado)</span></p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Condiciones de aprobación <span className="text-amber-500">*</span>
              </label>
              <textarea
                value={condiciones} onChange={(e) => setCondiciones(e.target.value)}
                rows={4} placeholder="Ej: Se autoriza 3 visitas/sem en lugar de 5. Requiere reevaluación médica al mes 2..."
                className={`w-full text-sm border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-colors ${
                  intentoEnvio && condiciones.trim().length < 10 ? "border-amber-400 bg-amber-50" : "border-gray-200"
                }`}
              />
              {intentoEnvio && condiciones.trim().length < 10 && (
                <p className="text-xs text-amber-600 mt-1">Las condiciones deben tener al menos 10 caracteres.</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Valor autorizado / mes <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input type="text" value={valorAutorizado} onChange={(e) => setValorAutorizado(e.target.value)}
                placeholder="$ 0"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                Cancelar
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleConfirm}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" /> Aprobar con condiciones
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
