import type { User, Curso, Seccion } from "./types"

export const usuarios: User[] = [
  {
    id: "1",
    codigo: "22200001",
    nombre: "Sebastian Fernando",
    apellido: "Castillo Layme",
    email: "sebastian.castillo2@unmsm.edu.pe",
    role: "alumno",
    semestre: 7,
    carrera: "Ingeniería de Software",
  },
  {
    id: "2",
    codigo: "DOC001",
    nombre: "María Elena",
    apellido: "Rodríguez López",
    email: "maria.rodriguez@unmsm.edu.pe",
    role: "docente",
  },
]

export const cursos: Curso[] = [
  {
    id: "1",
    codigo: "IS301",
    nombre: "Matemática Discreta",
    creditos: 4,
    ciclo: 4,
    prerequisitos: ["Cálculo II"],
  },
  {
    id: "2",
    codigo: "IS302",
    nombre: "Algoritmos y Estructuras de Datos",
    creditos: 5,
    ciclo: 4,
    prerequisitos: ["Programación II"],
  },
  {
    id: "3",
    codigo: "IS303",
    nombre: "Base de Datos I",
    creditos: 4,
    ciclo: 4,
  },
  {
    id: "4",
    codigo: "IS304",
    nombre: "Ingeniería de Software I",
    creditos: 4,
    ciclo: 4,
  },
]

export const secciones: Seccion[] = [
  {
    id: "1",
    cursoId: "1",
    numero: 1,
    profesorId: "2",
    profesorNombre: "María Elena Rodríguez",
    horario: [
      { dia: "lunes", horaInicio: "08:00", horaFin: "10:00", aula: "A-101" },
      { dia: "miercoles", horaInicio: "08:00", horaFin: "10:00", aula: "A-101" },
    ],
    capacidad: 30,
    matriculados: 25,
  },
  {
    id: "2",
    cursoId: "1",
    numero: 2,
    profesorId: "2",
    profesorNombre: "María Elena Rodríguez",
    horario: [
      { dia: "martes", horaInicio: "14:00", horaFin: "16:00", aula: "B-201" },
      { dia: "jueves", horaInicio: "14:00", horaFin: "16:00", aula: "B-201" },
    ],
    capacidad: 30,
    matriculados: 28,
  },
  {
    id: "3",
    cursoId: "2",
    numero: 1,
    profesorId: "2",
    profesorNombre: "María Elena Rodríguez",
    horario: [
      { dia: "lunes", horaInicio: "10:00", horaFin: "12:00", aula: "C-301" },
      { dia: "miercoles", horaInicio: "10:00", horaFin: "12:00", aula: "C-301" },
      { dia: "viernes", horaInicio: "08:00", horaFin: "10:00", aula: "C-301" },
    ],
    capacidad: 25,
    matriculados: 20,
  },
]

export const getSemestreActual = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const periodo = month <= 7 ? 1 : 2
  return `${year}-${periodo}`
}

export const horasDisponibles = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
]

export const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"] as const

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}
