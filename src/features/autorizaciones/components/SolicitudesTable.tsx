"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, Search } from "lucide-react";
import { type Solicitud, type EstadoSolicitud } from "@/data/mock/solicitudes";
import { COMPLEJIDAD_STYLES, URGENCIA_STYLES, ESTADO_STYLES, formatCOP } from "../constants";

interface Props {
  filtered: Solicitud[];
  estados: Record<number, EstadoSolicitud>;
  approved: Set<number>;
  onAccion: (id: number, accion: EstadoSolicitud) => void;
  onMasInfo: (s: Solicitud) => void;
}

export function SolicitudesTable({ filtered, estados, approved, onAccion, onMasInfo }: Props) {
  return (
    <div data-tour="tabla-solicitudes" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Diagnóstico</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Complejidad</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan propuesto</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Médico · Hospital</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider" title="Valor facturable al asegurador por mes de servicio">Valor facturable</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado / Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((s) => {
              const estado    = estados[s.id];
              const comp      = COMPLEJIDAD_STYLES[s.complejidad];
              const urg       = URGENCIA_STYLES[s.urgencia];
              const estStyle  = ESTADO_STYLES[estado];
              const isApproved = approved.has(s.id);

              return (
                <motion.tr
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{s.paciente}</p>
                    <p className="text-xs text-gray-400">{s.cedula}</p>
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${urg.bg} ${urg.text}`}>
                      {urg.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-700 max-w-[160px] leading-tight">{s.diagnostico}</p>
                    {s.cie_codigo && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {s.cie_version ?? "CIE-10"} {s.cie_codigo}
                      </span>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{s.tipo_servicio}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${comp.bg} ${comp.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${comp.dot}`} />
                      {s.complejidad.charAt(0).toUpperCase() + s.complejidad.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-600 text-xs max-w-[180px] leading-snug">
                      <span className="font-bold text-gray-800">{s.plan_nombre}</span>
                      {" · "}{s.plan_propuesto}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800 text-xs">{s.medico_solicitante}</p>
                    <p className="text-xs text-gray-400">{s.hospital}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-gray-900">{formatCOP(s.costo_estimado)}</p>
                    <p className="text-[10px] text-gray-400">estimado/mes</p>
                  </td>
                  <td className="px-4 py-4">
                    <AnimatePresence mode="wait">
                      {estado !== "pendiente" ? (
                        <motion.span
                          key="badge"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${estStyle.bg} ${estStyle.text}`}
                        >
                          {estStyle.label}
                        </motion.span>
                      ) : (
                        <motion.div
                          key="actions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          data-tour="acciones-solicitud"
                          className="flex flex-col gap-1.5 min-w-[140px]"
                        >
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => onAccion(s.id, "aprobado")}
                            className="flex items-center gap-1.5 w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" /> Aprobar
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => onAccion(s.id, "aprobado_condiciones")}
                            className="flex items-center gap-1.5 w-full text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                            <AlertCircle className="w-3.5 h-3.5" /> Con condiciones
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => onAccion(s.id, "negado")}
                            className="flex items-center gap-1.5 w-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                            <XCircle className="w-3.5 h-3.5" /> Negar
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => onMasInfo(s)}
                            className="flex items-center gap-1.5 w-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                            <Info className="w-3.5 h-3.5" /> Más info
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {isApproved && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.3, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-7 h-7 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Sin resultados para los filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
}
