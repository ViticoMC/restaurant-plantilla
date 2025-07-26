import {  useEffect, useState } from "react";
import { getCategorias } from "@/utils/get-categorias";
import { useCategoriasStore } from "@/store/categorias";

export default function useGetCategorias() {
  const {categorias , dispatchCategorias} = useCategoriasStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategorias()
      .then((data) => {
        dispatchCategorias({type: "SET_CATEGORIAS", payload: data});
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { categorias, error , isLoading};
}
