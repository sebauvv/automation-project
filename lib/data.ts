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

interface CursoEjemplo {
  id: string
  codigo: string
  nombre: string
  creditos: number
  ciclo: number
  secciones: {
    id: string
    cursoId: string
    numero: number
    profesorId: string
    profesorNombre: string
    capacidad: number
    matriculados: number
    horario: {
      dia: string
      horaInicio: string
      horaFin: string
      aula: string
      tipo: "teoria" | "laboratorio"
    }[]
  }[]
}
export const cursosDisponibles: CursoEjemplo[] = [
  {
    id: '1',
    codigo: '202W0702',
    nombre: 'BASE DE DATOS II',
    creditos: 4,
    ciclo: 7,
    secciones: [
      {
        id: '1',
        cursoId: '1',
        numero: 1,
        profesorId: 'GAMARRA MORENO, JUAN',
        profesorNombre: 'GAMARRA MORENO, JUAN',
        capacidad: 55,
        matriculados: 54,
        horario: [
          { dia: 'martes', horaInicio: '13:00', horaFin: '16:00', aula: 'NP-201', tipo: 'teoria' },
          { dia: 'martes', horaInicio: '16:00', horaFin: '18:00', aula: 'NP-201', tipo: 'laboratorio' }
        ]
      },
      {
        id: '2',
        cursoId: '1',
        numero: 2,
        profesorId: 'TAPIA CARBAJAL, JUAN RICARDO',
        profesorNombre: 'TAPIA CARBAJAL, JUAN RICARDO',
        capacidad: 50,
        matriculados: 41,
        horario: [
          { dia: 'martes', horaInicio: '13:00', horaFin: '16:00', aula: 'NP-203', tipo: 'teoria' },
          { dia: 'martes', horaInicio: '16:00', horaFin: '18:00', aula: 'NP-203', tipo: 'laboratorio' }
        ]
      }
    ]
  },
  {
    id: '2',
    codigo: '202W0703',
    nombre: 'EXPERIENCIA DE USUARIO Y USABILIDAD',
    creditos: 3,
    ciclo: 7,
    secciones: [
      {
        id: '3',
        cursoId: '2',
        numero: 1,
        profesorId: '0A9126 - PETRLIK AZABACHE, IVAN CARLO',
        profesorNombre: '0A9126 - PETRLIK AZABACHE, IVAN CARLO',
        capacidad: 60,
        matriculados: 45,
        horario: [
          { dia: 'jueves', horaInicio: '18:00', horaFin: '20:00', aula: 'NP-102', tipo: 'teoria' },
          { dia: 'jueves', horaInicio: '20:00', horaFin: '22:00', aula: 'NP-102', tipo: 'laboratorio' }
        ]
      },
      {
        id: '4',
        cursoId: '2',
        numero: 2,
        profesorId: '0A0690 - LÓPEZ VILLANUEVA, PABLO EDWIN',
        profesorNombre: '0A0690 - LÓPEZ VILLANUEVA, PABLO EDWIN',
        capacidad: 60,
        matriculados: 40,
        horario: [
          { dia: 'jueves', horaInicio: '18:00', horaFin: '20:00', aula: 'NP-103', tipo: 'teoria' },
          { dia: 'jueves', horaInicio: '20:00', horaFin: '22:00', aula: 'NP-103', tipo: 'laboratorio' }
        ]
      }
    ]
  },
  {
    id: '3',
    codigo: '202W0705',
    nombre: 'INTELIGENCIA ARTIFICIAL',
    creditos: 3,
    ciclo: 7,
    secciones: [
      {
        id: '5',
        cursoId: '3',
        numero: 1,
        profesorId: '0A0307 - MAGUIÑA PÉREZ, ROLANDO ALBERTO',
        profesorNombre: '0A0307 - MAGUIÑA PÉREZ, ROLANDO ALBERTO',
        capacidad: 55,
        matriculados: 39,
        horario: [
          { dia: 'jueves', horaInicio: '14:00', horaFin: '16:00', aula: '103', tipo: 'teoria' },
          { dia: 'jueves', horaInicio: '16:00', horaFin: '18:00', aula: '103', tipo: 'laboratorio' }
        ]
      },
      {
        id: '6',
        cursoId: '3',
        numero: 2,
        profesorId: '0A2067 - GAMARRA MORENO, JUAN',
        profesorNombre: '0A2067 - GAMARRA MORENO, JUAN',
        capacidad: 55,
        matriculados: 54,
        horario: [
          { dia: 'jueves', horaInicio: '14:00', horaFin: '16:00', aula: '209', tipo: 'teoria' },
          { dia: 'jueves', horaInicio: '16:00', horaFin: '18:00', aula: '209', tipo: 'laboratorio' }
        ]
      },
      {
        id: '7',
        cursoId: '3',
        numero: 3,
        profesorId: '44230686 - ARANGO PALOMINO, CLAUDIO',
        profesorNombre: '44230686 - ARANGO PALOMINO, CLAUDIO',
        capacidad: 45,
        matriculados: 11,
        horario: [
          { dia: 'jueves', horaInicio: '14:00', horaFin: '16:00', aula: '--', tipo: 'teoria' },
          { dia: 'jueves', horaInicio: '16:00', horaFin: '18:00', aula: '--', tipo: 'laboratorio' }
        ]
      }
    ]
  },
  {
    id: '4',
    codigo: '202W0706',
    nombre: 'MÉTODOS FORMALES PARA PRUEBAS',
    creditos: 3,
    ciclo: 7,
    secciones: [
      {
        id: '8',
        cursoId: '4',
        numero: 1,
        profesorId: '0A1877 - BARTRA MORE, ARTURO ALEJANDRO',
        profesorNombre: '0A1877 - BARTRA MORE, ARTURO ALEJANDRO',
        capacidad: 47,
        matriculados: 42,
        horario: [
          { dia: 'martes', horaInicio: '18:00', horaFin: '20:00', aula: '109', tipo: 'teoria' },
          { dia: 'martes', horaInicio: '20:00', horaFin: '22:00', aula: '109', tipo: 'laboratorio' }
        ]
      },
      {
        id: '9',
        cursoId: '4',
        numero: 2,
        profesorId: '091081 - ALARCÓN LOAYZA, LUIS ALBERTO',
        profesorNombre: '091081 - ALARCÓN LOAYZA, LUIS ALBERTO',
        capacidad: 40,
        matriculados: 31,
        horario: [
          { dia: 'viernes', horaInicio: '14:00', horaFin: '16:00', aula: '209', tipo: 'teoria' },
          { dia: 'viernes', horaInicio: '16:00', horaFin: '18:00', aula: '209', tipo: 'laboratorio' }
        ]
      },
      {
        id: '10',
        cursoId: '4',
        numero: 3,
        profesorId: '08232375 - DEL MAR ARZOLA, JORGE LUIS',
        profesorNombre: '08232375 - DEL MAR ARZOLA, JORGE LUIS',
        capacidad: 40,
        matriculados: 33,
        horario: [
          { dia: 'martes', horaInicio: '18:00', horaFin: '20:00', aula: '209', tipo: 'teoria' },
          { dia: 'martes', horaInicio: '20:00', horaFin: '22:00', aula: '209', tipo: 'laboratorio' }
        ]
      }
    ]
  },
  {
    id: '5',
    codigo: '202W0801',
    nombre: 'AUTOMATIZACIÓN Y CONTROL DE SOFTWARE',
    creditos: 3,
    ciclo: 8,
    secciones: [
      {
        id: '11',
        cursoId: '5',
        numero: 1,
        profesorId: '44230686 - ARANGO PALOMINO, CLAUDIO',
        profesorNombre: '44230686 - ARANGO PALOMINO, CLAUDIO',
        capacidad: 45,
        matriculados: 44,
        horario: [
          { dia: 'miercoles', horaInicio: '18:00', horaFin: '20:00', aula: '102', tipo: 'teoria' },
          { dia: 'miercoles', horaInicio: '20:00', horaFin: '22:00', aula: '102', tipo: 'laboratorio' }
        ]
      }
    ]
  },
  {
    id: '6',
    codigo: '202W0905',
    nombre: 'GESTIÓN DE RIESGO DEL SOFTWARE',
    creditos: 3,
    ciclo: 9,
    secciones: [
      {
        id: '12',
        cursoId: '6',
        numero: 2,
        profesorId: '0A0690 - LÓPEZ VILLANUEVA, PABLO EDWIN',
        profesorNombre: '0A0690 - LÓPEZ VILLANUEVA, PABLO EDWIN',
        capacidad: 40,
        matriculados: 40,
        horario: [
          { dia: 'lunes', horaInicio: '18:00', horaFin: '20:00', aula: 'NP-105', tipo: 'teoria' },
          { dia: 'lunes', horaInicio: '20:00', horaFin: '22:00', aula: 'NP-105', tipo: 'laboratorio' }
        ]
      }
    ]
  }
];