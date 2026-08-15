export interface Service {
  id: string;
  professional_id: string;
  category_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  activo: boolean;
  creado_en: string;
}