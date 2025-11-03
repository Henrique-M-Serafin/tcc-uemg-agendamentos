import { supabase } from "@/api/supabaseClient";

export async function reactivateResource(id: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch(
    "https://ifhfkqaqthouuiulevgq.supabase.co/functions/v1/reactivate-resource",
    {
      method: "POST", // método POST para reativação
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    }
  );

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Erro ao reativar recurso");
  return result;
}
