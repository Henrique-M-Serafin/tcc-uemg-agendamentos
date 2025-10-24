import { supabase } from "@/api/supabaseClient";

export async function createAppointment(formData: any) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const response = await fetch(
    "https://ifhfkqaqthouuiulevgq.functions.supabase.co/create-appointment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) throw new Error("Erro ao criar agendamento");
  return response.json();
}
