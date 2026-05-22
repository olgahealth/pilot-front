import DashboardPage from "@/features/dashboard/DashboardPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = { title: "EPS — Dashboard Operaciones" };

export default function EpsDashboard() {
  return (
    <PagadorLayout>
      <DashboardPage />
    </PagadorLayout>
  );
}
