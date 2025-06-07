"use client"

import React from "react"
import { getCurrentUser, getSemestreActual } from "@/lib/data"

export function HorarioCalendar() {
  const user = getCurrentUser()
  const semestre = getSemestreActual()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Horario</h1>
          <p className="text-muted-foreground">
            Ciclo {semestre} - {user.role === "alumno" ? "Horario Académico" : "Horario de Clases"}
          </p>
        </div>
        
      </div>

    </div>
  )
}
