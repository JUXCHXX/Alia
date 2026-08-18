export type MotivoReporte = "comportamiento" | "servicio_no_realizado" | "fraude" | "contenido_inapropiado" | "otro";

export interface Report {
  id: string;
  reportante_id: string;
  reportado_id: string | null;
  booking_id: string | null;
  motivo: MotivoReporte;
  descripcion: string;
  estado: "pendiente" | "revisado" | "resuelto";
  creado_en: string;
}