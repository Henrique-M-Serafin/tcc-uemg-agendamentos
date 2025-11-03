import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, content-type, apikey, x-client-info",
      },
    });
  }

  try {
    const { id } = await req.json();
    if (!id) throw new Error("ID do recurso não fornecido");

    // 🔹 Atualiza o recurso para ativo
    const { error: updateError } = await supabase
      .from("Resources")
      .update({ is_active: true })
      .eq("id", id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        message: "Recurso reativado com sucesso.",
      }),
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err: any) {
    console.error("Erro na função reactivate-resource:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro interno no servidor" }),
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
});
