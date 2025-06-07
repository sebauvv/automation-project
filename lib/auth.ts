"use client"

import type { User } from "./types"
import { usuarios } from "./data"

export const login = (codigo: string, password: string): User | null => {
  // llamada al backend luego
  const user = usuarios.find((u) => u.codigo === codigo)
  if (user && password === "123456") {
    // Password fijo para demo (localstorage)
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }
  return null
}

export const logout = () => {
  localStorage.removeItem("currentUser")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}
