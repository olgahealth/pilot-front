"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface Props { isOpen: boolean; onClose: () => void; onConfirm: (motivo: string) => void; }

export function IrregularidadModal({ isOpen, onClose, onConfirm }: Props) {
  const [motivo, setMotivo] = useState("");

  function handleConfirm() { onConfirm(motivo); setMotivo(""); }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Marcar irregularidad</h3>
                <p className="text-xs text-gray-500">Se notificará al equipo de auditoría</p>
              </div>
            </header>
            <textarea
              className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
              rows={4} placeholder="Describe la irregularidad detectada..."
              value={motivo} onChange={(e) => setMotivo(e.target.value)}
            />
            <footer className="flex gap-3 mt-4">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={handleConfirm} className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700">Confirmar</button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
