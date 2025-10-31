import { supabase } from "@/api/supabaseClient";

export async function deleteVehicleAppointment(id: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error("Usuário não autenticado");

  const res = await fetch(
    "https://ifhfkqaqthouuiulevgq.supabase.co/functions/v1/delete-vehicle-appointment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    }
  );

  if (!res.ok) throw new Error("Erro ao excluir agendamento de veículo");
  return res.json();
}
