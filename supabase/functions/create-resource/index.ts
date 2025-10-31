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
    const { name, type, capacity } = await req.json();

    // 🔹 Validações básicas
    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: "O nome do recurso é obrigatório." }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (!type || !["Lab", "Aud"].includes(type)) {
      return new Response(
        JSON.stringify({ success: false, error: "O tipo do recurso é obrigatório e deve ser 'Lab' ou 'Aud'." }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ⚙️ Montar objeto do novo recurso
    const newResource = {
      name,
      type,
      capacity: capacity ?? null,
    };

    // 💾 Inserir no banco
    const { data, error } = await supabase
      .from("Resources")
      .insert([newResource])
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: unknown) {
    console.error("Erro ao criar recurso:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
