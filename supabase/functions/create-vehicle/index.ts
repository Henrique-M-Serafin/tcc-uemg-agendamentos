// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // ✅ CORS completo
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // 📦 Ler corpo da requisição
    const { model, type, capacity, status } = await req.json();

    // 🔹 Validações básicas
    if (!model) {
      return new Response(
        JSON.stringify({ success: false, error: "O modelo do veículo é obrigatório." }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (!type || !["Car", "Bus", "Van"].includes(type)) {
      return new Response(
        JSON.stringify({ success: false, error: "O tipo do veículo é obrigatório e deve ser 'Car', 'Bus' ou 'Van'." }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ⚙️ Montar objeto do novo veículo
    const newVehicle = {
      model,
      type,
      capacity: capacity ?? null,
      status: status ?? "Ok",
    };

    // 💾 Inserir no banco
    const { data, error } = await supabase
      .from("Vehicles")
      .insert([newVehicle])
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: unknown) {
    console.error("Erro ao criar veículo:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
