import BandejaOrdenesPage from "@/features/proveedor/BandejaOrdenesPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = { title: "Bandeja de órdenes — OLGA" };

export default function Page() {
  return <PagadorLayout><BandejaOrdenesPage /></PagadorLayout>;
}
