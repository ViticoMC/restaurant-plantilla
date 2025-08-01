# Modal de Platos con Cloudinary

El modal de platos ha sido actualizado para integrar completamente con Cloudinary, permitiendo subir, actualizar y eliminar imágenes directamente desde la interfaz.

## Características Implementadas

### ✅ Subida de Imágenes
- **Drag & Drop**: Interfaz intuitiva para seleccionar imágenes
- **Validación automática**: Verifica tipos de archivo y tamaño
- **Formatos soportados**: JPG, PNG, WebP, GIF
- **Límite de tamaño**: 10MB por archivo

### ✅ Vista Previa
- **Vista previa en tiempo real**: Muestra la imagen seleccionada
- **Información de la imagen**: URL y detalles técnicos
- **Botón de eliminación**: Permite eliminar la imagen actual

### ✅ Gestión de Imágenes
- **Actualización**: Reemplaza imágenes existentes
- **Eliminación**: Borra imágenes de Cloudinary
- **Persistencia**: Mantiene referencias para futuras operaciones

## Cómo Funciona

### 1. Subir Nueva Imagen
```typescript
// El usuario selecciona una imagen
// → Se valida el archivo
// → Se sube a Cloudinary
// → Se obtiene la secure_url
// → Se guarda en el formulario
// → Se muestra la vista previa
```

### 2. Actualizar Imagen Existente
```typescript
// El usuario selecciona una nueva imagen
// → Se elimina la imagen anterior de Cloudinary
// → Se sube la nueva imagen
// → Se actualiza la secure_url
// → Se actualiza la vista previa
```

### 3. Eliminar Imagen
```typescript
// El usuario hace clic en el botón X
// → Se elimina la imagen de Cloudinary
// → Se limpia el campo del formulario
// → Se oculta la vista previa
```

## Integración con Base de Datos

### Campo `foto` en el Plato
El campo `foto` del plato ahora almacena la `secure_url` de Cloudinary:

```typescript
// Ejemplo de URL almacenada
"https://res.cloudinary.com/dqthqbwff/image/upload/v1234567890/adminpanel/plato_123.jpg"
```

### Estructura de Datos
```typescript
interface Plato {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  foto: string; // secure_url de Cloudinary
  ingredientes: string[];
  categoriaIds: string[];
  disponible: boolean;
}
```

## Estados del Modal

### Estados de Carga
- **`isUploadingImage`**: Durante la subida de imagen
- **`isLoading`**: Durante el guardado del plato
- **`isEditing`**: Modo edición vs creación

### Estados de Imagen
- **`currentImageUrl`**: URL de la imagen actual
- **`currentPublicId`**: ID público de Cloudinary para operaciones

## Validaciones

### Validación de Archivos
```typescript
// Tipos permitidos
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// Tamaño máximo
const maxSize = 10 * 1024 * 1024; // 10MB
```

### Mensajes de Error
- "Tipo de archivo no permitido"
- "El archivo es demasiado grande"
- "Error al procesar la imagen"

## Notificaciones

### Toast Notifications
- ✅ "Imagen subida correctamente"
- ✅ "Imagen actualizada correctamente"
- ✅ "Imagen eliminada correctamente"
- ❌ "Error al procesar la imagen"

## Uso del Componente

### Props del Modal
```typescript
interface PlatoModalProps {
  showItemModal: boolean;
  closeModal: (show: boolean) => void;
  item: Plato | null; // null para crear, objeto para editar
  categorias: Categoria[];
}
```

### Ejemplo de Uso
```typescript
<PlatoModal
  showItemModal={showModal}
  closeModal={setShowModal}
  item={selectedPlato} // null para nuevo plato
  categorias={categorias}
/>
```

## Flujo de Trabajo

### Crear Nuevo Plato
1. Usuario abre modal
2. Completa información básica
3. Sube imagen (opcional)
4. Agrega ingredientes
5. Selecciona categorías
6. Guarda plato
7. Imagen se sube a Cloudinary
8. `secure_url` se guarda en BD

### Editar Plato Existente
1. Usuario abre modal con datos existentes
2. Modifica información
3. Cambia imagen (opcional)
4. Guarda cambios
5. Si cambió imagen: se elimina la anterior y se sube la nueva
6. Se actualiza `secure_url` en BD

## Configuración Requerida

### Variables de Entorno
```env
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

### Dependencias
```json
{
  "cloudinary": "^2.7.0",
  "sonner": "^1.7.1"
}
```

## Ventajas de la Implementación

1. **Experiencia de Usuario**: Interfaz intuitiva y moderna
2. **Optimización**: Imágenes optimizadas automáticamente
3. **Seguridad**: URLs HTTPS y validación de archivos
4. **Escalabilidad**: Cloudinary maneja el almacenamiento
5. **Mantenibilidad**: Código limpio y bien estructurado
6. **Feedback**: Notificaciones claras para el usuario

## Consideraciones Técnicas

- **Carpeta**: Las imágenes se guardan en `adminpanel/`
- **Optimización**: Cloudinary optimiza automáticamente las imágenes
- **CDN**: Las imágenes se sirven desde la CDN de Cloudinary
- **Backup**: Las imágenes se respaldan automáticamente
- **Transformaciones**: Se pueden aplicar transformaciones en tiempo real 