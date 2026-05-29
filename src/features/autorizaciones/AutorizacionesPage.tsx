"use client";

import { useState, useMemo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { type Solicitud, type EstadoSolicitud } from "@/data/mock/solicitudes";
import { FilterBar }               from "./components/FilterBar";
import { SolicitudesTable }        from "./components/SolicitudesTable";
import { ConfirmApprovalModal }    from "./components/ConfirmApprovalModal";
import { RejectionModal }          from "./components/RejectionModal";
import { ConditionalApprovalModal }from "./components/ConditionalApprovalModal";
import { RequestDetailsModal }     from "./components/RequestDetailsModal";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function AutorizacionesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [estados, setEstados]         = useState<Record<number, EstadoSolicitud>>({});
  const [approved, setApproved]       = useState<Set<number>>(new Set());

  // Filtros
  const [search, setSearch]                 = useState("");
  const [filterUrgencia, setFilterUrgencia] = useState<"todos" | "urgente" | "programado">("todos");
  const [filterEstado, setFilterEstado]     = useState<EstadoSolicitud | "todos">("todos");
  const [filterTipo, setFilterTipo]         = useState("Todos");

  // Modales — qué solicitud está siendo procesada
  const [confirmingSolicitud, setConfirmingSolicitud]     = useState<Solicitud | null>(null);
  const [negandoSolicitud, setNegandoSolicitud]           = useState<Solicitud | null>(null);
  const [condicionandoSolicitud, setCondicionandoSolicitud] = useState<Solicitud | null>(null);
  const [masInfoSolicitud, setMasInfoSolicitud]           = useState<Solicitud | null>(null);

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
  }, [solicitudes, search, filterUrgencia, filterTipo, estados, filterEstado]);

  const pendientes = Object.values(estados).filter((e) => e === "pendiente").length;

  function handleAccion(id: number, accion: EstadoSolicitud) {
    const sol = solicitudes.find((s) => s.id === id) ?? null;
    if (accion === "aprobado")             { setConfirmingSolicitud(sol); return; }
    if (accion === "negado")               { setNegandoSolicitud(sol); return; }
    if (accion === "aprobado_condiciones") { setCondicionandoSolicitud(sol); return; }
    aplicarEstado(id, accion);
  }

  function aplicarEstado(id: number, accion: EstadoSolicitud, extra?: object) {
    setEstados((prev) => ({ ...prev, [id]: accion }));
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/eps/solicitudes/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: JSON.stringify({ estado: accion, ...extra }),
    }).catch(() => {});

    if (accion === "aprobado") {
      setApproved((prev) => new Set(prev).add(id));
      setTimeout(() => setApproved((prev) => { const s = new Set(prev); s.delete(id); return s; }), 2000);
    }

    const labels: Record<EstadoSolicitud, string> = {
      aprobado: "Servicio autorizado", aprobado_condiciones: "Aprobado con condiciones",
      negado: "Solicitud negada", mas_info: "ℹSe solicitó más información", pendiente: "",
    };
    toast(labels[accion], {
      style: { background: accion === "aprobado" ? "#059669" : accion === "negado" ? "#DC2626" : "#D97706", color: "#fff", fontWeight: "600", borderRadius: "10px" },
    });
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Solicitudes de Autorización</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pendientes} pendientes de revisión · Mayo 2026</p>
        </div>
        {pendientes > 0 && (
          <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {pendientes} requieren decisión
          </span>
        )}
      </div>

      <FilterBar
        search={search} onSearch={setSearch}
        filterUrgencia={filterUrgencia} onFilterUrgencia={setFilterUrgencia}
        filterEstado={filterEstado} onFilterEstado={setFilterEstado}
        filterTipo={filterTipo} onFilterTipo={setFilterTipo}
      />

      <SolicitudesTable
        filtered={filtered}
        estados={estados}
        approved={approved}
        onAccion={handleAccion}
        onMasInfo={setMasInfoSolicitud}
      />

      <ConfirmApprovalModal
        solicitud={confirmingSolicitud}
        onConfirm={() => { if (confirmingSolicitud) { aplicarEstado(confirmingSolicitud.id, "aprobado"); setConfirmingSolicitud(null); } }}
        onClose={() => setConfirmingSolicitud(null)}
      />

      <RejectionModal
        solicitud={negandoSolicitud}
        onConfirm={(justificacion, adjuntos) => {
          if (negandoSolicitud) { aplicarEstado(negandoSolicitud.id, "negado", { justificacion, adjuntos: adjuntos.map((f) => f.name) }); }
          setNegandoSolicitud(null);
        }}
        onClose={() => setNegandoSolicitud(null)}
      />

      <ConditionalApprovalModal
        solicitud={condicionandoSolicitud}
        onConfirm={(condiciones, valorAutorizado) => {
          if (condicionandoSolicitud) { aplicarEstado(condicionandoSolicitud.id, "aprobado_condiciones", { condiciones, valor_autorizado: valorAutorizado }); }
          setCondicionandoSolicitud(null);
        }}
        onClose={() => setCondicionandoSolicitud(null)}
      />

      <RequestDetailsModal
        solicitud={masInfoSolicitud}
        onClose={() => setMasInfoSolicitud(null)}
      />
    </div>
  );
}
