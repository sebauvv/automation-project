"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser, getSemestreActual } from "@/lib/data"
import { Calendar, Clock, GraduationCap, BookOpen, User, Award } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const alumnoFeatures = [
  {
    title: "Disponibilidad",
    description: "Configura tu disponibilidad horaria semanal",
    icon: Clock,
    href: "/disponibilidad",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Matrícula",
    description: "Matricúlate en los cursos disponibles",
    icon: GraduationCap,
    href: "/matricula",
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Mi Horario",
    description: "Visualiza tu horario académico",
    icon: Calendar,
    href: "/horario",
    color: "bg-purple-50 text-purple-600",
  },
]

const docenteFeatures = [
  {
    title: "Disponibilidad",
    description: "Configura tu disponibilidad y asigna horarios",
    icon: Clock,
    href: "/disponibilidad",
    color: "bg-blue-50 text-blue-600",
  },
  // {
  //   title: "Mis Cursos",
  //   description: "Gestiona los cursos asignados",
  //   icon: BookOpen,
  //   href: "/cursos",
  //   color: "bg-orange-50 text-orange-600",
  // },
  {
    title: "Mi Horario",
    description: "Visualiza y gestiona tu horario",
    icon: Calendar,
    href: "/horario",
    color: "bg-purple-50 text-purple-600",
  },
]

export function DashboardContent() {
  const user = getCurrentUser()
  const semestre = getSemestreActual()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  const [userRole, setUserRole] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [enrollmentInfo, setEnrollmentInfo] = useState<{ cursos_matriculados: number; creditos_totales: number } | null>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    setCurrentUserId(currentUser ? JSON.parse(currentUser).id : null)
    setUserRole(localStorage.getItem("userRole"))

    if (user?.role === "alumno") {
      fetch(`${apiUrl}/student/${currentUserId}/info`)
        .then((res) => res.json())
        .then((data) => setEnrollmentInfo({
          cursos_matriculados: data.cursos_matriculados,
          creditos_totales: data.creditos_totales
        }))
        .catch(() => setEnrollmentInfo({ cursos_matriculados: 0, creditos_totales: 0 }))
    }
  }, [user])


  if (!user) return null

  const features = user.role === "alumno" ? alumnoFeatures : docenteFeatures

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {user.nombre}</h1>
          <p className="text-muted-foreground">Semestre Académico {semestre}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Información del Usuario */}
        <Card className="md:col-span-2 lg:col-span-1 md:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Código</p>
              <p className="text-lg font-semibold">{user.codigo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
              <p className="text-lg">
                {user.nombre} {user.apellido}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{user.email}</p>
            </div>
            {user.role === "alumno" && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Carrera</p>
                  <p className="text-sm">{user.carrera}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ciclo</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {user.semestre}° Ciclo
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-[#3d5a80]">
                <Link href={feature.href}>Acceder</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semestre Actual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semestre}</div>
          </CardContent>
        </Card>

        {user.role === "alumno" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos Matriculados</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {enrollmentInfo ? enrollmentInfo.cursos_matriculados : "—"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Créditos Totales</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {enrollmentInfo ? enrollmentInfo.creditos_totales : "—"}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === "docente" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos Asignados</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
