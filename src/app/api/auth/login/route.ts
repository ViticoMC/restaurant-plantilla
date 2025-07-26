import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Credenciales de prueba - en producción deberían estar en base de datos


export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const admin = await prisma.admin.findUnique({
      where: {
        admin: username,
      },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin no encontrado" }, { status: 401 })
    }

    // Validar credenciales
    if ( password !== admin.password) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        username,
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 horas
      },
      JWT_SECRET,
    )

    // Crear respuesta y guardar cookie
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        username,
        role: "admin",
      },
    })
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    })
    return response
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
