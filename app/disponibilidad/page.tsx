import DisponibilidadClient from "@/components/disponibilidad/disponibilidad-client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DisponibilidadPage() {
  return (
    <DashboardLayout>
      <DisponibilidadClient />
    </DashboardLayout>
  )
}