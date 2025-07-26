"use client"
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import PlatosCard from "./platos-card";
import { useGetPlatos } from "@/hooks/hooks-platos";
import { useState } from "react";
import { Plato } from "@/lib/generated/prisma";
import PlatoModal from "./plato-modal";
import useGetCategorias from "@/hooks/get-categorias";

export default function Platos() {

    const { platos } = useGetPlatos()
    const { categorias } = useGetCategorias()
    const [showItemModal, setShowItemModal] = useState(false)
    const [editingItem, setEditingItem] = useState<Plato | null>(null)

    const openItemModal = (item?: Plato) => {
        setEditingItem(item || null)
        setShowItemModal(true)
    }

    const closeItemModal = (open: boolean) => {
        setShowItemModal(open)
        setEditingItem(null)
    }

    return (
        <TabsContent value="items" className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gestión de Platos</h2>
                <Button onClick={() => openItemModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Plato
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platos.map((item: Plato) => (
                    <PlatosCard key={item.id} item={item} openItemModal={openItemModal} />
                ))}
            </div>
            <PlatoModal showItemModal={showItemModal} closeModal={closeItemModal} item={editingItem} categorias={categorias} />
        </TabsContent>
    )
}