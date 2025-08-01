"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Save, X, Upload, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Categoria, Plato } from "@/lib/generated/prisma"
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { platoSchema } from "@/schemas/platos";
import { z } from "zod";
import { usePlatosStore } from "@/store/platos"
import { addPlato, updatePlato } from "@/utils/actions-platos"
import {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
    updateImageInCloudinary,
    validateImageFile,
    CloudinaryResponse
} from '@/lib/cloudinary';
import { toast } from 'sonner';

type PlatoForm = z.infer<typeof platoSchema>;

export default function PlatoModal({ showItemModal, closeModal, item, categorias }: { showItemModal: boolean, closeModal: (show: boolean) => void, item: Plato | null, categorias: Categoria[] }) {
    const [newIngredient, setNewIngredient] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
    const [currentPublicId, setCurrentPublicId] = useState<string>("");
    const { dispatch, platos } = usePlatosStore()

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
            setCurrentImageUrl(item?.foto || "");
            // Extraer public_id de la URL si existe
            if (item?.foto) {
                const urlParts = item.foto.split('/');
                const fileName = urlParts[urlParts.length - 1].split('.')[0];
                setCurrentPublicId(`adminpanel/${fileName}`);
            }
            setIsEditing(true);
        } else {
            reset()
            setCurrentImageUrl("");
            setCurrentPublicId("");
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

    // Función para manejar la subida de imágenes
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // Validar archivo
            validateImageFile(file);

            setIsUploadingImage(true);

            let response: CloudinaryResponse;

            if (currentPublicId) {
                // Actualizar imagen existente
                response = await updateImageInCloudinary(file, currentPublicId, 'adminpanel');
                setCurrentPublicId(response.data.public_id);
                toast.success('Imagen actualizada correctamente');
            } else {
                // Subir nueva imagen
                response = await uploadImageToCloudinary(file, 'adminpanel');
                setCurrentPublicId(response.data.public_id);
                toast.success('Imagen subida correctamente');
            }

            // Actualizar el formulario con la nueva URL
            setCurrentImageUrl(response.data.secure_url);
            setValue("foto", response.data.secure_url);

        } catch (error) {
            console.error('Error:', error);
            toast.error(error instanceof Error ? error.message : 'Error al procesar la imagen');
        } finally {
            setIsUploadingImage(false);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    // Función para eliminar imagen
    const handleDeleteImage = async () => {
        if (!currentPublicId) return;

        try {
            setIsUploadingImage(true);
            await deleteImageFromCloudinary(currentPublicId);
            setCurrentImageUrl("");
            setCurrentPublicId("");
            setValue("foto", "");
            toast.success('Imagen eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            toast.error('Error al eliminar la imagen');
        } finally {
            setIsUploadingImage(false);
        }
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
            setCurrentImageUrl("");
            setCurrentPublicId("");
            window.sessionStorage.setItem("platos", JSON.stringify([...platos, newItem]))
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
            setCurrentImageUrl("");
            setCurrentPublicId("");
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
            setCurrentImageUrl("");
            setCurrentPublicId("");
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

                    {/* Sección de imagen */}
                    <div className="space-y-4">
                        <Label>Imagen del Plato</Label>

                        {/* Vista previa de la imagen */}
                        {currentImageUrl && (
                            <div className="relative">
                                <img
                                    src={currentImageUrl}
                                    alt="Vista previa"
                                    className="w-full h-48 object-cover rounded-md border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={handleDeleteImage}
                                    disabled={isUploadingImage}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Input para subir imagen */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploadingImage}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <Label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    {isUploadingImage ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Subiendo imagen...</span>
                                        </>
                                    ) : currentImageUrl ? (
                                        <>
                                            <ImageIcon className="w-5 h-5" />
                                            <span>Cambiar imagen</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            <span>Seleccionar imagen (JPG, PNG, WebP, GIF - máx 10MB)</span>
                                        </>
                                    )}
                                </Label>
                            </div>
                        </div>

                        {/* Información de la imagen */}
                        {currentImageUrl && (
                            <div className="p-3 bg-muted rounded-md">
                                <p className="text-sm font-medium">URL de la imagen:</p>
                                <p className="text-xs text-muted-foreground break-all">
                                    {currentImageUrl}
                                </p>
                            </div>
                        )}
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
                            setCurrentImageUrl("");
                            setCurrentPublicId("");
                            closeModal(false)
                        }}
                            disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button onClick={
                            handleSubmit(onSubmit)
                        }
                            disabled={isLoading || isUploadingImage}
                            className={`${isLoading || isUploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}
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