import { supabase } from "./supabase";
import { Profile } from "../types/profile";

export async function getMiPerfil(): Promise<Profile | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nombre, rol, ciudad, telefono, foto_url, creado_en")
    .eq("id", userData.user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarMiPerfil(cambios: {
  nombre?: string;
  ciudad?: string;
  telefono?: string;
  foto_url?: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { error } = await supabase
    .from("profiles")
    .update(cambios)
    .eq("id", userData.user.id);

  if (error) throw error;
}