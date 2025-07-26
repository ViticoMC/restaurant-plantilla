import { z } from "zod";

export const platoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  // foto: z.string().url("Debe ser una URL válida"),
  foto: z.string(),
  ingredientes: z.array(z.string()).min(1, "Agrega al menos un ingrediente"),
  categoriaIds: z.array(z.string()).min(1, "Selecciona una categoría"),
  disponible: z.boolean(),
});