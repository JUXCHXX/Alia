import { supabase } from "./supabase";

export interface EstadisticasGenerales {
  totalClientes: number;
  totalProfesionales: number;
  totalServiciosActivos: number;
  solicitudesPendientes: number;
}

export async function getEstadisticasGenerales(): Promise<EstadisticasGenerales> {
  const [clientes, profesionales, servicios, solicitudes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("rol", "cliente"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("rol", "profesional"),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("activo", true),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("estado", "pendiente"),
  ]);

  return {
    totalClientes: clientes.count ?? 0,
    totalProfesionales: profesionales.count ?? 0,
    totalServiciosActivos: servicios.count ?? 0,
    solicitudesPendientes: solicitudes.count ?? 0,
  };
}

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  rol: string;
  ciudad: string | null;
  telefono: string | null;
  suspendido: boolean;
  creado_en: string;
}

export async function getUsuarios(): Promise<UsuarioAdmin[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nombre, rol, ciudad, telefono, suspendido, creado_en")
    .eq("rol", "cliente")
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export interface ProfesionalAdmin {
  id: string;
  estado_verificacion: string;
  bio: string | null;
  zona_trabajo: string | null;
  fecha_solicitud: string;
  profiles: { nombre: string; telefono: string | null; foto_url: string | null } | null;
}

export async function getProfesionalesPendientes(): Promise<ProfesionalAdmin[]> {
  const { data, error } = await supabase
    .from("professional_profiles")
    .select("id, estado_verificacion, bio, zona_trabajo, fecha_solicitud, profiles(nombre, telefono, foto_url)")
    .eq("estado_verificacion", "pendiente")
    .order("fecha_solicitud", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function aprobarProfesional(id: string) {
  const { error: error1 } = await supabase
    .from("professional_profiles")
    .update({ estado_verificacion: "aprobado", fecha_revision: new Date().toISOString() })
    .eq("id", id);
  if (error1) throw error1;

  const { error: error2 } = await supabase
    .from("profiles")
    .update({ rol: "profesional" })
    .eq("id", id);
  if (error2) throw error2;
}

export async function rechazarProfesional(id: string, notas: string) {
  const { error } = await supabase
    .from("professional_profiles")
    .update({ estado_verificacion: "rechazado", fecha_revision: new Date().toISOString(), notas_admin: notas })
    .eq("id", id);
  if (error) throw error;
}