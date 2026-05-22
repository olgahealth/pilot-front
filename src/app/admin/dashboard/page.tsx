import RoleDashboard from "@/features/auth/RoleDashboard";

export const metadata = { title: "Admin OLGA — Dashboard" };

export default function AdminDashboard() {
  return <RoleDashboard requiredRole="admin_olga" />;
}
