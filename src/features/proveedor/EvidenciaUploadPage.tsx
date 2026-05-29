"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type SignatureCanvasType from "react-signature-canvas";
import { PenLine, FileText, CheckCircle, ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { GPSCapture }      from "./components/GPSCapture";
import { AttendanceTime }  from "./components/AttendanceTime";
import { PhotoUpload }     from "./components/PhotoUpload";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignatureCanvas = dynamic(() => import("react-signature-canvas"), { ssr: false }) as any;

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface VisitaInfo {
  paciente: { nombre: string; cedula: string; diagnostico: string };
  visita: { fecha: string; servicio: string; profesional: string; entidad: string };
  estado: string;
}

function calcMinutos(l: string, s: string) {
  const [lh, lm] = l.split(":").map(Number);
  const [sh, sm] = s.split(":").map(Number);
  return Math.max(0, (sh * 60 + sm) - (lh * 60 + lm));
}

export default function EvidenciaUploadPage({ timelineId }: { timelineId: number }) {
  const router  = useRouter();
  const sigRef  = useRef<SignatureCanvasType>(null);

  const [info, setInfo]           = useState<VisitaInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [yaSubida, setYaSubida]   = useState(false);
  const [success, setSuccess]     = useState(false);

  // Form state
  const [nota, setNota]           = useState("");
  const [fotoBase64, setFotoBase64] = useState("");
  const [gps, setGps]             = useState<{ lat: number; lng: number } | null>(null);
  const [horas, setHoras]         = useState<{ llegada: string; salida: string }>({ llegada: "", salida: "" });
  const [firmaVacia, setFirmaVacia] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch(`${API}/api/v1/proveedor/evidencia/${timelineId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          setInfo(d);
          if (d.estado === "pendiente_revision" || d.estado === "verificado") setYaSubida(true);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingInfo(false));
  }, [timelineId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nota.trim())                                   { setSubmitError("La nota clínica es obligatoria"); return; }
    if (!gps)                                           { setSubmitError("Capturá la ubicación GPS antes de enviar"); return; }
    if (firmaVacia || sigRef.current?.isEmpty())        { setSubmitError("La firma digital es obligatoria"); return; }

    setSubmitting(true); setSubmitError(null);
    try {
      const firmaBase64 = sigRef.current?.toDataURL("image/png") ?? "";
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API}/api/v1/proveedor/evidencia/${timelineId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          notaClinica: nota,
          fotoBase64: fotoBase64 || undefined,
          firmaBase64,
          gpsLat: gps.lat, gpsLng: gps.lng,
          horaLlegada: horas.llegada || undefined,
          horaSalida: horas.salida || undefined,
          tiempoAtencion: (horas.llegada && horas.salida) ? calcMinutos(horas.llegada, horas.salida) : undefined,
        }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "Error al enviar evidencia"); }
      setSuccess(true);
    } catch (err: any) { setSubmitError(err.message); }
    finally { setSubmitting(false); }
  }

  if (loadingInfo) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle className="w-10 h-10 text-emerald-600" /></div>
      <div><h2 className="text-2xl font-bold text-slate-900">Evidencia enviada</h2><p className="text-sm text-slate-500 mt-2">La EPS recibirá la evidencia para su revisión.</p></div>
      <button onClick={() => router.push("/proveedor/visitas")} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">Volver a mis visitas</button>
    </div>
  );

  if (yaSubida) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
      <CheckCircle className="w-12 h-12 text-emerald-500" />
      <h2 className="text-xl font-bold text-slate-900">Evidencia ya enviada</h2>
      <p className="text-sm text-slate-500">Esta visita ya tiene evidencia cargada y está en proceso de revisión.</p>
      <button onClick={() => router.push("/proveedor/visitas")} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Volver a mis visitas</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-6 pb-24 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cargar evidencia</h1>
          {info && <p className="text-sm text-slate-500">{info.paciente.nombre} · {info.visita.fecha}</p>}
        </div>
      </div>

      {info && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-sm space-y-1">
          <p className="font-semibold text-slate-800">{info.visita.servicio}</p>
          <p className="text-slate-500">{info.paciente.diagnostico}</p>
          <p className="text-slate-400 text-xs">{info.visita.entidad} · {info.visita.profesional}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <GPSCapture onCapture={(lat, lng) => setGps({ lat, lng })} />

        {/* Nota clínica */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3"><FileText className="w-4 h-4 text-emerald-600" /><h3 className="text-sm font-bold text-slate-800">Nota clínica <span className="text-rose-500">*</span></h3></div>
          <textarea required value={nota} onChange={(e) => setNota(e.target.value)} rows={4}
            placeholder="Describe el estado del paciente, procedimientos realizados, observaciones relevantes..."
            className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
        </div>

        <AttendanceTime onChange={(llegada, salida) => setHoras({ llegada, salida })} />

        <PhotoUpload onChange={setFotoBase64} />

        {/* Firma */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><PenLine className="w-4 h-4 text-emerald-600" /><h3 className="text-sm font-bold text-slate-800">Firma digital <span className="text-rose-500">*</span></h3></div>
            <button type="button" onClick={() => { sigRef.current?.clear(); setFirmaVacia(true); }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Limpiar
            </button>
          </div>
          <div className="border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <SignatureCanvas ref={sigRef} penColor="#0f172a"
              canvasProps={{ className: "w-full h-36 touch-none" }}
              onBegin={() => setFirmaVacia(false)} />
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Firmá con el dedo o el mouse</p>
        </div>

        {submitError && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{submitError}</p>}

        <button type="submit" disabled={submitting}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 text-base transition-colors shadow-lg shadow-emerald-600/20">
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
          {submitting ? "Enviando..." : "Enviar evidencia"}
        </button>
      </form>
    </div>
  );
}
