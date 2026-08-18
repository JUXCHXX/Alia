import { supabase } from "./supabase";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { Review } from "../types/review";

export async function subirFotoReview(uriLocal: string, bookingId: string): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const base64 = await FileSystem.readAsStringAsync(uriLocal, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const ruta = `${userData.user.id}/${bookingId}.jpg`;

  const { error } = await supabase.storage
    .from("reviews")
    .upload(ruta, decode(base64), { contentType: "image/jpeg", upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("reviews").getPublicUrl(ruta);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function crearCalificacion(datos: {
  bookingId: string;
  calificacion: number;
  comentario: string;
  fotoUrl?: string;
}) {
  const { error } = await supabase.from("reviews").insert({
    booking_id: datos.bookingId,
    calificacion: datos.calificacion,
    comentario: datos.comentario || null,
    foto_url: datos.fotoUrl ?? null,
  });

  if (error) throw error;
}

export interface ReviewConCliente extends Review {
  bookings: {
    cliente_id: string;
    profiles: { nombre: string } | null;
  } | null;
}

export async function getCalificacionesDeProfesional(
  professionalId: string
): Promise<ReviewConCliente[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, bookings!inner(cliente_id, professional_id, profiles!bookings_cliente_id_fkey(nombre))")
    .eq("bookings.professional_id", professionalId)
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data ?? [];
}