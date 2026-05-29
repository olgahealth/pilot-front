"use client";

import { useState } from "react";
import { MapPin, CheckCircle, Loader2 } from "lucide-react";

interface Props { onCapture: (lat: number, lng: number) => void; }

export function GPSCapture({ onCapture }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [coords, setCoords]   = useState<{ lat: number; lng: number } | null>(null);

  function capture() {
    if (!navigator.geolocation) { setError("GPS no disponible en este dispositivo"); return; }
    setLoading(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c); setLoading(false); onCapture(c.lat, c.lng);
      },
      () => { setError("No se pudo obtener la ubicación. Verificá los permisos."); setLoading(false); },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-emerald-600" />
        <h3 className="text-sm font-bold text-slate-800">Ubicación GPS</h3>
      </div>
      {coords ? (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2.5 font-medium">
          <CheckCircle className="w-4 h-4" />
          Ubicación capturada: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </div>
      ) : (
        <button type="button" onClick={capture} disabled={loading}
          className="w-full py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {loading ? "Obteniendo ubicación..." : "Capturar mi ubicación"}
        </button>
      )}
      {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
    </div>
  );
}
