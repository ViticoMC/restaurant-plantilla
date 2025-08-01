// Utilidades para manejar imágenes en Cloudinary

export interface CloudinaryResponse {
    success: boolean;
    data: {
        public_id: string;
        secure_url: string;
        url: string;
        width: number;
        height: number;
        format: string;
        bytes: number;
    };
    message?: string;
    error?: string;
}

// Función para subir una imagen
export async function uploadImageToCloudinary(
    file: File,
    folder: string = 'adminpanel'
): Promise<CloudinaryResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/cloudinary', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al subir imagen:', error);
        throw new Error('Error al subir imagen a Cloudinary');
    }
}

// Función para eliminar una imagen
export async function deleteImageFromCloudinary(
    publicId: string
): Promise<CloudinaryResponse> {
    try {
        const response = await fetch(`/api/cloudinary?publicId=${encodeURIComponent(publicId)}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        throw new Error('Error al eliminar imagen de Cloudinary');
    }
}

// Función para actualizar una imagen
export async function updateImageInCloudinary(
    file: File,
    oldPublicId: string,
    folder: string = 'adminpanel'
): Promise<CloudinaryResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('oldPublicId', oldPublicId);
        formData.append('folder', folder);

        const response = await fetch('/api/cloudinary', {
            method: 'PUT',
            body: formData,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al actualizar imagen:', error);
        throw new Error('Error al actualizar imagen en Cloudinary');
    }
}

// Función para obtener información de una imagen
export async function getImageInfoFromCloudinary(
    publicId: string
): Promise<CloudinaryResponse> {
    try {
        const response = await fetch(`/api/cloudinary?publicId=${encodeURIComponent(publicId)}`, {
            method: 'GET',
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener información de imagen:', error);
        throw new Error('Error al obtener información de imagen de Cloudinary');
    }
}

// Función para validar tipos de archivo
export function validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WebP, GIF');
    }

    if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 10MB');
    }

    return true;
}

// Función para obtener la URL optimizada de Cloudinary
export function getOptimizedImageUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
        crop?: 'fill' | 'scale' | 'fit' | 'thumb';
    } = {}
): string {
    const baseUrl = `https://res.cloudinary.com/dqthqbwff/image/upload`;
    const transformations = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    if (options.crop) transformations.push(`c_${options.crop}`);

    const transformationString = transformations.length > 0 ? transformations.join(',') + '/' : '';

    return `${baseUrl}/${transformationString}${publicId}`;
} 