import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Categoria } from "@/lib/generated/prisma";

export default function CategoriasCard({ category, openCategoryModal }: { category: Categoria, openCategoryModal: (category: Categoria) => void }) {

    async function deleteCategory(id: string) {
        try {
            const response = await fetch(`/api/categorias/${id}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                const error = await response.json()
                console.log(error)
                return
            }
            const deletedCategory = await response.json()
            console.log(deletedCategory)
        } catch (error) {
            console.error("Error al eliminar categoria:", error)
        }
    }

    return (
        <Card >
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-medium">{category.nombre}</span>
                    </div>
                    <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => openCategoryModal(category)}>
                            <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteCategory(category.id)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
                {/* <p className="text-sm text-gray-500">
                  {platos.filter((item) => item.categoriaIds.include(category.id)).length} platos
                </p> */}
            </CardContent>
        </Card>
    )
}