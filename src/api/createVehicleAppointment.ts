import { supabase } from "@/api/supabaseClient";

interface VehicleAppointmentPayload {
  vehicle_id: string | number;
  sponsor: string;
  date: string;
}

export async function createVehicleAppointment(formData: VehicleAppointmentPayload) {
  // Pega o token do usuário autenticado
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const response = await fetch(
    "https://ifhfkqaqthouuiulevgq.supabase.co/functions/v1/create-vehicle-appointment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao criar agendamento de veículo");
  }

  return response.json();
}
