"use client"

import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Categoria } from "@/lib/generated/prisma";
import { api } from "@/lib/api";
import { useGetPlatos } from "@/hooks/get-platos";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useCategoriasStore } from "@/store/categorias";

export default function CategoriasCard({ category, openCategoryModal }: { category: Categoria, openCategoryModal: (category: Categoria) => void }) {
    const { platos } = useGetPlatos()
    const [error, setError] = useState("")
    const [openConfirm, setOpenConfirm] = useState(false)
    const id = category.id
    const { categorias, dispatchCategorias } = useCategoriasStore()

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(""), 10000)
        return () => clearTimeout(timer)
    }, [error])




    async function deleteCategory(id: string) {
        setError("")
        // Verificar si la categoría está en uso
        const usada = platos.some((plato) => plato.categoriaIds.includes(category.id))
        if (usada) {
            setError("No se puede borrar la categoría porque está siendo utilizada por al menos un plato.")
            return
        }
        try {
            await api.delete(`/categorias/${id}`)
            // const res = await api.delete(`/categorias/${id}`)
            // const deletedCategory = await res.data()
            dispatchCategorias({ type: "DELETE_CATEGORIA", payload: id })
        } catch (error: any) {
            if (error.response?.data?.error) {
                setError(error.response.data.error)
            } else if (error.response?.status) {
                setError(`Error al eliminar la categoría (código: ${error.response.status})`)
            } else {
                setError("Error al eliminar la categoría")
            }
            console.error("Error al eliminar categoria:", error)
        }
    }

    return (
        <>
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro que deseas borrar esta categoría?</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={() => { setOpenConfirm(false); deleteCategory(id) }}>
                            Borrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Card >
                <CardContent className="p-4">
                    {error && (
                        <div className="mb-2 text-sm text-red-600">{error}</div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{category.icon}</span>
                            <span className="font-medium">{category.nombre}</span>
                        </div>
                        <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => openCategoryModal(category)}>
                                <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setOpenConfirm(true)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                    {/* <p className="text-sm text-gray-500">
                  {platos.filter((item) => item.categoriaIds.include(category.id)).length} platos
                </p> */}
                </CardContent>
            </Card>
        </>
    )
}