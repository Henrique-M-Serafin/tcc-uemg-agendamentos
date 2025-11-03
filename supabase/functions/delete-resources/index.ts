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
        "Access-Control-Allow-Origin": "*", // ou restringir ao seu front
        "Access-Control-Allow-Methods": "DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, content-type, apikey, x-client-info",
      },
    });
  }

  try {
    const { id } = await req.json();
    if (!id) throw new Error("ID do recurso não fornecido");

    // Verifica se existem agendamentos relacionados
    const { data: appointments, error: appointmentsError } = await supabase
      .from("Appointments")
      .select("id")
      .eq("resources_id", id);

    if (appointmentsError) throw appointmentsError;

    if (appointments && appointments.length > 0) {
      // Excluir logicamente
      const { error: updateError } = await supabase
        .from("Resources")
        .update({ is_active: false })
        .eq("id", id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          message:
            "Recurso desativado (há agendamentos vinculados, exclusão lógica aplicada).",
        }),
        {
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    } else {
      // Excluir completamente
      const { error: deleteError } = await supabase
        .from("Resources")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      return new Response(
        JSON.stringify({ message: "Recurso excluído permanentemente." }),
        {
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }
  } catch (err: any) {
    console.error("Erro na função delete-resources:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro interno no servidor" }),
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
});
