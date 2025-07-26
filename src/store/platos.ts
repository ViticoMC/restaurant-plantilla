import { create } from "zustand";
import { Plato } from "@/lib/generated/prisma";

// Acciones posibles para el reducer
export type PlatosAction =
  | { type: "SET_PLATOS"; payload: Plato[] }
  | { type: "ADD_PLATO"; payload: Plato }
  | { type: "UPDATE_PLATO"; payload: Plato }
  | { type: "DELETE_PLATO"; payload: string };

function platosReducer(state: Plato[], action: PlatosAction): Plato[] {
  switch (action.type) {
    case "SET_PLATOS":
      return action.payload;
    case "ADD_PLATO":
      return [...state, action.payload];
    case "UPDATE_PLATO":
      return state.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p));
    case "DELETE_PLATO":
      return state.filter((p) => p.id !== action.payload);
    default:
      return state;
  }
}

interface PlatosState {
  platos: Plato[];
  dispatch: (action: PlatosAction) => void;
}

export const usePlatosStore = create<PlatosState>((set) => ({
  platos: [],
  dispatch: (action) =>
    set((state) => ({ platos: platosReducer(state.platos, action) })),
}));
