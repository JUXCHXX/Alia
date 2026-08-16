import { supabase } from "./supabase";
import { AvailabilityBlock } from "../types/availability";

export async function crearBloqueDisponibilidad(datos: {
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { error } = await supabase.from("availability").insert({
    professional_id: userData.user.id,
    dia_semana: datos.dia_semana,
    hora_inicio: datos.hora_inicio,
    hora_fin: datos.hora_fin,
  });

  if (error) throw error;
}

export async function getMiDisponibilidad(): Promise<AvailabilityBlock[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("availability")
    .select("id, professional_id, dia_semana, hora_inicio, hora_fin, activo")
    .eq("professional_id", userData.user.id)
    .order("dia_semana", { ascending: true })
    .order("hora_inicio", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
export async function cambiarEstadoBloque(id: string, activo: boolean) {
  const { error } = await supabase.from("availability").update({ activo }).eq("id", id);
  if (error) throw error;
}

export async function eliminarBloqueDisponibilidad(id: string) {
  const { error } = await supabase.from("availability").delete().eq("id", id);
  if (error) throw error;
}
export async function getDisponibilidadDeProfesional(
  professionalId: string
): Promise<AvailabilityBlock[]> {
  const { data, error } = await supabase
    .from("availability")
    .select("id, professional_id, dia_semana, hora_inicio, hora_fin, activo")
    .eq("professional_id", professionalId)
    .eq("activo", true)
    .order("dia_semana", { ascending: true })
    .order("hora_inicio", { ascending: true });

  if (error) throw error;
  return data ?? [];
}