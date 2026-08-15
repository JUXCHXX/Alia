export interface ProfessionalProfile {
  id: string;
  bio: string | null;
  zona_trabajo: string | null;
  estado_verificacion: "pendiente" | "aprobado" | "rechazado";
  fecha_solicitud: string;
}