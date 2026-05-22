"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Calendar, ClipboardList, ArrowUpRight, Activity, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { api, type Patient, type Visit, type ManagementPlan, type PaginatedResponse } from "@/lib/api";

const STATUS_VISIT: Record<string, { label: string; color: string }> = {
  scheduled:         { label: "Programada",  color: "#6366F1" },
  provider_en_route: { label: "En camino",   color: "#F59E0B" },
  in_progress:       { label: "En curso",    color: "#10B981" },
  completed:         { label: "Completada",  color: "#059669" },
  cancelled:         { label: "Cancelada",   color: "#EF4444" },
  no_show:           { label: "No asistió",  color: "#9CA3AF" },
};

export default function HospitalDashboard() {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();

  const [patients, setPatients]   = useState<PaginatedResponse<Patient> | null>(null);
  const [visits, setVisits]       = useState<PaginatedResponse<Visit> | null>(null);
  const [plans, setPlans]         = useState<PaginatedResponse<ManagementPlan> | null>(null);
  const [fetching, setFetching]   = useState(true);

  useEffect(() => {
    if (!authChecked) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "hospital" && user.role !== "admin_olga") {
      router.replace(`/${user.role}/dashboard`);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      api.patients.list("per_page=5"),
      api.visits.list(`date=${today}&per_page=10`),
      api.plans.list(),
    ])
      .then(([p, v, pl]) => { setPatients(p); setVisits(v); setPlans(pl); })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user, authChecked, router]);

  if (loading || !authChecked || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const todayVisits = visits?.data ?? [];
  const recentPatients = patients?.data ?? [];
  const activePlans = (plans?.data ?? []).filter(p => p.status === "active").length;

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-1px", color: "#0A1F1A" }}>olga</span>
          <span style={{ fontSize: "0.75rem", background: "#EEF2FF", color: "#4F46E5", padding: "3px 10px", borderRadius: "999px", fontWeight: 600 }}>Hospital</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748B" }}>{user?.name}</span>
          <button
            onClick={() => { localStorage.removeItem("auth_token"); router.push("/login"); }}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#64748B", background: "none", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", marginBottom: "24px" }}>
          Panel Hospital
        </h1>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { icon: Users,         label: "Pacientes registrados", value: patients?.total ?? "—",  color: "#4F46E5", bg: "#EEF2FF" },
            { icon: ClipboardList, label: "Planes activos",        value: activePlans,              color: "#059669", bg: "#ECFDF5" },
            { icon: Calendar,      label: "Visitas hoy",           value: todayVisits.length,       color: "#D97706", bg: "#FFFBEB" },
            { icon: Activity,      label: "Planes totales",        value: plans?.total ?? "—",      color: "#7C3AED", bg: "#F5F3FF" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={color} />
                </div>
              </div>
              <p style={{ fontSize: "2rem", fontWeight: 700, color: "#0F172A", marginTop: "12px" }}>{value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Visitas de hoy */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>Visitas de hoy</h2>
              <Link href="/visits" style={{ fontSize: "0.75rem", color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>Ver todas</Link>
            </div>
            <div style={{ padding: "8px 0" }}>
              {todayVisits.length === 0 ? (
                <p style={{ padding: "24px", textAlign: "center", color: "#94A3B8", fontSize: "0.85rem" }}>Sin visitas programadas para hoy</p>
              ) : todayVisits.map((v) => {
                const st = STATUS_VISIT[v.status] ?? { label: v.status, color: "#64748B" };
                return (
                  <div key={v.id} style={{ padding: "12px 24px", borderBottom: "1px solid #F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A" }}>
                        {v.patient ? `${v.patient.first_name} ${v.patient.last_name}` : `Visita #${v.id}`}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#64748B" }}>{v.window_start} – {v.window_end}</p>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, background: st.color + "18", color: st.color, padding: "3px 8px", borderRadius: "999px" }}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pacientes recientes */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>Pacientes recientes</h2>
              <Link href="/patients" style={{ fontSize: "0.75rem", color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>Ver todos</Link>
            </div>
            <div style={{ padding: "8px 0" }}>
              {recentPatients.length === 0 ? (
                <p style={{ padding: "24px", textAlign: "center", color: "#94A3B8", fontSize: "0.85rem" }}>Sin pacientes registrados aún</p>
              ) : recentPatients.map((p) => (
                <div key={p.id} style={{ padding: "12px 24px", borderBottom: "1px solid #F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A" }}>{p.first_name} {p.last_name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#64748B" }}>{p.document_type} {p.document_number}</p>
                  </div>
                  <ArrowUpRight size={16} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
