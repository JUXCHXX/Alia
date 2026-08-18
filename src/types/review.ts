export interface Review {
  id: string;
  booking_id: string;
  calificacion: number;
  comentario: string | null;
  foto_url: string | null;
  creado_en: string;
}