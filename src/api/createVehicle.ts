import { supabase } from "@/api/supabaseClient";

export async function createVehicle(vehicleData: {
  model: string;
  type: "Car" | "Bus" | "Van";
  capacity?: number;
  status?: "Ok" | "Manutenção";
}) {
  // 🔐 Pega o token do usuário logado
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  // 🚀 Chama a Edge Function de criação de veículos
  const response = await fetch(
    "https://ifhfkqaqthouuiulevgq.supabase.co/functions/v1/create-vehicle",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao criar veículo");
  }

  return responseData;
}
