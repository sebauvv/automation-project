"use client"

import { Calendar, Clock, GraduationCap, Home, LogOut, BookOpen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const menuItems = {
  alumno: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Disponibilidad", url: "/disponibilidad", icon: Clock },
    { title: "Matrícula", url: "/matricula", icon: GraduationCap },
    { title: "Mi Horario", url: "/horario", icon: Calendar },
  ],
  docente: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Disponibilidad", url: "/disponibilidad", icon: Clock },
    //{ title: "Mis Cursos", url: "/cursos", icon: BookOpen },
    { title: "Mi Horario", url: "/horario", icon: Calendar },
  ],
}

export function AppSidebar() {
  const user = getCurrentUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  const items = menuItems[user.role] || []

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar>
            <AvatarFallback className="bg-blue-100 text-blue-900">
              {user.nombre.charAt(0)}
              {user.apellido.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-xs text-muted-foreground text-gray-300">
              {user.role === "alumno" ? `Semestre ${user.semestre}` : "Docente"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-gray-300">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-black">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
