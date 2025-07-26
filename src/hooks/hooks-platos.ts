import { useEffect, useState } from "react";
import {usePlatosStore} from  "@/store/platos"

export  function useGetPlatos() {
  const {platos, dispatch } = usePlatosStore()
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    getPlatos()
      .then((data) => {
        dispatch({type: "SET_PLATOS", payload: data});
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { platos, error , isLoading};
}

