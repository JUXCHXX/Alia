import { supabase } from "./supabase";

export type Nivel = "semilla" | "raiz" | "roble";

export interface NivelProfesional {
  nivel: Nivel;
  totalServicios: number;
  promedioCalificacion: number | null;
}

export const NIVEL_INFO: Record<Nivel, { nombre: string; emoji: string }> = {
  semilla: { nombre: "Semilla", emoji: "🌱" },
  raiz: { nombre: "Raíz", emoji: "🌿" },
  roble: { nombre: "Roble", emoji: "🌳" },
};

export async function getNivelProfesional(professionalId: string): Promise<NivelProfesional> {
  const { count, error: errorCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("professional_id", professionalId)
    .eq("estado", "completada");

  if (errorCount) throw errorCount;

  const { data: reviewsData, error: errorReviews } = await supabase
    .from("reviews")
    .select("calificacion, bookings!inner(professional_id)")
    .eq("bookings.professional_id", professionalId);

  if (errorReviews) throw errorReviews;

  const totalServicios = count ?? 0;
  const calificaciones = reviewsData?.map((r) => r.calificacion) ?? [];
  const promedioCalificacion =
    calificaciones.length > 0
      ? calificaciones.reduce((suma, c) => suma + c, 0) / calificaciones.length
      : null;

  let nivel: Nivel = "semilla";
  if (totalServicios >= 40 && (promedioCalificacion ?? 0) >= 4.5) {
    nivel = "roble";
  } else if (totalServicios >= 10 && (promedioCalificacion ?? 0) >= 3.5) {
    nivel = "raiz";
  }

  return { nivel, totalServicios, promedioCalificacion };
}