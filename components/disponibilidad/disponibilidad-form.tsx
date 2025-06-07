"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, getSemestreActual, horasDisponibles, diasSemana } from "@/lib/data"
import type { DisponibilidadSemanal, DiaSemana } from "@/lib/types"
import { Clock, Save, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function DisponibilidadForm() {
  const user = getCurrentUser()
  const semestre = getSemestreActual()
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadSemanal>({})
  const [selectedDay, setSelectedDay] = useState<DiaSemana | null>(null)
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFin, setHoraFin] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Cargar disponibilidad guardada (simulado)
    const savedDisponibilidad = localStorage.getItem(`disponibilidad_${user?.id}_${semestre}`)
    if (savedDisponibilidad) {
      setDisponibilidad(JSON.parse(savedDisponibilidad))
    }
  }, [user?.id, semestre])

  const agregarDisponibilidad = () => {
    if (!selectedDay || !horaInicio || !horaFin) return

    const nuevaDisponibilidad = {
      dia: selectedDay,
      horaInicio,
      horaFin,
    }

    setDisponibilidad((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), nuevaDisponibilidad],
    }))

    setHoraInicio("")
    setHoraFin("")
    setIsDialogOpen(false)
  }

  const eliminarDisponibilidad = (dia: DiaSemana, index: number) => {
    setDisponibilidad((prev) => ({
      ...prev,
      [dia]: prev[dia]?.filter((_, i) => i !== index) || [],
    }))
  }

  const guardarDisponibilidad = () => {
    localStorage.setItem(`disponibilidad_${user?.id}_${semestre}`, JSON.stringify(disponibilidad))
    alert("Disponibilidad guardada correctamente")
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disponibilidad Horaria</h1>
          <p className="text-muted-foreground">Semestre {semestre} - Configure su disponibilidad semanal</p>
        </div>
        <Button onClick={guardarDisponibilidad} className="gap-2 bg-[#3d5a80]">
          <Save className="h-4 w-4" />
          Guardar Disponibilidad
        </Button>
      </div>

      <div className="grid gap-6">
        {diasSemana.map((dia) => (
          <Card key={dia}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {dia}
                </CardTitle>
                <Dialog open={isDialogOpen && selectedDay === dia} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedDay(dia)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Horario
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Disponibilidad - {dia}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Hora Inicio</label>
                          <Select value={horaInicio} onValueChange={setHoraInicio}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {horasDisponibles.slice(0, -1).map((hora) => (
                                <SelectItem key={hora} value={hora}>
                                  {hora}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Hora Fin</label>
                          <Select value={horaFin} onValueChange={setHoraFin}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {horasDisponibles.slice(1).map((hora) => (
                                <SelectItem key={hora} value={hora}>
                                  {hora}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={agregarDisponibilidad} className="w-full">
                        Agregar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {disponibilidad[dia]?.length ? (
                  disponibilidad[dia].map((horario, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <Badge variant="secondary">
                        {horario.horaInicio} - {horario.horaFin}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => eliminarDisponibilidad(dia, index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No hay disponibilidad configurada para este día
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
