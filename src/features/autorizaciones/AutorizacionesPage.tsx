"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Filter,
  Search,
  ChevronDown,
  Paperclip,
} from "lucide-react";
import { type Solicitud, type EstadoSolicitud } from "@/data/mock/solicitudes";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const COMPLEJIDAD_STYLES = {
  alta:  { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
  media: { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  baja:  { bg: "bg-emerald-100",text: "text-emerald-700",dot: "bg-emerald-500"},
};

const URGENCIA_STYLES = {
  urgente:    { bg: "bg-red-50",   text: "text-red-600",   label: "Urgente"    },
  programado: { bg: "bg-gray-50",  text: "text-gray-600",  label: "Programado" },
};

const ESTADO_STYLES: Record<EstadoSolicitud, { bg: string; text: string; label: string }> = {
  pendiente:           { bg: "bg-gray-100",    text: "text-gray-600",   label: "Pendiente"             },
  aprobado:            { bg: "bg-emerald-100", text: "text-emerald-700",label: "Aprobado"            },
  aprobado_condiciones:{ bg: "bg-amber-100",   text: "text-amber-700",  label: "Aprobado con cond." },
  negado:              { bg: "bg-red-100",     text: "text-red-700",    label: "Negado"              },
  mas_info:            { bg: "bg-blue-100",    text: "text-blue-700",   label: "ℹMás info solicitada" },
};

const TIPOS_SERVICIO = ["Todos", "Enfermería domiciliaria", "Fisioterapia respiratoria", "Fisioterapia", "Curación herida", "Infusión IV", "Rehabilitación neurológica"];

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

export default function AutorizacionesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [estados, setEstados] = useState<Record<number, EstadoSolicitud>>({});
  const [confirming, setConfirming] = useState<{ id: number; accion: EstadoSolicitud } | null>(null);
  const [approved, setApproved] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [filterUrgencia, setFilterUrgencia] = useState<"todos" | "urgente" | "programado">("todos");
  const [filterEstado, setFilterEstado] = useState<EstadoSolicitud | "todos">("todos");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [masInfoSolicitud, setMasInfoSolicitud] = useState<Solicitud | null>(null);
  const [negando, setNegando] = useState<{ id: number } | null>(null);
  const [justificacion, setJustificacion] = useState("");
  const [adjuntos, setAdjuntos] = useState<File[]>([]);
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/eps/solicitudes`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((d) => {
        const items: Solicitud[] = d.data ?? [];
        setSolicitudes(items);
        setEstados(Object.fromEntries(items.map((s) => [s.id, s.estado])));
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return solicitudes.filter((s) => {
      const matchSearch =
        s.paciente.toLowerCase().includes(search.toLowerCase()) ||
        s.diagnostico.toLowerCase().includes(search.toLowerCase()) ||
        s.medico_solicitante.toLowerCase().includes(search.toLowerCase()) ||
        (s.cie_codigo ?? "").toLowerCase().includes(search.toLowerCase());
      const matchUrgencia = filterUrgencia === "todos" || s.urgencia === filterUrgencia;
      const matchTipo     = filterTipo === "Todos" || s.tipo_servicio === filterTipo;
      const matchEstado   = filterEstado === "todos" || (estados[s.id] ?? s.estado) === filterEstado;
      return matchSearch && matchUrgencia && matchTipo && matchEstado;
    });
  }, [solicitudes, search, filterUrgencia, filterTipo]);

  const pendientes = Object.values(estados).filter((e) => e === "pendiente").length;

  function handleAccion(id: number, accion: EstadoSolicitud) {
    if (accion === "aprobado") { setConfirming({ id, accion }); return; }
    if (accion === "negado")   { setNegando({ id }); return; }
    aplicarAccion(id, accion);
  }

  function cerrarModalNegacion() {
    setNegando(null);
    setJustificacion("");
    setAdjuntos([]);
    setIntentoEnvio(false);
  }

  function confirmarNegacion() {
    setIntentoEnvio(true);
    if (!negando || justificacion.trim().length < 10) return;
    const id = negando.id;
    setEstados((prev) => ({ ...prev, [id]: "negado" }));
    cerrarModalNegacion();
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/eps/solicitudes/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: JSON.stringify({ estado: "negado", justificacion: justificacion.trim(), adjuntos: adjuntos.map((f) => f.name) }),
    }).catch(() => {});
    toast("Solicitud negada", {
      style: { background: "#DC2626", color: "#fff", fontWeight: "600", borderRadius: "10px" },
    });
  }

  function aplicarAccion(id: number, accion: EstadoSolicitud) {
    setEstados((prev) => ({ ...prev, [id]: accion }));
    setConfirming(null);
    // Persistir en el backend (optimistic update — UI ya actualizó)
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/eps/solicitudes/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: JSON.stringify({ estado: accion }),
    }).catch(() => {});

    const labels: Record<EstadoSolicitud, string> = {
      aprobado:             "Servicio autorizado",
      aprobado_condiciones: "Aprobado con condiciones",
      negado:               "Solicitud negada",
      mas_info:             "ℹSe solicitó más información",
      pendiente:            "",
    };

    if (accion === "aprobado") {
      setApproved((prev) => new Set(prev).add(id));
      setTimeout(() => setApproved((prev) => { const s = new Set(prev); s.delete(id); return s; }), 2000);
    }

    toast(labels[accion], {
      style: {
        background: accion === "aprobado" ? "#059669" : accion === "negado" ? "#DC2626" : "#D97706",
        color: "#fff",
        fontWeight: "600",
        borderRadius: "10px",
      },
    });
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Solicitudes de Autorización</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendientes} pendientes de revisión · Mayo 2026
          </p>
        </div>
        {pendientes > 0 && (
          <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {pendientes} requieren decisión
          </span>
        )}
      </div>

      {/* Filtros */}
      <div data-tour="filtros" className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        {/* Fila 1: búsqueda + urgencia + tipo */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente, diagnóstico, médico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex gap-1">
              {(["todos", "urgente", "programado"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setFilterUrgencia(u)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    filterUrgencia === u
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {u === "todos" ? "Todos" : u === "urgente" ? "Urgentes" : "Programados"}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none bg-white"
            >
              {TIPOS_SERVICIO.map((t) => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        {/* Fila 2: filtro por estado */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado:</span>
          {([
            { value: "todos",              label: "Todas" },
            { value: "pendiente",          label: "Pendiente" },
            { value: "aprobado",           label: "Aprobadas" },
            { value: "aprobado_condiciones",label: "Con condiciones" },
            { value: "negado",             label: "Negadas" },
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilterEstado(value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                filterEstado === value
                  ? value === "pendiente"           ? "bg-gray-700 text-white"
                  : value === "aprobado"            ? "bg-emerald-600 text-white"
                  : value === "aprobado_condiciones"? "bg-amber-500 text-white"
                  : value === "negado"              ? "bg-red-600 text-white"
                  : "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
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
                const estado = estados[s.id];
                const comp = COMPLEJIDAD_STYLES[s.complejidad];
                const urg = URGENCIA_STYLES[s.urgencia];
                const estStyle = ESTADO_STYLES[estado];
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
                            {/* Aprobar */}
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              onClick={() => handleAccion(s.id, "aprobado")}
                              className="flex items-center gap-1.5 w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Aprobar
                            </motion.button>
                            {/* Aprobar con condiciones */}
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              onClick={() => handleAccion(s.id, "aprobado_condiciones")}
                              className="flex items-center gap-1.5 w-full text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <AlertCircle className="w-3.5 h-3.5" /> Con condiciones
                            </motion.button>
                            {/* Negar */}
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              onClick={() => handleAccion(s.id, "negado")}
                              className="flex items-center gap-1.5 w-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Negar
                            </motion.button>
                            {/* Más info — abre modal de documentos */}
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setMasInfoSolicitud(s)}
                              className="flex items-center gap-1.5 w-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Info className="w-3.5 h-3.5" /> Más info
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Animación checkmark al aprobar */}
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

      {/* Modal de confirmación para Aprobar */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirming(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
              {confirming && (() => {
                const sol = solicitudes.find((s) => s.id === confirming.id);
                return sol ? (
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
                    <p className="text-sm font-semibold text-gray-900">{sol.paciente}</p>
                    <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{sol.plan_nombre}</span> · {sol.plan_propuesto}</p>
                    <p className="text-sm font-bold text-emerald-700">{formatCOP(sol.costo_estimado)} / mes <span className="text-xs font-normal text-gray-400">(valor facturable)</span></p>
                  </div>
                ) : null;
              })()}
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirming(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => aplicarAccion(confirming!.id, confirming!.accion)}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Autorizar servicio
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal de justificación para Negar ── */}
      <AnimatePresence>
        {negando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cerrarModalNegacion}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Justificar negación</h3>
                  <p className="text-xs text-gray-500">Esta acción quedará registrada en el sistema</p>
                </div>
              </div>

              {/* Resumen de la solicitud */}
              {(() => {
                const sol = solicitudes.find((s) => s.id === negando.id);
                return sol ? (
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
                    <p className="text-sm font-semibold text-gray-900">{sol.paciente}</p>
                    <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{sol.plan_nombre}</span> · {sol.plan_propuesto}</p>
                    <p className="text-sm font-bold text-red-700">{formatCOP(sol.costo_estimado)} / mes <span className="text-xs font-normal text-gray-400">(valor facturable)</span></p>
                  </div>
                ) : null;
              })()}

              {/* Textarea justificación */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Motivo del rechazo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  rows={4}
                  placeholder="Describa el motivo por el cual se niega esta solicitud de autorización..."
                  className={`w-full text-sm border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-colors ${
                    intentoEnvio && justificacion.trim().length < 10
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {intentoEnvio && justificacion.trim().length < 10 && (
                  <p className="text-xs text-red-600 mt-1">El motivo debe tener al menos 10 caracteres.</p>
                )}
              </div>

              {/* Adjuntar documentos */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Documentos de soporte <span className="text-gray-400 font-normal">(opcional)</span></label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const nuevos = Array.from(e.target.files ?? []);
                    setAdjuntos((prev) => [...prev, ...nuevos]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Adjuntar archivo
                </button>
                {adjuntos.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {adjuntos.map((f, i) => (
                      <li key={i} className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                        <span className="text-gray-700 truncate max-w-[280px]">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => setAdjuntos((prev) => prev.filter((_, idx) => idx !== i))}
                          className="ml-2 text-gray-400 hover:text-red-500 font-bold flex-shrink-0"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={cerrarModalNegacion}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmarNegacion}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Negar solicitud
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Más info — documentos clínicos ── */}
      <AnimatePresence>
        {masInfoSolicitud && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setMasInfoSolicitud(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Documentos de soporte</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{masInfoSolicitud.paciente} · {masInfoSolicitud.plan_nombre}</p>
                </div>
              </div>

              {/* Resumen clínico */}
              <div className="bg-gray-50 rounded-xl p-3 mb-5 space-y-1">
                <p className="text-xs text-gray-500">Diagnóstico</p>
                <p className="text-sm font-semibold text-gray-900">{masInfoSolicitud.diagnostico}</p>
                {masInfoSolicitud.cie_codigo && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    {masInfoSolicitud.cie_version ?? "CIE-10"} {masInfoSolicitud.cie_codigo}
                  </span>
                )}
                <p className="text-xs text-gray-500 mt-1">{masInfoSolicitud.plan_nombre} · {masInfoSolicitud.plan_propuesto}</p>
              </div>

              {/* Documentos PDF mock */}
              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Documentos adjuntos</p>

                <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-red-600">PDF</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Orden médica</p>
                    <p className="text-xs text-gray-400">{masInfoSolicitud.medico_solicitante} · {masInfoSolicitud.hospital}</p>
                  </div>
                  <span className="text-xs text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-red-600">PDF</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Historia clínica resumida</p>
                    <p className="text-xs text-gray-400">{masInfoSolicitud.paciente} · CC {masInfoSolicitud.cedula}</p>
                  </div>
                  <span className="text-xs text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                </button>
              </div>

              <button
                onClick={() => setMasInfoSolicitud(null)}
                className="w-full py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
