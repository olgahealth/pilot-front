"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props { isOpen: boolean; paciente: string; onConfirm: () => void; onClose: () => void; }

export function ModifyPlanModal({ isOpen, paciente, onConfirm, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-1">Modificar plan de cuidado</h3>
            <p className="text-xs text-gray-500 mb-4">{paciente}</p>
            <textarea className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20" rows={3}
              placeholder="Justificación clínica para la modificación..." />
            <div className="flex gap-3 mt-4">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl">Guardar cambios</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
