import { supabase } from "./supabase";
import { MotivoReporte } from "../types/report";

export async function crearReporte(datos: {
  reportadoId: string;
  bookingId: string;
  motivo: MotivoReporte;
  descripcion: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { error } = await supabase.from("reports").insert({
    reportante_id: userData.user.id,
    reportado_id: datos.reportadoId,
    booking_id: datos.bookingId,
    motivo: datos.motivo,
    descripcion: datos.descripcion,
  });

  if (error) throw error;
}