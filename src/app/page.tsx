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

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Información del Restaurante */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-orange-500">{restaurant.name}</h3>
              <p className="text-gray-300 leading-relaxed">{restaurant.slogan}</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-500">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">info@restaurante.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">123 Calle Principal, Ciudad</span>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-500">Horarios</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Lunes - Viernes</span>
                  <span>11:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span>12:00 - 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos</span>
                  <span>12:00 - 21:00</span>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between text-orange-500 font-semibold">
                    <span>Días festivos</span>
                    <span>12:00 - 22:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            {/* <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-500">Newsletter</h4>
              <p className="text-gray-300 text-sm">Suscríbete para recibir ofertas especiales y novedades</p>
              <div className="space-y-2">
                <Input
                  placeholder="Tu email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                />
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Suscribirse
                </Button>
              </div>
            </div> */}
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 {restaurant.name}. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Política de Privacidad</a>
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Términos de Servicio</a>
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Mapa del Sitio</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}
