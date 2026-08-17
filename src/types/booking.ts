export type EstadoBooking = "pendiente" | "aceptada" | "en_progreso" | "rechazada" | "cancelada" | "completada";

export interface Booking {
  id: string;
  cliente_id: string;
  professional_id: string;
  service_id: string;
  estado: EstadoBooking;
  mensaje: string | null;
  iniciado_en: string | null;
  completado_en: string | null;
  creado_en: string;
  actualizado_en: string;
}