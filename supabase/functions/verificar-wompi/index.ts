Deno.serve(async () => {
  const publicKey = Deno.env.get("WOMPI_PUBLIC_KEY");

  const respuesta = await fetch(`https://sandbox.wompi.co/v1/merchants/${publicKey}`);
  const datos = await respuesta.json();

  return new Response(JSON.stringify(datos), {
    headers: { "Content-Type": "application/json" },
  });
});