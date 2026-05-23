import HospitalDashboard from "@/features/hospital/HospitalDashboard";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = { title: "Panel Hospital — OLGA" };

export default function Page() {
  return (
    <PagadorLayout>
      <HospitalDashboard />
    </PagadorLayout>
  );
}
