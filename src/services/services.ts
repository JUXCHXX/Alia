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

export async function actualizarServicio(
  id: string,
  cambios: {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    category_id?: string;
  }
) {
  const { error } = await supabase.from("services").update(cambios).eq("id", id);
  if (error) throw error;
}
export async function cambiarEstadoServicio(id: string, activo: boolean) {
  const { error } = await supabase.from("services").update({ activo }).eq("id", id);
  if (error) throw error;
}
export interface ServicioConProfesional extends Service {
  profiles: { nombre: string } | null;
}

export async function getServiciosPorCategoria(
  categoryId: string
): Promise<ServicioConProfesional[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*, profiles(nombre)")
    .eq("category_id", categoryId)
    .eq("activo", true)
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
export async function getServiciosDeProfesional(
  professionalId: string
): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("professional_id", professionalId)
    .eq("activo", true)
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
export interface ServicioConDetalle extends Service {
  profiles: { nombre: string } | null;
  categories: { nombre: string } | null;
}

export async function getTodosLosServicios(): Promise<ServicioConDetalle[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*, profiles(nombre), categories(nombre)")
    .eq("activo", true)
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
export interface FiltrosBusqueda {
  query?: string;
  categoryId?: string | null;
  precioMax?: number | null;
}

export async function buscarServicios(
  filtros: FiltrosBusqueda
): Promise<ServicioConDetalle[]> {
  let consulta = supabase
    .from("services")
    .select("*, profiles(nombre), categories(nombre)")
    .eq("activo", true);

  if (filtros.query && filtros.query.trim()) {
    consulta = consulta.ilike("nombre", `%${filtros.query.trim()}%`);
  }

  if (filtros.categoryId) {
    consulta = consulta.eq("category_id", filtros.categoryId);
  }

  if (filtros.precioMax != null) {
    consulta = consulta.lte("precio", filtros.precioMax);
  }

  const { data, error } = await consulta.order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}