"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const MapaEvidencia = dynamic(() => import("../MapaEvidencia"), { ssr: false });

interface Props {
  gpsLat: number | null;
  gpsLng: number | null;
  profesional: string;
  timestampCarga: string | null;
}

export function GPSVerificationCard({ gpsLat, gpsLng, profesional, timestampCarga }: Props) {
  const tieneGps = gpsLat !== null && gpsLng !== null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-emerald-600" />
        <h2 className="text-sm font-bold text-gray-900">Verificación GPS</h2>
      </div>

      {tieneGps ? (
        <div className="h-[340px] relative w-full">
          <MapaEvidencia
            latDestino={gpsLat!} lngDestino={gpsLng!}
            latGPS={gpsLat!} lngGPS={gpsLng!}
            profesional={profesional}
            timestamp={timestampCarga ?? ""}
            distanciaMetros={0}
            esIrregular={false}
          />
        </div>
      ) : (
        <div className="h-[340px] flex items-center justify-center text-slate-400 text-sm bg-slate-50">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>GPS no disponible aún</p>
          </div>
        </div>
      )}

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {timestampCarga
            ? `Cargado: ${new Date(timestampCarga).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}`
            : "Pendiente de carga"}
        </p>
      </div>
    </div>
  );
}
