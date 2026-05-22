"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ClipboardList, CheckCircle2, Clock, AlertCircle, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { api, type ManagementPlan, type Visit, type PaginatedResponse } from "@/lib/api";

const VISIT_STATUS: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  scheduled:         { label: "Programada",  color: "#6366F1", icon: Clock        },
  provider_en_route: { label: "En camino",   color: "#F59E0B", icon: Clock        },
  in_progress:       { label: "En curso",    color: "#10B981", icon: Clock        },
  completed:         { label: "Completada",  color: "#059669", icon: CheckCircle2 },
  cancelled:         { label: "Cancelada",   color: "#EF4444", icon: AlertCircle  },
};

export default function PacienteDashboard() {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();

  const [plan, setPlan]         = useState<ManagementPlan | null>(null);
  const [visits, setVisits]     = useState<PaginatedResponse<Visit> | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authChecked) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "paciente" && user.role !== "admin_olga") {
      router.replace(`/${user.role}/dashboard`);
      return;
    }

    Promise.all([
      api.paciente.myPlan(),
      api.paciente.myVisits(),
    ])
      .then(([p, v]) => { setPlan(p); setVisits(v); })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user, authChecked, router]);

  if (loading || !authChecked || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F0FDF4" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const allVisits = visits?.data ?? [];
  const upcomingVisits = allVisits.filter(v => v.scheduled_date >= today && v.status !== "cancelled");
  const pastVisits = allVisits.filter(v => v.scheduled_date < today || v.status === "completed");

  const totalTasks = plan?.tasks?.reduce((s, t) => s + t.total_sessions, 0) ?? 0;
  const completedTasks = plan?.tasks?.reduce((s, t) => s + t.completed_sessions, 0) ?? 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#F0FDF4", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #D1FAE5", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-1px", color: "#0A1F1A" }}>olga</span>
          <span style={{ fontSize: "0.75rem", background: "#D1FAE5", color: "#059669", padding: "3px 10px", borderRadius: "999px", fontWeight: 600 }}>Paciente</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748B" }}>{user?.name}</span>
          <button
            onClick={() => { localStorage.removeItem("auth_token"); router.push("/login"); }}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#64748B", background: "none", border: "1px solid #D1FAE5", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0F172A", marginBottom: "24px" }}>
          Hola, {user?.name} 👋
        </h1>

        {/* Plan activo */}
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #D1FAE5", padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <ClipboardList size={18} color="#059669" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Mi Plan de Manejo</h2>
          </div>

          {!plan ? (
            <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>No tienes un plan activo asignado por tu médico.</p>
          ) : (
            <>
              <p style={{ fontWeight: 600, color: "#0F172A", marginBottom: "4px" }}>{plan.title}</p>
              <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "16px" }}>{plan.diagnosis}</p>

              {/* Barra de progreso */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748B", marginBottom: "6px" }}>
                  <span>Progreso</span>
                  <span>{completedTasks}/{totalTasks} sesiones</span>
                </div>
                <div style={{ background: "#F1F5F9", borderRadius: "999px", height: "8px" }}>
                  <div style={{ background: "#059669", borderRadius: "999px", height: "8px", width: `${progress}%`, transition: "width 0.5s" }} />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700, marginTop: "4px", textAlign: "right" }}>{progress}%</p>
              </div>

              {/* Tareas */}
              {plan.tasks && plan.tasks.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {plan.tasks.map(task => (
                    <div key={task.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F8FAFC", borderRadius: "10px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#374151" }}>{task.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{task.completed_sessions}/{task.total_sessions} sesiones</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Próximas visitas */}
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #D1FAE5", padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Calendar size={18} color="#059669" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Próximas visitas</h2>
          </div>

          {upcomingVisits.length === 0 ? (
            <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>No tienes visitas programadas próximamente.</p>
          ) : upcomingVisits.slice(0, 5).map(v => {
            const isToday = v.scheduled_date === today;
            return (
              <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A" }}>
                    {isToday ? "Hoy" : new Date(v.scheduled_date).toLocaleDateString("es-CO", { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#64748B" }}>{v.window_start} – {v.window_end}</p>
                  {v.provider?.user?.name && (
                    <p style={{ fontSize: "0.75rem", color: "#94A3B8" }}>con {v.provider.user.name}</p>
                  )}
                </div>
                <span style={{ fontSize: "0.7rem", background: "#D1FAE5", color: "#059669", padding: "3px 8px", borderRadius: "999px", fontWeight: 700 }}>
                  {isToday ? "HOY" : "Próxima"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Historial */}
        {pastVisits.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>Historial reciente</h2>
            {pastVisits.slice(0, 4).map(v => {
              const cfg = VISIT_STATUS[v.status] ?? { label: v.status, color: "#64748B", icon: Clock };
              const Icon = cfg.icon;
              return (
                <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #F8FAFC" }}>
                  <Icon size={16} color={cfg.color} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.85rem", color: "#374151" }}>
                      {new Date(v.scheduled_date).toLocaleDateString("es-CO", { month: "short", day: "numeric" })} · {v.window_start}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
