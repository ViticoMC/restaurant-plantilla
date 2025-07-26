import { Plato } from "@/lib/generated/prisma";
import { api } from "@/lib/api";

export async function getPlatos () {
  const res = await api.get("/platos")
  return res.data
}

export async function addPlato(plato:Partial<Plato>){
    try {
        const res  = await api.post("/platos",plato)
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function updatePlato(plato:Partial<Plato>) {
  try{
    const res = await api.put(`/platos/${plato.id}`,plato)
    return res
  }catch(error){
    console.log(error)
    return null
  }
}

export async function deletePlato(id:string){
  try{
    const res = await api.delete(`/platos/${id}`)
    return res
  }catch(error){
    console.log(error)
    return null
  }
}