"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, Camera, FileText, Pen, Loader2 } from "lucide-react";
import { GPSVerificationCard } from "./components/GPSVerificationCard";
import { ServiceInfoCard }     from "./components/ServiceInfoCard";
import { PatientRating }       from "./components/PatientRating";
import { IrregularidadModal }  from "./components/IrregularidadModal";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface EvidenciaData {
  id: number;
  timelineId: number;
  paciente: { nombre: string; cedula: string; diagnostico: string };
  visita: { fecha: string; servicio: string; profesional: string; entidad: string; estado: string };
  notaClinica: string | null;
  fotoBase64: string | null;
  firmaBase64: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  timestampCarga: string | null;
  hora_llegada: string | null;
  hora_salida: string | null;
  tiempo_atencion: number | null;
  calificacion: number | null;
  comentario_paciente: string | null;
  estado: string;
}

export default function EvidenciaPage({ id }: { id: number }) {
  const router = useRouter();
  const [data, setData]               = useState<EvidenciaData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [aprobado, setAprobado]       = useState(false);
  const [showCheck, setShowCheck]     = useState(false);
  const [updatingEstado, setUpdatingEstado] = useState(false);
  const [modalIrregular, setModalIrregular] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/eps/evidencia/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(async (r) => {
        if (!r.ok) { setNotFound(true); return; }
        const d: EvidenciaData = await r.json();
        if (!d) { setNotFound(true); return; }
        setData(d);
        setAprobado(d.estado === "verificado");
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function actualizarEstado(estado: string) {
    if (!data) return;
    setUpdatingEstado(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API}/api/v1/eps/evidencia/${data.id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error();
      setData((prev) => prev ? { ...prev, estado } : prev);
      if (estado === "verificado") {
        setAprobado(true); setShowCheck(true);
        setTimeout(() => setShowCheck(false), 2000);
        toast("✅ Servicio aprobado para auditoría", { style: { background: "#059669", color: "#fff", fontWeight: "600", borderRadius: "10px" } });
      }
    } catch { toast.error("Error al actualizar estado"); }
    finally { setUpdatingEstado(false); }
  }

  async function guardarCalificacion(calificacion: number, comentario: string) {
    if (!data) return;
    const token = localStorage.getItem("auth_token");
    await fetch(`${API}/api/v1/eps/evidencia/${data.id}/calificacion`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ calificacion, comentario_paciente: comentario }),
    });
    setData((prev) => prev ? { ...prev, calificacion, comentario_paciente: comentario } : prev);
    toast("⭐ Calificación guardada", { style: { background: "#f59e0b", color: "#fff", fontWeight: "600", borderRadius: "10px" } });
  }

  function handleIrregularidad(motivo: string) {
    actualizarEstado("rechazado");
    setModalIrregular(false);
    toast(`⚠️ Irregularidad marcada${motivo ? `: ${motivo.slice(0, 40)}` : ""}`, {
      style: { background: "#DC2626", color: "#fff", fontWeight: "600", borderRadius: "10px" },
    });
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  if (notFound || !data) return (
    <div className="p-8 text-center text-gray-500">
      <p className="text-sm">No se encontró evidencia para esta visita.</p>
      <button onClick={() => router.back()} className="mt-4 text-emerald-600 text-sm font-semibold hover:underline">← Volver</button>
    </div>
  );

  const esIrregular       = data.estado === "rechazado";
  const isApprovedAndNormal = aprobado && !esIrregular;
  const canApprove        = !aprobado && !esIrregular && data.estado !== "pendiente";
  const tieneDatos        = data.notaClinica || data.firmaBase64 || (data.gpsLat !== null);

  return (
    <main className="p-6 space-y-6 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="flex items-start gap-4">
        <button onClick={() => router.back()} className="mt-1 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Evidencia de Servicio</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.paciente.nombre} · {data.visita.fecha}</p>
        </div>
        <div className="flex items-center gap-2">
          {esIrregular      && <span className="flex items-center gap-1.5 text-xs font-bold bg-red-100 text-red-700 px-3 py-1.5 rounded-full"><AlertTriangle className="w-3.5 h-3.5" /> Irregularidad</span>}
          {isApprovedAndNormal && <span className="flex items-center gap-1.5 text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Verificado</span>}
          {data.estado === "pendiente"         && <span className="flex items-center gap-1.5 text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full"><Clock className="w-3.5 h-3.5" /> Sin evidencia</span>}
          {data.estado === "pendiente_revision" && <span className="flex items-center gap-1.5 text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full"><Clock className="w-3.5 h-3.5" /> En revisión</span>}
        </div>
      </header>

      {!tieneDatos && (
        <article className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Evidencia pendiente</p>
            <p className="text-xs text-amber-700 mt-0.5">El profesional aún no ha cargado evidencia para esta visita.</p>
          </div>
        </article>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GPSVerificationCard gpsLat={data.gpsLat} gpsLng={data.gpsLng} profesional={data.visita.profesional} timestampCarga={data.timestampCarga} />
        <ServiceInfoCard visita={data.visita} gpsLat={data.gpsLat} gpsLng={data.gpsLng} hora_llegada={data.hora_llegada} hora_salida={data.hora_salida} tiempo_atencion={data.tiempo_atencion} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nota clínica */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3"><FileText className="w-4 h-4 text-emerald-600" /><h2 className="text-sm font-bold text-gray-900">Nota clínica</h2></div>
          {data.notaClinica ? <p className="text-sm text-gray-700 leading-relaxed">{data.notaClinica}</p> : <p className="text-sm text-slate-400 italic">Sin nota clínica aún</p>}
        </div>
        {/* Firma */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3"><Pen className="w-4 h-4 text-emerald-600" /><h2 className="text-sm font-bold text-gray-900">Firma digital del profesional</h2></div>
          {data.firmaBase64 ? (
            <>
              <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                <img src={data.firmaBase64} alt="Firma digital" className="max-h-32 object-contain" />
              </div>
              <div className="flex items-center gap-2 mt-3"><CheckCircle className="w-4 h-4 text-emerald-600" /><p className="text-xs text-emerald-700 font-semibold">Firma capturada · {data.visita.fecha}</p></div>
            </>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 h-32 flex items-center justify-center"><p className="text-sm text-slate-400 italic">Firma pendiente</p></div>
          )}
        </div>
      </section>

      <PatientRating
        savedCalificacion={data.calificacion}
        savedComentario={data.comentario_paciente}
        onSave={guardarCalificacion}
        onReset={() => setData((prev) => prev ? { ...prev, calificacion: null } : prev)}
      />

      {data.fotoBase64 && (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3"><Camera className="w-4 h-4 text-emerald-600" /><h2 className="text-sm font-bold text-gray-900">Foto de evidencia</h2></div>
          <img src={data.fotoBase64} alt="Evidencia fotográfica" className="rounded-xl max-h-64 object-cover w-full" />
        </section>
      )}

      {/* Acciones */}
      <footer className="flex flex-wrap gap-3 justify-end">
        {canApprove && (
          <div className="relative">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => actualizarEstado("verificado")} disabled={updatingEstado}
              className="flex items-center gap-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50">
              <CheckCircle className="w-4 h-4" /> Aprobar para auditoría
            </motion.button>
            <AnimatePresence>
              {showCheck && (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.3, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"><CheckCircle className="w-7 h-7 text-white" /></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {isApprovedAndNormal && <span className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-xl"><CheckCircle className="w-4 h-4" /> Aprobado para auditoría</span>}
        {tieneDatos && !esIrregular && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setModalIrregular(true)} disabled={updatingEstado}
            className="flex items-center gap-2 text-sm font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-6 py-3 rounded-xl transition-colors disabled:opacity-50">
            <AlertTriangle className="w-4 h-4" /> Marcar irregularidad
          </motion.button>
        )}
      </footer>

      <IrregularidadModal isOpen={modalIrregular} onClose={() => setModalIrregular(false)} onConfirm={handleIrregularidad} />
    </main>
  );
}
