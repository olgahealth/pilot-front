"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface Props { isOpen: boolean; nombre: string; diagnostico: string; onConfirm: () => void; onClose: () => void; }

export function ReferralModal({ isOpen, nombre, diagnostico, onConfirm, onClose }: Props) {
  const [nota, setNota] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-red-700">Derivar a urgencias</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">{nombre} · {diagnostico}</p>
            <select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 mb-3 bg-white">
              <option>Descompensación hemodinámica</option>
              <option>Falla respiratoria</option>
              <option>Abandono de tratamiento</option>
              <option>Otro</option>
            </select>
            <textarea className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none" rows={3}
              placeholder="Notas para el equipo de traslado..." value={nota} onChange={(e) => setNota(e.target.value)} />
            <div className="flex gap-3 mt-4">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl">Confirmar derivación</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
