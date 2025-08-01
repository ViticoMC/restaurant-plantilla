"use client"
import { api } from "@/lib/api"
import { Categoria } from "@/lib/generated/prisma"
import { useEffect } from "react"

export default function Inyect() {
    // const categorias = [
    //     { "icon": "🍔", "nombre": "Hamburguesas" },
    //     { "icon": "🍕", "nombre": "Pizzas" },
    //     { "icon": "🍣", "nombre": "Sushi y Comida Asiática" },
    //     { "icon": "🌮", "nombre": "Tacos y Comida Mexicana" },
    //     { "icon": "🥗", "nombre": "Ensaladas y Comida Saludable" },
    //     { "icon": "🍝", "nombre": "Comida Italiana" },
    //     { "icon": "🍛", "nombre": "Platos Fuertes" },
    //     { "icon": "🍟", "nombre": "Entrantes y Snacks" },
    //     { "icon": "🍰", "nombre": "Postres y Dulces" },
    //     { "icon": "🍹", "nombre": "Bebidas y Cócteles" }
    // ]
    const platos = [
        {
            "nombre": "Hamburguesa Doble con Queso",
            "ingredientes": [
                "Pan de hamburguesa",
                "Carne de res",
                "Queso cheddar",
                "Lechuga",
                "Tomate",
                "Pepinillos",
                "Salsa especial"
            ],
            "descripcion": "Una jugosa hamburguesa doble con queso derretido y vegetales frescos.",
            "foto": "https://cdn7.kiwilimon.com/recetaimagen/28131/th5-640x426-21424.jpg",
            "precio": 7.99,
            "categorias": ["Hamburguesas"]
        },
        {
            "nombre": "Pizza Pepperoni Clásica",
            "ingredientes": [
                "Masa de pizza",
                "Salsa de tomate",
                "Mozzarella",
                "Pepperoni",
                "Orégano"
            ],
            "descripcion": "Pizza tradicional con abundante pepperoni crujiente y queso fundido.",
            "foto": "https://images.dominos.com.mx/media/dominos/food/pizza/Pepperoni.png",
            "precio": 9.50,
            "categorias": ["Pizzas"]
        },
        {
            "nombre": "Sushi Roll de Salmón",
            "ingredientes": [
                "Arroz para sushi",
                "Salmón fresco",
                "Alga nori",
                "Aguacate",
                "Queso crema"
            ],
            "descripcion": "Rollos de sushi con salmón fresco y cremoso aguacate, al estilo japonés.",
            "foto": "https://www.recetasnestle.com.pe/sites/default/files/2023-02/receta-sushi.jpg",
            "precio": 11.25,
            "categorias": ["Sushi y Comida Asiática"]
        },
        {
            "nombre": "Tacos al Pastor",
            "ingredientes": [
                "Carne de cerdo marinada",
                "Piña",
                "Cilantro",
                "Cebolla",
                "Tortillas de maíz"
            ],
            "descripcion": "Tacos tradicionales mexicanos con carne de cerdo al pastor y piña asada.",
            "foto": "https://cdn0.recetasgratis.net/es/posts/9/0/2/tacos_al_pastor_mexicanos_5209_orig.jpg",
            "precio": 5.99,
            "categorias": ["Tacos y Comida Mexicana"]
        },
        {
            "nombre": "Ensalada César con Pollo",
            "ingredientes": [
                "Lechuga romana",
                "Pollo a la plancha",
                "Crutones",
                "Queso parmesano",
                "Aderezo césar"
            ],
            "descripcion": "Ensalada ligera y sabrosa con pollo y un toque de parmesano.",
            "foto": "https://www.paulinacocina.net/wp-content/uploads/2022/10/ensalada-cesar-paulina-cocina-receta.jpg",
            "precio": 6.50,
            "categorias": ["Ensaladas y Comida Saludable"]
        },
        {
            "nombre": "Spaghetti a la Boloñesa",
            "ingredientes": [
                "Spaghetti",
                "Carne molida",
                "Salsa de tomate",
                "Ajo",
                "Cebolla",
                "Queso parmesano"
            ],
            "descripcion": "Un clásico italiano con salsa boloñesa casera y pasta al dente.",
            "foto": "https://imag.bonviveur.com/spaghetti-a-la-bolonesa.jpg",
            "precio": 8.25,
            "categorias": ["Comida Italiana"]
        },
        {
            "nombre": "Arroz con Pollo Casero",
            "ingredientes": [
                "Arroz",
                "Pollo",
                "Pimientos",
                "Cebolla",
                "Ajo",
                "Caldo de pollo"
            ],
            "descripcion": "Plato casero y reconfortante, perfecto para el almuerzo familiar.",
            "foto": "https://www.recetasnestle.com.pe/sites/default/files/styles/recipe_detail_desktop/public/srh_recipes/f839efc2b8a1dc199e41c205fb653d19.jpg",
            "precio": 6.75,
            "categorias": ["Platos Fuertes"]
        },
        {
            "nombre": "Papas Fritas con Queso y Tocino",
            "ingredientes": [
                "Papas fritas",
                "Queso cheddar fundido",
                "Tocino crujiente",
                "Cebollino"
            ],
            "descripcion": "Snacks irresistibles con una mezcla de queso y tocino.",
            "foto": "https://assets.unileversolutions.com/recipes-v2/245408.jpg",
            "precio": 4.99,
            "categorias": ["Entrantes y Snacks"]
        },
        {
            "nombre": "Tarta de Queso con Fresa",
            "ingredientes": [
                "Queso crema",
                "Galletas",
                "Mantequilla",
                "Fresas",
                "Azúcar"
            ],
            "descripcion": "Postre cremoso con base de galleta y fresas frescas.",
            "foto": "https://www.recetasderechupete.com/wp-content/uploads/2023/03/Tarta-de-queso-y-fresa.jpg",
            "precio": 5.20,
            "categorias": ["Postres y Dulces"]
        },
        {
            "nombre": "Mojito Cubano",
            "ingredientes": [
                "Ron blanco",
                "Hierbabuena",
                "Azúcar",
                "Agua con gas",
                "Limón"
            ],
            "descripcion": "Refrescante cóctel cubano con menta y ron.",
            "foto": "https://www.cocinacaserayfacil.net/wp-content/uploads/2019/03/Receta-de-mojito-cubano.jpg",
            "precio": 4.50,
            "categorias": ["Bebidas y Cócteles"]
        }
    ]
    const KEY_WORD = process.env.KEY_WORD


    // async function getInyect() {
    //     for (const categoria of categorias) {
    //         const response = await fetch(`/api/categorias`, {
    //             method: "POST",
    //             body: JSON.stringify(categoria),
    //         })
    //     }
    // }


    async function inyectPlatos() {
        const res = await api.get("/categorias")
        const categorias = res.data

        for (const plato of platos) {
            const categoriaIds = categorias.
                filter((categoria: Categoria) => plato.categorias[0] === categoria.nombre)
                .map((categoria: Categoria) => categoria.id)
            console.log(categoriaIds)
            const { categorias: categoriasPlato, ...resto } = plato
            const response = await fetch(`/api/platos`, {
                method: "POST",
                body: JSON.stringify({ ...resto, categoriaIds, KEY_WORD }),
            })
        }
    }

    useEffect(() => {
        // getInyect()
        inyectPlatos()

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