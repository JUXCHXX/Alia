import { supabase } from "./supabase";
import { Service } from "../types/service";

export async function crearServicio(datos: {
  nombre: string;
  descripcion: string;
  precio: number;
  category_id: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { error } = await supabase.from("services").insert({
    professional_id: userData.user.id,
    category_id: datos.category_id,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: datos.precio,
  });

  if (error) throw error;
}

export async function getMisServicios(): Promise<Service[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("services")
    .select("id, professional_id, category_id, nombre, descripcion, precio, activo, creado_en")
    .eq("professional_id", userData.user.id)
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}