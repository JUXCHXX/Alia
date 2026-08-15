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
import { Profile } from "../types/profile";

export interface PerfilProfesionalPublico {
  id: string;
  nombre: string;
  foto_url: string | null;
  bio: string | null;
  zona_trabajo: string | null;
}

export async function getPerfilProfesionalPublico(
  id: string
): Promise<PerfilProfesionalPublico | null> {
  const [{ data: perfil, error: errorPerfil }, { data: profesional, error: errorProfesional }] =
    await Promise.all([
      supabase.from("profiles").select("id, nombre, foto_url").eq("id", id).single(),
      supabase
        .from("professional_profiles")
        .select("bio, zona_trabajo")
        .eq("id", id)
        .single(),
    ]);

  if (errorPerfil || errorProfesional) return null;

  return {
    id: perfil.id,
    nombre: perfil.nombre,
    foto_url: perfil.foto_url,
    bio: profesional.bio,
    zona_trabajo: profesional.zona_trabajo,
  };
}
export interface ProfesionalResumen {
  id: string;
  nombre: string;
  foto_url: string | null;
  zona_trabajo: string | null;
}

export async function getProfesionales(): Promise<ProfesionalResumen[]> {
  const { data: profesionales, error: errorProfesionales } = await supabase
    .from("professional_profiles")
    .select("id, zona_trabajo")
    .eq("estado_verificacion", "aprobado");

  if (errorProfesionales) throw errorProfesionales;
  if (!profesionales || profesionales.length === 0) return [];

  const ids = profesionales.map((p) => p.id);

  const { data: perfiles, error: errorPerfiles } = await supabase
    .from("profiles")
    .select("id, nombre, foto_url")
    .in("id", ids);

  if (errorPerfiles) throw errorPerfiles;

  return profesionales.map((prof) => {
    const perfil = perfiles?.find((p) => p.id === prof.id);
    return {
      id: prof.id,
      nombre: perfil?.nombre ?? "Profesional",
      foto_url: perfil?.foto_url ?? null,
      zona_trabajo: prof.zona_trabajo,
    };
  });
}