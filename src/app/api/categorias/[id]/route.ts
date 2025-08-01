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

    const categoria = await prisma.categoria.update({
      where: {
        id,
      },
      data: body,
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "No se encontró la categoria" },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error("Error al actualizar categoria:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log("id ", id)

    if (!id) {
      return NextResponse.json({ error: "Falta el ID" }, { status: 400 });
    }

    const categoria = await prisma.categoria.delete({
      where: {
        id,
      },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "No se encontró la categoria" },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error("Error al eliminar categoria:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
