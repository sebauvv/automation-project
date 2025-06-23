"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSemestreActual } from "@/lib/data"
import type { Curso, Seccion } from "@/lib/types"
import { Edit } from "lucide-react"
import MatriculaContent from "./matricula-content"

interface MatriculaItem {
  curso: Curso
  seccionSeleccionada: Seccion
  matricular: boolean
}

export function MatriculaForm() {
  const [modoEdicion, setModoEdicion] = useState(false)
  const semestre = getSemestreActual()
  const [isMatriculaRegistered, setIsMatriculaRegistered] = useState(false)
  const [isMatriculaGoingOn, setIsMatriculaGoingOn] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold tracking-tight text-center text-blue-800">Información de Matrícula</h1>
      <div className="flex items-center justify-between">
        {/* <div className="flex gap-2">
          <Button variant="outline" onClick={() => setModoEdicion(!modoEdicion)}>
            <Edit className="h-4 w-4 mr-2" />
            {modoEdicion ? "Cancelar Edición" : "Editar Manualmente"}
          </Button>
        </div> */}
      </div>
      { 
        isMatriculaGoingOn ? (
          <MatriculaContent />
        ) : (
          <div>
            {
              <div>
                <div className="flex gap-4 mt-4">
                  {/* queria acabar rapido */}
                  <div className="bg-white p-6 rounded-xl w-2/3">
                    <h2 className="text-xl font-medium mb-4">Información importante acerca del módulo de Matrícula Vía Web</h2>
                    <ol className="space-y-3 text-[16px]">
                      <li>
                        <span className="font-bold">1. Control de Cronograma de Matrícula</span><br />
                        <p className="text-indigo-500 text-sm pb-3">Verificación de Fechas de Inicio y Fin de Matrícula del Período Vigente y de Acceso al Módulo de Matrícula.</p>
                      </li>
                      <li>
                        <span className="font-bold">2. Control de Acceso de Facultad</span><br />
                        <p className="text-indigo-500 text-sm pb-3">Verificación de la Programación Interna establecida por la Oficina de Matrícula de su Facultad.</p>
                      </li>
                      <li>
                        <span className="font-bold">3. Control de Pre-Matrícula</span><br />
                        <p className="text-indigo-500 text-sm pb-3">Verificación del Registro de Pre-Matrícula el cual debe haber sido procesado por la Oficina de Matrícula de su Facultad. De no existir debe acercarse a la Oficina de Matrícula personalmente.</p>
                      </li>
                      <li>
                        <span className="font-bold">4. Control de Deudas Registradas</span><br />
                        <p className="text-indigo-500 text-sm pb-3">Verificación de registros de deudas de dinero o de material bibliográfico. Esta información nos la remite la Oficina de Matrícula de su facultad. De registrar deudas pendientes debe acercarse personalmente a la Oficina de Matrícula de su Facultad.</p>
                      </li>
                      <li>
                        <span className="font-bold">5. Interfaz de Matrícula</span><br />
                        <p className="text-indigo-500 text-sm pb-3">Presentación de Asignaturas de Pre-Matrícula y secciones abiertas. <span className="font-bold text-blue-700">Efectuar Matrícula</span> registrará su matrícula. Si la Matrícula se efectúa <span className="font-bold text-blue-700">satisfactoriamente</span>, se mostrará automáticamente el Reporte de Matrícula vigente, de lo contrario mostrará un error.</p>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-white p-6 rounded-xl w-1/3 h-2/3">
                    {
                      isMatriculaRegistered ? (
                        <div className="bg-red-100 p-4 rounded-xl text-red-900 font-semibold text-sm text-center mb-5">MATRICULA INTERNET INHABILITADA</div>
                      ) : (
                        <div className="bg-green-100 p-4 rounded-xl text-green-900 font-semibold text-sm text-center mb-5">MATRICULA INTERNET HABILITADA</div>
                      )
                    }

                    <div className="flex gap-4 text-sm justify-between mb-5">
                      <div className="bg-purple-100 p-4 rounded-xl w-1/2">
                        <p className="font-semibold">Periodo Academico</p>
                        <p className="text-purple-700">{semestre}</p>
                      </div>
                      <div className="bg-purple-100 p-4 rounded-xl w-1/2">
                        <p className="font-semibold">Fecha del Sistema</p>
                        <p className="text-purple-700">
                        {new Date().toLocaleString("es-PE", {
                          timeZone: "America/Lima",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                        </p>
                      </div>
                    </div>
                    {
                      isMatriculaRegistered ? (
                        <div className="bg-green-100 p-4 rounded-xl text-green-900 font-semibold text-sm text-center mb-5">Usted registra matrícula en el presente semestre</div>
                      ) : (
                        <button 
                          className="bg-yellow-100 p-4 rounded-xl text-yellow-900 font-semibold text-sm text-center mb-5 w-full hover:bg-yellow-200 transition-colors duration-300"
                          onClick={() => {
                            setIsMatriculaGoingOn(true);
                          }}
                        >Iniciar Matrícula</button>
                      )
                    }
                  
                  </div>
                </div>
              </div>
              
            }
          </div>
        )
      }
    </div>
  )
}
