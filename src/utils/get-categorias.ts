import { api } from "@/lib/api";

export async function getCategorias() {
    const res = await api.get("/categorias");
    return res.data
  }
  