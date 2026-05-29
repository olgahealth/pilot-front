"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { type Solicitud } from "@/data/mock/solicitudes";
import { formatCOP } from "../constants";

interface Props {
  solicitud: Solicitud | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmApprovalModal({ solicitud, onConfirm, onClose }: Props) {
  return (
    <AnimatePresence>
      {solicitud && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Confirmar autorización</h3>
                <p className="text-xs text-gray-500">Esta acción quedará registrada en el sistema</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
              <p className="text-sm font-semibold text-gray-900">{solicitud.paciente}</p>
              <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{solicitud.plan_nombre}</span> · {solicitud.plan_propuesto}</p>
              <p className="text-sm font-bold text-emerald-700">{formatCOP(solicitud.costo_estimado)} / mes <span className="text-xs font-normal text-gray-400">(valor facturable)</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                Cancelar
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onConfirm}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Autorizar servicio
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
