import { create } from "zustand";

export interface Categoria {
    id: string;
    nombre: string;
    icon: string;
  }
  
  export type CategoriasAction =
    | { type: "SET_CATEGORIAS"; payload: Categoria[] }
    | { type: "ADD_CATEGORIA"; payload: Categoria }
    | { type: "UPDATE_CATEGORIA"; payload: Categoria }
    | { type: "DELETE_CATEGORIA"; payload: string };
  
  function categoriasReducer(state: Categoria[], action: CategoriasAction): Categoria[] {
    switch (action.type) {
      case "SET_CATEGORIAS":
        return action.payload;
      case "ADD_CATEGORIA":
        return [...state, action.payload];
      case "UPDATE_CATEGORIA":
        return state.map((c) => (c.id === action.payload.id ? { ...c, ...action.payload } : c));
      case "DELETE_CATEGORIA":
        return state.filter((c) => c.id !== action.payload);
      default:
        return state;
    }
  }
  
  interface CategoriasState {
    categorias: Categoria[];
    dispatchCategorias: (action: CategoriasAction) => void;
  }
  
  export const useCategoriasStore = create<CategoriasState>((set) => ({
    categorias: [],
    dispatchCategorias: (action) =>
      set((state) => ({ categorias: categoriasReducer(state.categorias, action) })),
  }));
  