import { supabase } from "@/api/supabaseClient";

export async function createResource(resourceData: {
  name: string;
  type: "Lab" | "Aud";
  capacity?: number;
}) {
  // 🔐 Pega o token do usuário logado
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  // 🚀 Chama a Edge Function de criação de recursos
  const response = await fetch(
    "https://ifhfkqaqthouuiulevgq.supabase.co/functions/v1/create-resource",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(resourceData),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao criar recurso");
  }

  return responseData;
}
