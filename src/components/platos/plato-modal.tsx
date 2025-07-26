"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Categoria, Plato } from "@/lib/generated/prisma"
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { platoSchema } from "@/schemas/platos"; // Ajusta la ruta si es necesario
import { z } from "zod";
import { usePlatosStore } from "@/store/platos"
import { addPlato, updatePlato } from "@/utils/actions-platos"


type PlatoForm = z.infer<typeof platoSchema>;


export default function PlatoModal({ showItemModal, closeModal, item, categorias }: { showItemModal: boolean, closeModal: (show: boolean) => void, item: Plato | null, categorias: Categoria[] }) {
    const [newIngredient, setNewIngredient] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = usePlatosStore()


    const { control, register, handleSubmit, setValue, getValues, reset, watch, formState: { errors }, } = useForm<PlatoForm>({
        resolver: zodResolver(platoSchema),
        defaultValues: {
            nombre: "",
            descripcion: "",
            precio: 0,
            foto: "",
            ingredientes: [],
            categoriaIds: [],
            disponible: true,
        },
    });

    //   useEffect para copiar si hay item a editar
    useEffect(() => {
        if (item) {
            reset({
                nombre: item?.nombre || "",
                descripcion: item?.descripcion || "",
                precio: item?.precio || 0,
                foto: item?.foto || "",
                ingredientes: item?.ingredientes || [],
                categoriaIds: item?.categoriaIds || [],
                disponible: item?.disponible ?? true,
            });
            setIsEditing(true);

        } else {
            reset()
            setIsEditing(false);
        }
    }, [item, reset]);

    const addIngredient = () => {
        if (newIngredient.trim() === "") return;
        setValue("ingredientes", [...getValues("ingredientes"), newIngredient.trim()]);
        setNewIngredient("");
    };

    const removeIngredient = (index: number) => {
        const current = getValues("ingredientes");
        setValue("ingredientes", current.filter((_, i) => i !== index));
    };


    const addItem = async (data: PlatoForm) => {
        const res = await addPlato(data)

        if (res) {
            const newItem = await res.data
            setIsLoading(false)
            dispatch({ type: "ADD_PLATO", payload: newItem })
            closeModal(false)
            reset({
                nombre: "",
                descripcion: "",
                precio: 0,
                foto: "",
                ingredientes: [],
                categoriaIds: [],
                disponible: true,
            });
        } else {
            setIsLoading(false)
            alert("Error al agregar el plato")
        }
    }

    const updateItem = async (data: PlatoForm) => {
        const id = item?.id
        const res = await updatePlato({ ...data, id })

        if (res) {
            const updateItem = await res.data
            dispatch({ type: "UPDATE_PLATO", payload: updateItem })
            setIsLoading(false)
            closeModal(false)
            reset({
                nombre: "",
                descripcion: "",
                precio: 0,
                foto: "",
                ingredientes: [],
                categoriaIds: [],
                disponible: true,
            });
        } else {
            setIsLoading(false)
            alert("Error al actualizar el plato")
        }
    }

    const onSubmit = async (data: PlatoForm) => {
        setIsLoading(true)
        if (isEditing) {
            updateItem(data)
        } else {
            addItem(data)
        }
    };

    const categoriaIds = watch("categoriaIds");

    return (
        <Dialog open={showItemModal} onOpenChange={(open) => {
            reset({
                nombre: "",
                descripcion: "",
                precio: 0,
                foto: "",
                ingredientes: [],
                categoriaIds: [],
                disponible: true,
            });
            closeModal(open);
        }
        } >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Plato" : "Agregar Nuevo Plato"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nombre del Plato</Label>
                            <Input
                                id="name"
                                {...register("nombre")}
                                placeholder="Ej: Hamburguesa Clásica"
                            />
                            {errors.nombre && <span className="text-red-500">{errors.nombre.message}</span>}
                        </div>
                        <div>
                            <Label htmlFor="precio">Precio</Label>
                            <Input
                                id="precio"
                                type="number"
                                step="0.01"
                                {...register("precio", { valueAsNumber: true })}
                                placeholder="0.00"
                            />
                            {errors.precio && <span className="text-red-500">{errors.precio.message}</span>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            {...register("descripcion")}
                            placeholder="Describe el plato..."
                            rows={3}
                        />
                        {errors.descripcion && <span className="text-red-500">{errors.descripcion.message}</span>}
                    </div>

                    <div>
                        <Label>Categorías</Label>
                        <div className="flex flex-wrap gap-2">
                            {categorias.map((category) => (
                                <label key={category.id} className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        value={category.id}
                                        checked={categoriaIds.includes(category.id)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            if (checked) {
                                                setValue("categoriaIds", [...categoriaIds, category.id]);
                                            } else {
                                                setValue("categoriaIds", categoriaIds.filter((id: string) => id !== category.id));
                                            }
                                        }}
                                    />
                                    <span>{category.icon} {category.nombre}</span>
                                </label>
                            ))}
                        </div>
                        {errors.categoriaIds && <span className="text-red-500">{errors.categoriaIds.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Controller
                                control={control}
                                name="disponible"
                                render={({ field }) => (
                                    <Switch
                                        id="disponible"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="disponible">Disponible</Label>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="foto">URL de la Imagen</Label>
                        <Input
                            id="foto"
                            {...register("foto")}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        {errors.foto && <span className="text-red-500">{errors.foto.message}</span>}
                    </div>

                    <div>
                        <Label>Ingredientes</Label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={newIngredient}
                                onChange={(e) => setNewIngredient(e.target.value)}
                                placeholder="Agregar ingrediente"
                                onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                            />
                            <Button type="button" onClick={addIngredient}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {getValues("ingredientes").map((ingredient, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {ingredient}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 hover:bg-transparent"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => {
                            reset({
                                nombre: "",
                                descripcion: "",
                                precio: 0,
                                foto: "",
                                ingredientes: [],
                                categoriaIds: [],
                                disponible: true,
                            });
                            closeModal(false)
                        }}
                            disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button onClick={
                            handleSubmit(onSubmit)
                        }
                            disabled={isLoading}
                            className={`${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}