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
        "Access-Control-Allow-Origin": "*", // ou restrinja ao domínio do front-end
        "Access-Control-Allow-Methods": "DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, content-type, apikey, x-client-info",
      },
    });
  }

  try {
    const { id } = await req.json();
    if (!id) throw new Error("ID do veículo não fornecido");

    // 🔹 Verifica se existem agendamentos relacionados ao veículo
    const { data: appointments, error: appointmentsError } = await supabase
      .from("VehicleAppointments")
      .select("id")
      .eq("vehicle_id", id);

    if (appointmentsError) throw appointmentsError;

    if (appointments && appointments.length > 0) {
      // 🔹 Exclusão lógica — desativa o veículo (campo is_active = false)
      const { error: updateError } = await supabase
        .from("Vehicles")
        .update({ is_active: false })
        .eq("id", id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          message:
            "Veículo desativado (há agendamentos vinculados, exclusão lógica aplicada).",
        }),
        {
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    } else {
      // 🔹 Exclusão permanente — nenhum agendamento relacionado
      const { error: deleteError } = await supabase
        .from("Vehicles")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      return new Response(
        JSON.stringify({ message: "Veículo excluído permanentemente." }),
        {
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }
  } catch (err: any) {
    console.error("Erro na função delete-vehicles:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro interno no servidor" }),
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
});
