'use client';

import { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
    updateImageInCloudinary,
    validateImageFile,
    CloudinaryResponse
} from '@/lib/cloudinary';
import { toast } from 'sonner';

interface ImageUploadProps {
    onImageUploaded?: (response: CloudinaryResponse) => void;
    onImageDeleted?: (publicId: string) => void;
    onImageUpdated?: (response: CloudinaryResponse) => void;
    folder?: string;
    currentImageUrl?: string;
    currentPublicId?: string;
}

export function ImageUpload({
    onImageUploaded,
    onImageDeleted,
    onImageUpdated,
    folder = 'adminpanel',
    currentImageUrl,
    currentPublicId
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<CloudinaryResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // Validar archivo
            validateImageFile(file);

            setIsUploading(true);

            let response: CloudinaryResponse;

            if (currentPublicId) {
                // Actualizar imagen existente
                response = await updateImageInCloudinary(file, currentPublicId, folder);
                setUploadedImage(response);
                onImageUpdated?.(response);
                toast.success('Imagen actualizada correctamente');
            } else {
                // Subir nueva imagen
                response = await uploadImageToCloudinary(file, folder);
                setUploadedImage(response);
                onImageUploaded?.(response);
                toast.success('Imagen subida correctamente');
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error(error instanceof Error ? error.message : 'Error al procesar la imagen');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteImage = async () => {
        if (!currentPublicId) return;

        try {
            setIsDeleting(true);
            await deleteImageFromCloudinary(currentPublicId);
            setUploadedImage(null);
            onImageDeleted?.(currentPublicId);
            toast.success('Imagen eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            toast.error('Error al eliminar la imagen');
        } finally {
            setIsDeleting(false);
        }
    };

    const displayImageUrl = uploadedImage?.data.secure_url || currentImageUrl;

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Subir Imagen</CardTitle>
                <CardDescription>
                    Sube una imagen a Cloudinary. Formatos permitidos: JPG, PNG, WebP, GIF (máx. 10MB)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="image-upload">Seleccionar imagen</Label>
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        disabled={isUploading}
                    />
                </div>

                {displayImageUrl && (
                    <div className="space-y-2">
                        <Label>Vista previa</Label>
                        <div className="relative">
                            <img
                                src={displayImageUrl}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-md border"
                            />
                        </div>
                        {uploadedImage && (
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>ID: {uploadedImage.data.public_id}</p>
                                <p>Tamaño: {(uploadedImage.data.bytes / 1024).toFixed(1)} KB</p>
                                <p>Dimensiones: {uploadedImage.data.width} x {uploadedImage.data.height}</p>
                                <p>Formato: {uploadedImage.data.format}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex-1"
                    >
                        {isUploading ? 'Subiendo...' : currentPublicId ? 'Cambiar imagen' : 'Subir imagen'}
                    </Button>

                    {currentPublicId && (
                        <Button
                            variant="destructive"
                            onClick={handleDeleteImage}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    )}
                </div>

                {uploadedImage && (
                    <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">URL de la imagen:</p>
                        <p className="text-xs text-muted-foreground break-all">
                            {uploadedImage.data.secure_url}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 