import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { HorarioCalendar } from "@/components/horario/horario-calendar"

export default function HorarioPage() {
  return (
    <DashboardLayout>
      <HorarioCalendar />
    </DashboardLayout>
  )
}
