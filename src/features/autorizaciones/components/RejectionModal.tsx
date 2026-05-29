"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Paperclip } from "lucide-react";
import { type Solicitud } from "@/data/mock/solicitudes";
import { formatCOP } from "../constants";

interface Props {
  solicitud: Solicitud | null;
  onConfirm: (justificacion: string, adjuntos: File[]) => void;
  onClose: () => void;
}

export function RejectionModal({ solicitud, onConfirm, onClose }: Props) {
  const [justificacion, setJustificacion] = useState("");
  const [adjuntos, setAdjuntos] = useState<File[]>([]);
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    setJustificacion(""); setAdjuntos([]); setIntentoEnvio(false);
    onClose();
  }

  function handleConfirm() {
    setIntentoEnvio(true);
    if (justificacion.trim().length < 10) return;
    onConfirm(justificacion.trim(), adjuntos);
    setJustificacion(""); setAdjuntos([]); setIntentoEnvio(false);
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
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Justificar negación</h3>
                <p className="text-xs text-gray-500">Esta acción quedará registrada en el sistema</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
              <p className="text-sm font-semibold text-gray-900">{solicitud.paciente}</p>
              <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{solicitud.plan_nombre}</span> · {solicitud.plan_propuesto}</p>
              <p className="text-sm font-bold text-red-700">{formatCOP(solicitud.costo_estimado)} / mes <span className="text-xs font-normal text-gray-400">(valor facturable)</span></p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Motivo del rechazo <span className="text-red-500">*</span>
              </label>
              <textarea
                value={justificacion} onChange={(e) => setJustificacion(e.target.value)}
                rows={4} placeholder="Describa el motivo por el cual se niega esta solicitud de autorización..."
                className={`w-full text-sm border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-colors ${
                  intentoEnvio && justificacion.trim().length < 10 ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {intentoEnvio && justificacion.trim().length < 10 && (
                <p className="text-xs text-red-600 mt-1">El motivo debe tener al menos 10 caracteres.</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Documentos de soporte <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                onChange={(e) => {
                  setAdjuntos((prev) => [...prev, ...Array.from(e.target.files ?? [])]);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                <Paperclip className="w-3.5 h-3.5" /> Adjuntar archivo
              </button>
              {adjuntos.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {adjuntos.map((f, i) => (
                    <li key={i} className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                      <span className="text-gray-700 truncate max-w-[280px]">{f.name}</span>
                      <button type="button" onClick={() => setAdjuntos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="ml-2 text-gray-400 hover:text-red-500 font-bold flex-shrink-0">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                Cancelar
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleConfirm}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Negar solicitud
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
