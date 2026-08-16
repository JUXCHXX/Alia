import { supabase } from "./supabase";

export async function crearSolicitud(datos: {
  serviceId: string;
  professionalId: string;
  mensaje: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { error } = await supabase.from("bookings").insert({
    cliente_id: userData.user.id,
    professional_id: datos.professionalId,
    service_id: datos.serviceId,
    mensaje: datos.mensaje,
  });

  if (error) throw error;
}
import { Booking } from "../types/booking";

export interface SolicitudRecibida extends Booking {
  profiles: { nombre: string; telefono: string | null } | null;
  services: { nombre: string } | null;
}

export async function getSolicitudesRecibidas(): Promise<SolicitudRecibida[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles!bookings_cliente_id_fkey(nombre, telefono), services(nombre)")
    .eq("professional_id", userData.user.id)
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
export async function aceptarSolicitud(id: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ estado: "aceptada" })
    .eq("id", id)
    .eq("estado", "pendiente");

  if (error) throw error;
}
export interface SolicitudEnviada extends Booking {
  profiles: { nombre: string } | null;
  services: { nombre: string } | null;
}

export async function getMisSolicitudesEnviadas(): Promise<SolicitudEnviada[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles!bookings_professional_id_fkey(nombre), services(nombre)")
    .eq("cliente_id", userData.user.id)
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
export async function rechazarSolicitud(id: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ estado: "rechazada" })
    .eq("id", id)
    .eq("estado", "pendiente");

  if (error) throw error;
}
export async function cancelarSolicitud(id: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ estado: "cancelada" })
    .eq("id", id)
    .in("estado", ["pendiente", "aceptada"]);

  if (error) throw error;
}
export async function completarSolicitud(id: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ estado: "completada" })
    .eq("id", id)
    .eq("estado", "aceptada");

  if (error) throw error;
}