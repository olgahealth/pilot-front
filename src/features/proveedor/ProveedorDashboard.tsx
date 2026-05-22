"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, CheckCircle, Navigation, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { api, type Visit } from "@/lib/api";

const STATUS_CONFIG: Record<string, { label: string; color: string; next?: string; nextLabel?: string }> = {
  scheduled:         { label: "Programada",  color: "#6366F1", next: "provider_en_route", nextLabel: "Salir →" },
  provider_en_route: { label: "En camino",   color: "#F59E0B", next: "in_progress",       nextLabel: "Llegué ✓" },
  in_progress:       { label: "En curso",    color: "#10B981", next: "completed",          nextLabel: "Completar ✓" },
  completed:         { label: "Completada",  color: "#059669" },
  cancelled:         { label: "Cancelada",   color: "#EF4444" },
  no_show:           { label: "No asistió",  color: "#9CA3AF" },
};

export default function ProveedorDashboard() {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();
  const [visits, setVisits]   = useState<Visit[]>([]);
  const [fetching, setFetching] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [locating, setLocating]    = useState(false);
  const [locMsg, setLocMsg]        = useState<string | null>(null);

  useEffect(() => {
    if (!authChecked) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "proveedor" && user.role !== "admin_olga") {
      router.replace(`/${user.role}/dashboard`);
      return;
    }
    api.proveedor.myVisits()
      .then(setVisits)
      .catch(() => setVisits([]))
      .finally(() => setFetching(false));
  }, [user, authChecked, router]);

  async function handleStatusUpdate(visit: Visit) {
    const cfg = STATUS_CONFIG[visit.status];
    if (!cfg?.next) return;
    setUpdatingId(visit.id);
    try {
      await api.proveedor.updateStatus(visit.id, cfg.next);
      setVisits(prev => prev.map(v => v.id === visit.id ? { ...v, status: cfg.next! } : v));
    } catch {
      // silencioso
    } finally {
      setUpdatingId(null);
    }
  }

  function shareLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.proveedor.updateLocation(pos.coords.latitude, pos.coords.longitude);
          setLocMsg("Ubicación enviada ✓");
        } catch {
          setLocMsg("Error al enviar ubicación");
        } finally {
          setLocating(false);
          setTimeout(() => setLocMsg(null), 3000);
        }
      },
      () => { setLocating(false); setLocMsg("No se pudo obtener ubicación"); }
    );
  }

  if (loading || !authChecked || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todayVisits = visits.filter(v => v.scheduled_date === today);
  const upcomingVisits = visits.filter(v => v.scheduled_date > today);

  return (
    <div className="min-h-screen" style={{ background: "#FFFBF5", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-1px", color: "#0A1F1A" }}>olga</span>
          <span style={{ fontSize: "0.75rem", background: "#FEF3C7", color: "#D97706", padding: "3px 10px", borderRadius: "999px", fontWeight: 600 }}>Proveedor</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={shareLocation}
            disabled={locating}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#fff", background: "#D97706", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: 600 }}
          >
            <Navigation size={14} /> {locating ? "Obteniendo..." : "Compartir ubicación"}
          </button>
          {locMsg && <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 600 }}>{locMsg}</span>}
          <button
            onClick={() => { localStorage.removeItem("auth_token"); router.push("/login"); }}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#64748B", background: "none", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A" }}>Mis Visitas</h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>
            Hoy: <strong>{todayVisits.length}</strong> · Próximas: <strong>{upcomingVisits.length}</strong>
          </p>
        </div>

        {visits.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "48px", textAlign: "center" }}>
            <Clock size={40} color="#CBD5E1" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>No tienes visitas asignadas en los últimos 7 días</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {visits.map((v) => {
              const cfg = STATUS_CONFIG[v.status] ?? { label: v.status, color: "#64748B" };
              const isToday = v.scheduled_date === today;
              return (
                <div
                  key={v.id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    border: `1px solid ${isToday ? cfg.color + "44" : "#E2E8F0"}`,
                    borderLeft: `4px solid ${cfg.color}`,
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <p style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                        {v.patient ? `${v.patient.first_name} ${v.patient.last_name}` : `Visita #${v.id}`}
                      </p>
                      {isToday && <span style={{ fontSize: "0.65rem", background: "#DBEAFE", color: "#2563EB", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>HOY</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#64748B", fontSize: "0.8rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} /> {v.window_start} – {v.window_end}
                      </span>
                      {v.patient?.address && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={12} /> {v.patient.address}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, background: cfg.color + "18", color: cfg.color, padding: "4px 10px", borderRadius: "999px" }}>
                      {cfg.label}
                    </span>
                    {cfg.next && (
                      <button
                        onClick={() => handleStatusUpdate(v)}
                        disabled={updatingId === v.id}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          background: cfg.color,
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          cursor: "pointer",
                          opacity: updatingId === v.id ? 0.6 : 1,
                        }}
                      >
                        {updatingId === v.id ? "..." : cfg.nextLabel}
                      </button>
                    )}
                    {v.status === "completed" && (
                      <CheckCircle size={20} color="#059669" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
