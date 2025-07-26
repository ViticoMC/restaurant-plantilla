import { NextResponse } from "next/server";

export async function POST() {
  // Borra la cookie 'token' estableciéndola vacía y expirando inmediatamente
  const response = NextResponse.json({ success: true, message: "Logout exitoso" });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0), // Expira inmediatamente
    path: "/",
  });

  console.log(response.cookies.get("token"))
  return response;
}
