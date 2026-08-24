import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAPEO_ESTADOS: Record<string, string> = {
  APPROVED: "aprobado",
  DECLINED: "rechazado",
  VOIDED: "cancelado",
  ERROR: "rechazado",
  PENDING: "procesando",
};

async function calcularChecksum(propiedades: string[], data: any, timestamp: number, secreto: string) {
  let cadena = "";
  for (const prop of propiedades) {
    const partes = prop.split(".");
    let valor = data;
    for (const parte of partes) valor = valor[parte];
    cadena += valor;
  }
  cadena += timestamp;
  cadena += secreto;

  const encoder = new TextEncoder();
  const bufferHash = await crypto.subtle.digest("SHA-256", encoder.encode(cadena));
  return Array.from(new Uint8Array(bufferHash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  const evento = await req.json();

  const checksumCalculado = await calcularChecksum(
    evento.signature.properties,
    evento.data,
    evento.timestamp,
    Deno.env.get("WOMPI_EVENTS_SECRET")!
  );

  if (checksumCalculado !== evento.signature.checksum) {
    return new Response(JSON.stringify({ error: "Firma inválida" }), { status: 401 });
  }

  if (evento.event === "transaction.updated") {
    const tx = evento.data.transaction;
    const nuevoEstado = MAPEO_ESTADOS[tx.status] ?? "procesando";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabaseAdmin
      .from("transactions")
      .update({ estado: nuevoEstado })
      .eq("wompi_reference", tx.payment_link_id);
  }

  return new Response(JSON.stringify({ recibido: true }), {
    headers: { "Content-Type": "application/json" },
  });
});