import { supabase } from "./supabase";
import { Message } from "../types/message";

export async function getMensajes(bookingId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, booking_id, remitente_id, contenido, creado_en")
    .eq("booking_id", bookingId)
    .order("creado_en", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function enviarMensaje(bookingId: string, contenido: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const { error } = await supabase.from("messages").insert({
    booking_id: bookingId,
    remitente_id: userData.user.id,
    contenido,
  });

  if (error) throw error;
}