"use client"
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { useGetPlatos } from "@/hooks/hooks-platos";
import { Categoria } from "@/lib/generated/prisma";
import useGetCategorias from "@/hooks/get-categorias";
import CategoriasCard from "./categorias-card";
import { useState } from "react";
import CategoryModal from "./category-modal";

export default function Categorias() {

    const { categorias } = useGetCategorias()
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Categoria | null>(null)

    function openCategoryModal(category?: Categoria) {
        setShowCategoryModal(true)
        setEditingCategory(category || null)
    }

    function closeCategoryModal(open: boolean) {
        setShowCategoryModal(open)
        setEditingCategory(null)
    }

    return (
        <TabsContent value="categorias" className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gestión de Categorías</h2>
                <Button onClick={() => openCategoryModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Categoría
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categorias.map((category) => (
                    <CategoriasCard key={category.id} category={category} openCategoryModal={openCategoryModal} />
                ))}
            </div>
            <CategoryModal showCategoryModal={showCategoryModal} closeModal={closeCategoryModal} editingCategory={editingCategory} />
        </TabsContent>
    )
}