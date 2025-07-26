import { NextRequest , NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
    try {
        const categorias = await prisma.categoria.findMany();
    
        if (!categorias) {
          return NextResponse.json(
            { error: "No hay comidas dispnibles" },
            { status: 404 }
          );
        }
    
        return NextResponse.json(categorias, { status: 200 });
      } catch (error) {
        console.error("Error al obtener comida:", error);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
      }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, icon } = body;

    if (!nombre || !icon) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    // Crear la nueva categoría
    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre, icon },
    });

    return NextResponse.json(nuevaCategoria, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Prisma error para unique constraint
      return NextResponse.json({ error: "El nombre de la categoría ya existe" }, { status: 409 });
    }
    console.error("Error al crear categoría:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
