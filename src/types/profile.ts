export interface Profile {
  id: string;
  nombre: string;
  rol: "cliente" | "profesional";
  ciudad: string | null;
  telefono: string | null;
  foto_url: string | null;
  suspendido: boolean;
  motivo_suspension: string | null;
  creado_en: string;
}