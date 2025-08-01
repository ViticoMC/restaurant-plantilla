import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json({ error: "Falta el ID" }, { status: 400 });
//     }

//     const comida = await prisma.plato.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!comida) {
//       return NextResponse.json(
//         { error: "No se encontró la comida" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(comida);
//   } catch (error) {
//     console.error("Error al obtener comida:", error);
//     return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
//   }
// }

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Falta el ID" }, { status: 400 });
    }

    const comida = await prisma.plato.update({
      where: {
        id,
      },
      data: body,
    });

    if (!comida) {
      return NextResponse.json(
        { error: "No se encontró la comida" },
        { status: 404 }
      );
    }

    return NextResponse.json(comida);
  } catch (error) {
    console.error("Error al actualizar comida:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }
    console.log(id, "id")
    const plato = await prisma.plato.findUnique({ where: { id } });
    console.log(plato, "plato")

    if (!plato) {
      return NextResponse.json({ error: "Plato no encontrado" }, { status: 404 });
    }

    const deleted = await prisma.plato.delete({ where: { id } });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error al eliminar comida:", error);
    return NextResponse.json(
      { error: "Error del servidor al eliminar el plato" },
      { status: 500 }
    );
  }
}

