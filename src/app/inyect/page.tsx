"use client"
import { api } from "@/lib/api"
import { useEffect } from "react"

export default function Inyect() {
    const categorias = [
        { "icon": "🍔", "nombre": "Hamburguesas" },
        { "icon": "🍕", "nombre": "Pizzas" },
        { "icon": "🍣", "nombre": "Sushi y Comida Asiática" },
        { "icon": "🌮", "nombre": "Tacos y Comida Mexicana" },
        { "icon": "🥗", "nombre": "Ensaladas y Comida Saludable" },
        { "icon": "🍝", "nombre": "Pastas y Comida Italiana" },
        { "icon": "🍛", "nombre": "Platos Fuertes / Comida Casera" },
        { "icon": "🍟", "nombre": "Entrantes y Snacks" },
        { "icon": "🍰", "nombre": "Postres y Dulces" },
        { "icon": "🍹", "nombre": "Bebidas y Cócteles" }
    ]

    async function getInyect() {
        for (const categoria of categorias) {
            const response = await fetch(`/api/categorias`, {
                method: "POST",
                body: JSON.stringify(categoria),
            })
        }
    }

    useEffect(() => {
        // getInyect()

        // user()
    }, [])

    async function user() {
        const response = await api.get("/users")
        console.log(response)
    }
    return (
        <div>
            <h1>Inyect</h1>
        </div>
    )
}