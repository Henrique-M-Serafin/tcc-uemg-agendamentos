import { supabase } from "@/api/supabaseClient";

export async function updateResource(resourceId: number, updates: any) {
  // Pega o token do usuário logado
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  // Chama a Edge Function de update
  const response = await fetch(
    "https://ifhfkqaqthouuiulevgq.supabase.co/functions/v1/update-resource",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id: resourceId, ...updates }),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao atualizar recurso");
  }

  return responseData;
}
