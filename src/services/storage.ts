import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { supabase } from "./supabase";

export async function subirFotoPerfil(uriLocal: string): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No hay sesión activa.");

  const base64 = await FileSystem.readAsStringAsync(uriLocal, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const ruta = `${userData.user.id}/avatar.jpg`;

  const { error: errorSubida } = await supabase.storage
    .from("avatars")
    .upload(ruta, decode(base64), {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (errorSubida) throw errorSubida;

  const { data } = supabase.storage.from("avatars").getPublicUrl(ruta);
  return `${data.publicUrl}?t=${Date.now()}`;
}