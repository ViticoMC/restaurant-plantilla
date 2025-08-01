# Configuración de Cloudinary

Este proyecto incluye una implementación completa para manejar imágenes en Cloudinary con las siguientes funcionalidades:

- ✅ Subir imágenes
- ✅ Eliminar imágenes
- ✅ Actualizar imágenes
- ✅ Obtener información de imágenes
- ✅ URLs optimizadas automáticamente

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

### 2. Obtener Credenciales de Cloudinary

1. Ve a [Cloudinary](https://cloudinary.com/) y crea una cuenta
2. En tu Dashboard, encuentra:
   - **Cloud Name**: `dqthqbwff` (ya configurado)
   - **API Key**: Copia tu API Key
   - **API Secret**: Copia tu API Secret

## Uso

### API Endpoints

#### POST `/api/cloudinary` - Subir imagen
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'adminpanel'); // opcional

const response = await fetch('/api/cloudinary', {
  method: 'POST',
  body: formData
});
```

#### DELETE `/api/cloudinary?publicId=ID` - Eliminar imagen
```javascript
const response = await fetch(`/api/cloudinary?publicId=${publicId}`, {
  method: 'DELETE'
});
```

#### PUT `/api/cloudinary` - Actualizar imagen
```javascript
const formData = new FormData();
formData.append('file', newFile);
formData.append('oldPublicId', oldPublicId);
formData.append('folder', 'adminpanel'); // opcional

const response = await fetch('/api/cloudinary', {
  method: 'PUT',
  body: formData
});
```

#### GET `/api/cloudinary?publicId=ID` - Obtener información
```javascript
const response = await fetch(`/api/cloudinary?publicId=${publicId}`, {
  method: 'GET'
});
```

### Utilidades del Frontend

Importa las funciones desde `@/lib/cloudinary`:

```typescript
import { 
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  updateImageInCloudinary,
  getImageInfoFromCloudinary,
  validateImageFile,
  getOptimizedImageUrl
} from '@/lib/cloudinary';
```

#### Subir imagen
```typescript
const response = await uploadImageToCloudinary(file, 'adminpanel');
console.log(response.data.secure_url); // URL para guardar en BD
```

#### Eliminar imagen
```typescript
await deleteImageFromCloudinary(publicId);
```

#### Actualizar imagen
```typescript
const response = await updateImageInCloudinary(newFile, oldPublicId, 'adminpanel');
```

#### Validar archivo
```typescript
try {
  validateImageFile(file);
  // Archivo válido
} catch (error) {
  // Archivo inválido
}
```

#### URL optimizada
```typescript
const optimizedUrl = getOptimizedImageUrl(publicId, {
  width: 300,
  height: 200,
  quality: 80,
  format: 'webp'
});
```

### Componente de Ejemplo

Usa el componente `ImageUpload` para una interfaz completa:

```typescript
import { ImageUpload } from '@/components/ui/image-upload';

<ImageUpload
  onImageUploaded={(response) => {
    // Guardar response.data.secure_url en la base de datos
    console.log(response.data.secure_url);
  }}
  onImageDeleted={(publicId) => {
    // Limpiar referencia en la base de datos
  }}
  folder="adminpanel"
  currentImageUrl="https://..."
  currentPublicId="adminpanel/..."
/>
```

## Respuestas de la API

Todas las respuestas siguen este formato:

```typescript
{
  success: boolean;
  data: {
    public_id: string;
    secure_url: string; // URL HTTPS para usar en producción
    url: string;        // URL HTTP
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
  message?: string;
  error?: string;
}
```

## Características

- **Optimización automática**: Las imágenes se optimizan automáticamente
- **Formatos soportados**: JPG, PNG, WebP, GIF
- **Límite de tamaño**: 10MB por archivo
- **Validación**: Validación de tipos y tamaños de archivo
- **URLs seguras**: Siempre devuelve URLs HTTPS
- **Transformaciones**: URLs optimizadas con parámetros de Cloudinary

## Integración con Base de Datos

Para integrar con tu base de datos, guarda la `secure_url` que devuelve la API:

```typescript
// Ejemplo con Prisma
const plato = await prisma.plato.create({
  data: {
    nombre: 'Plato Ejemplo',
    imagen: response.data.secure_url, // URL de Cloudinary
    publicId: response.data.public_id // ID para futuras operaciones
  }
});
```

## Notas Importantes

1. **Siempre usa `secure_url`** para producción
2. **Guarda el `public_id`** para futuras operaciones (eliminar, actualizar)
3. **Las imágenes se guardan en la carpeta `adminpanel`** por defecto
4. **Las transformaciones son automáticas** para optimizar rendimiento 