import { supabase } from "./supabase";
import { Category } from "../types/category";

export async function getCategorias(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, nombre, slug")
    .order("nombre");

  if (error) throw error;
  return data ?? [];
}