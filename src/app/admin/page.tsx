"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Save, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useGetAdmin from "@/hooks/get-admin"
import { Categoria } from "@/lib/generated/prisma"
import useGetCategorias from "@/hooks/get-categorias"
import Platos from "@/components/platos/platos"
import Categorias from "@/components/categorias/categorias"

export default function AdminPanel() {
  const { admin, error, isLoading } = useGetAdmin()
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null)
  const router = useRouter()


  const { categorias } = useGetCategorias()





  const [categoryForm, setCategoryForm] = useState({
    nombre: "",
    icon: "🍽️",
  })


  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })
    if (response.ok) {
      router.push("/")
    }
  }



  const openCategoryModal = (category?: Categoria) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        nombre: category.nombre,
        icon: category.icon,
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({
        nombre: "",
        icon: "🍽️",
      })
    }
    setShowCategoryModal(true)
  }


  const saveCategory = async () => {
    if (editingCategory) {
      // setCategories((cats) => cats.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...categoryForm } : cat)))
    } else {
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryForm),
      })

      if (!response.ok) {
        const error = await response.json()
        console.log(error)
        return
      }
      const newCategory = await response.json()
      console.log(newCategory)

    }
    // setShowCategoryModal(false)
  }



  const deleteCategory = (id: string) => {
    // setCategories((cats) => cats.filter((cat) => cat.id !== id))
    // setMenuItems((items) => items.filter((item) => item.categoria !== id))
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
          <div className="flex gap-2">
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
