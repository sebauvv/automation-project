"use client"

import type { User } from "./types"
//import { usuarios } from "./data" fake data

function translateRole(role: string): "alumno" | "docente" {
  if (role === "Student" || role === "student") return "alumno"
  if (role === "Teacher" || role === "teacher") return "docente"
  return role as "alumno" | "docente"
}

function mapApiUserToUser(apiUser: any, userId: any): User {
  const userRole = translateRole(localStorage.getItem("userRole")!)
  let nombre = ""
  let apellido = ""
  if (apiUser.full_name) {
    const parts = apiUser.full_name.trim().split(" ")
    nombre = parts.slice(0, 2).join(" ")
    apellido = parts.slice(2).join(" ")
  }

  return {
    id: userId, 
    codigo: apiUser.code,
    nombre,
    apellido,
    email: apiUser.email,
    role: userRole, // :,v
    semestre: 7,
    carrera: apiUser.specialty,
  }
}

export const login = async (codigo: string, password: string, userId: any): Promise<User | null> => {
  // Obtener data de usuario por userId
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  try {
    const response = await fetch(`${apiUrl}/student/${userId}/info`)

    if (!response.ok) return null
    const apiUser = await response.json()

    // No preguntar
    const user = mapApiUserToUser(apiUser, userId)
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  } catch {
    return null
  }

  // const user = usuarios.find((u) => u.codigo === codigo)
  // if (user && password === "123456") {
  //   // Password fijo para demo (localstorage)
  //   localStorage.setItem("currentUser", JSON.stringify(user))
  //   return user
  // }
  // return null
}

export const logout = () => {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("userRole")
  localStorage.removeItem("userId")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}
