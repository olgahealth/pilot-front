import AdminDashboardPage from "@/features/admin/AdminDashboardPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = { title: "Sala de control — OLGA Admin" };

export default function Page() {
  return (
    <PagadorLayout>
      <AdminDashboardPage />
    </PagadorLayout>
  );
}
