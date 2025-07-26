import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { admin, password } = body;

    if (!admin || !password) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const nuevoAdmin = await prisma.admin.create({
      data: {
        admin,
        password, // ⚠️ Recuerda hashearla en producción con bcrypt
      },
    });

    return NextResponse.json(nuevoAdmin, { status: 201 });
  } catch (error) {
    console.error("Error al insertar admin:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Solo aceptar token por cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch (err) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
    }

    const username = decoded && typeof decoded === "object" && "username" in decoded ? decoded.username : undefined;
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Token sin username" }, { status: 401 });
    }

    // Buscar el admin en la base de datos por username
    const admin = await prisma.admin.findUnique({
      where: { admin: username },
      select: { id: true, admin: true },
    });
    if (!admin) {
      return NextResponse.json({ error: "Admin no encontrado" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin,
      tokenData: decoded,
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener admin:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
