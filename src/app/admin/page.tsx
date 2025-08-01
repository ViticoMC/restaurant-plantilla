"use client"

import { useRouter } from "next/navigation"
import { LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useGetAdmin from "@/hooks/get-admin"
import Platos from "@/components/platos/platos"
import Categorias from "@/components/categorias/categorias"
import { api } from "@/lib/api"

export default function AdminPanel() {
  const { admin, isLoading } = useGetAdmin()
  const router = useRouter()

  const handleLogout = async () => {
    const res = await api.post("/auth/logout")
    if (res.status === 200) {
      router.push("/")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del panel de administracion */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Panel de Administración</h1>
          <div className="md:flex-row flex-col flex gap-2">
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Menú
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList>
            <TabsTrigger value="items">Platos del Menú</TabsTrigger>
            <TabsTrigger value="categorias">Categorías</TabsTrigger>
          </TabsList>
          <Platos />
          <Categorias />
        </Tabs>
      </div>
    </div>
  )
}
