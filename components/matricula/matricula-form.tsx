"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSemestreActual } from "@/lib/data"
import type { Curso, Seccion } from "@/lib/types"
import { Edit } from "lucide-react"

interface MatriculaItem {
  curso: Curso
  seccionSeleccionada: Seccion
  matricular: boolean
}

export function MatriculaForm() {
  const [modoEdicion, setModoEdicion] = useState(false)
  const semestre = getSemestreActual()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrícula</h1>
          <p className="text-muted-foreground">Ciclo {semestre}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setModoEdicion(!modoEdicion)}>
            <Edit className="h-4 w-4 mr-2" />
            {modoEdicion ? "Cancelar Edición" : "Editar Manualmente"}
          </Button>
        </div>
      </div>

      <div>
        
      </div>

    </div>
  )
}
