import { supabase } from "@/api/supabaseClient";

export async function deleteAppointment(id: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const response = await fetch(
    "https://ifhfkqaqthouuiulevgq.supabase.co/functions/v1/delete-appointment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    }
  );

  if (!response.ok) throw new Error("Erro ao deletar agendamento");
  return response.json();
}
