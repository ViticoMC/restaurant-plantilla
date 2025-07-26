"use client"
import { Plato } from "@/lib/generated/prisma";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCategoriasStore } from "@/store/categorias";
import { deletePlato } from "@/utils/actions-platos";
import { usePlatosStore } from "@/store/platos";

export default function PlatosCard({ item, openItemModal }: { item: Plato, openItemModal: (item: Plato) => void }) {

  const { dispatch } = usePlatosStore()
  const { categorias } = useCategoriasStore()

  async function deleteItem(id: string) {
    const res = await deletePlato(id)
    if (res) {
      dispatch({ type: "DELETE_PLATO", payload: id })
    } else {
      alert("Error al eliminar el plato")
    }
  }

  const myCategories = categorias.filter((cat) => item.categoriaIds.includes(cat.id))


  return (
    <Card >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.nombre}</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openItemModal(item)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => deleteItem(item.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{item.descripcion}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-orange-600">${item.precio}</span>
          <Badge variant={item.disponible ? "default" : "secondary"}>
            {item.disponible ? "Disponible" : "No disponible"}
          </Badge>
        </div>
        <p className="text-xs text-gray-500">
          {
            myCategories.map((cat) => {
              return <Badge key={cat.id} variant="outline">{cat.icon}-{cat.nombre}</Badge>
            })
          }
        </p>
      </CardContent>
    </Card>
  )
}