"use client"
import { useEffect, useState } from "react"
import DisponibilidadForm from "@/components/disponibilidad/disponibilidad-form"
import DisponibilidadFormProfesor from "@/components/disponibilidad/disponiblidad-form-profesor"

export default function DisponibilidadClient() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    setCurrentUserId(currentUser ? JSON.parse(currentUser).id : null)
    setUserRole(localStorage.getItem("userRole"))
  }, [])

  if (!userRole) return null

  return userRole === "Teacher" ? (
    <DisponibilidadFormProfesor teacherId={currentUserId!} />
  ) : (
    <DisponibilidadForm />
  )
}