"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/lib/auth"

export function LoginForm() {
  const [codigo, setCodigo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    //const user = login(codigo, password)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(
        `${apiUrl}/student/code/${codigo}/info`
      )

      if (response.ok) {
        const data = await response.json()
        const userId = data.id
        const userRole = data.role
        // Guardar en localstoarge el user role
        localStorage.setItem("userRole", userRole)
        
        // No validacion de contraseña btw
        const user = await login(codigo, "123456", userId)
        if (user) {
          router.push("/dashboard")
        } else {
          setError("Código o contraseña incorrectos")
        }
      } else {
        setError("Código o contraseña incorrectos")
      }
    } catch (err) {
        setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">Sistema de Horarios</CardTitle>
          <CardDescription>Universidad Nacional Mayor de San Marcos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Usuario</Label>
              <Input
                id="codigo"
                type="text"
                placeholder="Ej: 22200001 o DOC001"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          
        </CardContent>
      </Card>
    </div>
  )
}
