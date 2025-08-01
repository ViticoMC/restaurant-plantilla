"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoginModal from "@/components/login-modal"
import { mockData } from "@/lib/mock-data"
import { Plato } from "@/lib/generated/prisma"
import { useRouter } from "next/navigation"
import { useGetPlatos } from "@/hooks/get-platos"
import useGetCategorias from "@/hooks/get-categorias"
import useGetAdmin from "@/hooks/get-admin"



export default function RestaurantMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<Plato | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()

  const { restaurant } = mockData

  const { platos, error, isLoading } = useGetPlatos()
  const { categorias, error: errorCategorias, isLoading: isLoadingCategorias } = useGetCategorias()
  const { admin } = useGetAdmin()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const filteredItems = platos.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoriaIds.includes(selectedCategory)
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch && item.disponible
  })


  if (isLoading && isLoadingCategorias) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (error || errorCategorias) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Ha ocurrido un error</p>
          <Button onClick={() => router.refresh()} >Refrescar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className={`relative transition-all duration-500 h-screen ${isScrolled ? "opacity-45" : "opacity-100"}`}>
        <div className="absolute inset-0">
          <Image
            src="/portada.webp"
            alt="Restaurant Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Admin Login Button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white"
          onClick={() => setShowLoginModal(true)}
        >
          <User className="w-4 h-4 mr-2" />
          Admin
        </Button>
        {
          admin && <Button
            variant="outline"
            size="sm"
            className="absolute top-16 right-4 z-50 bg-white/90 hover:bg-white"
            onClick={() => router.push("/admin")}
          >
            <User className="w-4 h-4 mr-2" />
            Panel Administrativo
          </Button>
        }

        <div
          className={`relative z-10 flex flex-col items-center justify-center h-full text-white transition-all duration-500 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-center">{restaurant.name}</h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">{restaurant.slogan}</p>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            Ver Menú
          </Button>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div
        className={`sticky top-0 z-40 bg-white border-b transition-all duration-500 ${isScrolled || filteredItems.length === 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
          }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-orange-600">{restaurant.name}</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar platos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="whitespace-nowrap"
            >
              Todas las categorías
            </Button>
            {categorias.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.icon} {category.nombre}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-48">
                <Image
                  src={item.foto || "/placeholder.svg"}
                  alt={item.nombre}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.nombre}</h3>
                  <span className="text-lg font-bold text-orange-600">${item.precio}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.descripcion}</p>
                {item.ingredientes && (
                  <div className="flex flex-wrap gap-1">
                    {item.ingredientes.slice(0, 3).map((ingredient, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                    {item.ingredientes.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.ingredientes.length - 3} más
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron platos</p>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedItem.nombre}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-80">
                  <Image
                    src={selectedItem.foto || "/placeholder.svg"}
                    alt={selectedItem.nombre}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-orange-600">${selectedItem.precio}</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Disponible
                    </Badge>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{selectedItem.descripcion}</p>

                  {selectedItem.ingredientes && (
                    <div>
                      <h4 className="font-semibold mb-2">Ingredientes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.ingredientes.map((ingredient, index) => (
                          <Badge key={index} variant="secondary">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div >
  )
}
