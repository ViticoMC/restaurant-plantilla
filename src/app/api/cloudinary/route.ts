import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Tipos para Cloudinary
interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    resource_type: string;
    created_at: string;
}

interface CloudinaryDeleteResult {
    result: string;
    request_id: string;
}

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: 'dqthqbwff',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir imagen
async function uploadImage(file: Buffer, folder: string = 'adminpanel'): Promise<CloudinaryUploadResult> {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
                    transformation: [
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result as CloudinaryUploadResult);
                    }
                }
            );

            uploadStream.end(file);
        });
    } catch (error) {
        throw new Error(`Error al subir imagen: ${error}`);
    }
}

// Función para eliminar imagen
async function deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result as CloudinaryDeleteResult;
    } catch (error) {
        throw new Error(`Error al eliminar imagen: ${error}`);
    }
}

// Función para actualizar imagen (eliminar la anterior y subir la nueva)
async function updateImage(oldPublicId: string, newFile: Buffer, folder: string = 'adminpanel'): Promise<CloudinaryUploadResult> {
    try {
        // Eliminar imagen anterior
        if (oldPublicId) {
            await deleteImage(oldPublicId);
        }

        // Subir nueva imagen
        const uploadResult = await uploadImage(newFile, folder);
        return uploadResult;
    } catch (error) {
        throw new Error(`Error al actualizar imagen: ${error}`);
    }
}

// Función para obtener información de una imagen
async function getImageInfo(publicId: string): Promise<any> {
    try {
        const result = await cloudinary.api.resource(publicId);
        return result;
    } catch (error) {
        throw new Error(`Error al obtener información de imagen: ${error}`);
    }
}

// POST - Subir nueva imagen
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'adminpanel';

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó ningún archivo' },
                { status: 400 }
            );
        }

        // Convertir File a Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Subir imagen
        const uploadResult = await uploadImage(buffer, folder);

        return NextResponse.json({
            success: true,
            data: {
                public_id: uploadResult.public_id,
                secure_url: uploadResult.secure_url,
                url: uploadResult.url,
                width: uploadResult.width,
                height: uploadResult.height,
                format: uploadResult.format,
                bytes: uploadResult.bytes
            }
        });

    } catch (error) {
        console.error('Error en POST /api/cloudinary:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar imagen
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return NextResponse.json(
                { error: 'Se requiere publicId para eliminar la imagen' },
                { status: 400 }
            );
        }

        const deleteResult = await deleteImage(publicId);

        return NextResponse.json({
            success: true,
            message: 'Imagen eliminada correctamente',
            data: deleteResult
        });

    } catch (error) {
        console.error('Error en DELETE /api/cloudinary:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// PUT - Actualizar imagen
export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const oldPublicId = formData.get('oldPublicId') as string;
        const folder = formData.get('folder') as string || 'adminpanel';

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó ningún archivo' },
                { status: 400 }
            );
        }

        // Convertir File a Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Actualizar imagen
        const updateResult = await updateImage(oldPublicId, buffer, folder);

        return NextResponse.json({
            success: true,
            data: {
                public_id: updateResult.public_id,
                secure_url: updateResult.secure_url,
                url: updateResult.url,
                width: updateResult.width,
                height: updateResult.height,
                format: updateResult.format,
                bytes: updateResult.bytes
            }
        });

    } catch (error) {
        console.error('Error en PUT /api/cloudinary:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// GET - Obtener información de imagen
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return NextResponse.json(
                { error: 'Se requiere publicId para obtener información de la imagen' },
                { status: 400 }
            );
        }

        const imageInfo = await getImageInfo(publicId);

        return NextResponse.json({
            success: true,
            data: imageInfo
        });

    } catch (error) {
        console.error('Error en GET /api/cloudinary:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
