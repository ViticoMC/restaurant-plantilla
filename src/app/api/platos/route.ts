import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const platos = await prisma.plato.findMany({
      where:{
        key_word: process.env.KEY_WORD
      }
    });

    if (!platos) {
      return NextResponse.json(
        { error: "No hay comidas dispnibles" },
        { status: 404 }
      );
    }

    return NextResponse.json(platos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener comida:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Leer la cookie 'token'
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.precio) {
      return NextResponse.json({ error: "Precio es requerido" }, { status: 400 });
    }
    if (!body.nombre ) {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 });
    }

    // Asociar el plato al admin
    const nuevoPlato = await prisma.plato.create({
      data: {
        ...body,
        key_word: process.env.KEY_WORD
      },
    });

    return NextResponse.json(nuevoPlato, { status: 201 });
  } catch (error) {
    console.error("Error al insertar comida:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
