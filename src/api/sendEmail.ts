export async function sendEmail(formData: any) {
  const response = await fetch(
    "https://ifhfkqaqthouuiulevgq.functions.supabase.co/send-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // 👇 Adicione esta linha:
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(formData),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    console.error("Erro do servidor:", data);
    throw new Error(data.error || "Erro ao enviar e-mail");
  }

  return data;
}
