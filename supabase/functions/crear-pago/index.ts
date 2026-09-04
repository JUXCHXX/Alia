import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const { bookingId } = await req.json();
    const authHeader = req.headers.get("Authorization")!;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: booking, error: errorBooking } = await supabase
      .from("bookings")
      .select("id, estado, services(nombre, precio)")
      .eq("id", bookingId)
      .single();

    if (errorBooking || !booking) {
      return new Response(JSON.stringify({ error: "Solicitud no encontrada." }), { status: 404 });
    }
    if (booking.estado !== "aceptada") {
      return new Response(JSON.stringify({ error: "Solo se puede pagar una solicitud aceptada." }), { status: 400 });
    }

    const { data: transaccionExistente } = await supabase
      .from("transactions")
      .select("id")
      .eq("booking_id", bookingId)
      .eq("estado", "aprobado")
      .maybeSingle();

    if (transaccionExistente) {
      return new Response(JSON.stringify({ error: "Este servicio ya fue pagado." }), { status: 400 });
    }

    const precioServicio = booking.services.precio;

    const { data: transaccion, error: errorInsert } = await supabase
      .from("transactions")
      .insert({ booking_id: bookingId, precio_servicio: precioServicio })
      .select()
      .single();

    if (errorInsert) {
      return new Response(JSON.stringify({ error: errorInsert.message }), { status: 400 });
    }

    const wompiRes = await fetch("https://sandbox.wompi.co/v1/payment_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("WOMPI_PRIVATE_KEY")}`,
      },
      body: JSON.stringify({
        name: `Servicio Alía: ${booking.services.nombre}`,
        description: `Pago del servicio "${booking.services.nombre}" en Alía (incluye comisión y costo de procesamiento)`,
        single_use: true,
        collect_shipping: false,
        currency: "COP",
        amount_in_cents: Math.round(transaccion.monto_total * 100),
      }),
    });

    const wompiData = await wompiRes.json();

    if (!wompiRes.ok) {
      return new Response(JSON.stringify({ error: "No se pudo crear el link de pago.", detalle: wompiData }), { status: 400 });
    }

    const linkId = wompiData.data.id;
    const urlPago = `https://checkout.wompi.co/l/${linkId}`;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: errorUpdate } = await supabaseAdmin
      .from("transactions")
      .update({ wompi_reference: linkId })
      .eq("id", transaccion.id);

    if (errorUpdate) {
      return new Response(JSON.stringify({ error: "No se pudo guardar la referencia de pago." }), { status: 500 });
    }

    return new Response(JSON.stringify({ url: urlPago }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
