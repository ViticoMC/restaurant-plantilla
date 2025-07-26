"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

import { Categoria } from "@/lib/generated/prisma"
import { useEffect, useState } from "react"
import { useCategoriasStore } from "@/store/categorias"


export default function CategoryModal({ showCategoryModal, closeModal, editingCategory }: { showCategoryModal: boolean, closeModal: (show: boolean) => void, editingCategory: Categoria | null }) {
    const [categoryForm, setCategoryForm] = useState<Categoria>({
        id: "",
        nombre: "",
        icon: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const { dispatchCategorias } = useCategoriasStore()

    useEffect(() => {
        if (editingCategory) {
            setCategoryForm(editingCategory)
        }
    }, [editingCategory])

    function saveCategory() {
        setIsLoading(true)
        if (editingCategory) {
            updateCategory()
        } else {
            addCategory()
        }
    }
    async function addCategory() {
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
            setIsLoading(false)
            return
        }
        const newCategory = await response.json()
        console.log(newCategory)
        dispatchCategorias({ type: "ADD_CATEGORIA", payload: newCategory })
        setIsLoading(false)
        closeModal(false)
    }


    async function updateCategory() {
        const response = await fetch(`/api/categorias/${editingCategory?.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryForm),
        })

        if (!response.ok) {
            const error = await response.json()
            console.log(error)
            setIsLoading(false)
            return
        }
        const updatedCategory = await response.json()
        console.log(updatedCategory)
        dispatchCategorias({ type: "UPDATE_CATEGORIA", payload: updatedCategory })
        setIsLoading(false)
        closeModal(false)
    }
    return (
        <Dialog open={showCategoryModal} onOpenChange={(open) => {
            setCategoryForm({
                id: "",
                nombre: "",
                icon: "",
            })
            closeModal(open)
        }
        }>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingCategory ? "Editar Categoría" : "Agregar Nueva Categoría"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="categoryName">Nombre de la Categoría</Label>
                        <Input
                            id="categoryName"
                            value={categoryForm.nombre}
                            onChange={(e) => setCategoryForm((prev) => ({ ...prev, nombre: e.target.value }))}
                            placeholder="Ej: Desayunos"
                        />
                    </div>

                    <div>
                        <Label htmlFor="categoryIcon">Icono (Emoji)</Label>
                        <Input
                            id="categoryIcon"
                            value={categoryForm.icon}
                            onChange={(e) => setCategoryForm((prev) => ({ ...prev, icon: e.target.value }))}
                            placeholder="Icono identificador"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => {
                            setCategoryForm({
                                id: "",
                                nombre: "",
                                icon: "",
                            })
                            closeModal(false)
                        }}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={saveCategory} disabled={isLoading}
                            className={`${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


