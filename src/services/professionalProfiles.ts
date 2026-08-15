import { supabase } from "./supabase";
import { ProfessionalProfile } from "../types/professionalProfile";

export async function getMiPerfilProfesional(): Promise<ProfessionalProfile | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from("professional_profiles")
    .select("id, bio, zona_trabajo, estado_verificacion, fecha_solicitud")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function solicitarSerProfesional(bio: string, zonaTrabajo: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { error } = await supabase.from("professional_profiles").insert({
    id: userData.user.id,
    bio,
    zona_trabajo: zonaTrabajo,
  });

  if (error) throw error;
}