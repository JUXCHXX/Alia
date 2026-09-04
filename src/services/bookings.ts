import { supabase } from "./supabase";
import { Booking } from "../types/booking";

export interface SolicitudRecibida extends Booking {
  profiles: { nombre: string; telefono: string | null } | null;
  services: { nombre: string } | null;
}

export interface SolicitudEnviada extends Booking {
  profiles: { nombre: string } | null;
  services: { nombre: string } | null;
}

export interface HistorialItem extends Booking {
  profiles: { nombre: string } | null;
  services: { nombre: string; precio: number } | null;
  reviews: { calificacion: number }[] | null;
}

export interface HistorialProfesionalItem extends Booking {
  profiles: { nombre: string } | null;
  services: { nombre: string; precio: number } | null;
}

export interface MovimientoFinanciero {
  id: string;
  estado: string;
  precio_servicio: number;
  monto_profesional: number;
  profesional_pagado: boolean;
  profesional_pagado_en: string | null;
  creado_en: string;
  bookings: {
    professional_id: string;
    services: { nombre: string } | null;
    profiles: { nombre: string } | null;
  } | null;
}

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

export async function getSolicitudesRecibidas(): Promise<SolicitudRecibida[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles!bookings_cliente_id_fkey(nombre, telefono), services(nombre)")
    .eq("professional_id", userData.user.id)
    .in("estado", ["pendiente", "aceptada", "en_progreso"])
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMisSolicitudesEnviadas(): Promise<SolicitudEnviada[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles!bookings_professional_id_fkey(nombre), services(nombre)")
    .eq("cliente_id", userData.user.id)
    .in("estado", ["pendiente", "aceptada", "en_progreso"])
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMiHistorial(): Promise<HistorialItem[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles!bookings_professional_id_fkey(nombre), services(nombre, precio), reviews(calificacion)")
    .eq("cliente_id", userData.user.id)
    .in("estado", ["completada", "cancelada", "rechazada"])
    .order("actualizado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getHistorialProfesional(): Promise<HistorialProfesionalItem[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles!bookings_cliente_id_fkey(nombre), services(nombre, precio)")
    .eq("professional_id", userData.user.id)
    .in("estado", ["completada", "cancelada", "rechazada"])
    .order("actualizado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMisGanancias(): Promise<MovimientoFinanciero[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, estado, precio_servicio, monto_profesional, profesional_pagado, profesional_pagado_en, creado_en, bookings!inner(professional_id, services(nombre), profiles!bookings_cliente_id_fkey(nombre))"
    )
    .eq("bookings.professional_id", userData.user.id)
    .eq("estado", "aprobado")
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as MovimientoFinanciero[];
}

export async function aceptarSolicitud(id: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ estado: "aceptada" })
    .eq("id", id)
    .eq("estado", "pendiente");

  if (error) throw error;
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
    .in("estado", ["pendiente", "aceptada", "en_progreso"]);

  if (error) throw error;
}

export async function iniciarServicio(id: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ estado: "en_progreso", iniciado_en: new Date().toISOString() })
    .eq("id", id)
    .eq("estado", "aceptada");

  if (error) throw error;
}

export async function completarSolicitud(id: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ estado: "completada", completado_en: new Date().toISOString() })
    .eq("id", id)
    .eq("estado", "en_progreso");

  if (error) throw error;
}

export async function getEstadoBooking(id: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("estado")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data?.estado ?? null;
}
export async function crearPago(bookingId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("crear-pago", {
    body: { bookingId },
  });

  if (error) {
    let mensaje = error.message;
    try {
      const cuerpo = await error.context.json();
      mensaje = cuerpo.error ?? mensaje;
      if (cuerpo.detalle) {
        mensaje += "\n\n" + JSON.stringify(cuerpo.detalle);
      }
    } catch {
      // si no se puede leer el cuerpo, nos quedamos con el mensaje genérico
    }
    throw new Error(mensaje);
  }

  if (data?.error) {
    let mensaje = data.error;
    if (data.detalle) mensaje += "\n\n" + JSON.stringify(data.detalle);
    throw new Error(mensaje);
  }

  return data.url;
}
