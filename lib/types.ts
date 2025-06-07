export type UserRole = "alumno" | "docente"

export interface User {
  id: string
  codigo: string
  nombre: string
  apellido: string
  email: string
  role: UserRole
  semestre?: number
  carrera?: string
}

export interface Curso {
  id: string
  codigo: string
  nombre: string
  creditos: number
  ciclo: number
  prerequisitos?: string[]
}

export interface Seccion {
  id: string
  cursoId: string
  numero: number
  profesorId: string
  profesorNombre: string
  horario: HorarioClase[]
  capacidad: number
  matriculados: number
}

export interface HorarioClase {
  dia: DiaSemana
  horaInicio: string
  horaFin: string
  aula: string
}

export interface Disponibilidad {
  dia: DiaSemana
  horaInicio: string
  horaFin: string
}

export interface Matricula {
  id: string
  alumnoId: string
  seccionId: string
  estado: "matriculado" | "pendiente" | "retirado"
  fecha: string
}

export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado"

export interface DisponibilidadSemanal {
  [key: string]: Disponibilidad[]
}
