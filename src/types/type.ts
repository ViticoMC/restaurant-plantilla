export interface Plato {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  ingredientes: string[];
  foto: string;
  disponible: boolean;
  key_word: string;
  categoriaIds: string[];
}


export interface Categoria {
    icon : string;
    id : string;
    nombre : string;
}