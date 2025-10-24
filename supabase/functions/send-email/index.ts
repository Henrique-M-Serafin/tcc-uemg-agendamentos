// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não está configurada!");
    }

    const { name, from, date, start_hour, end_hour, description } = await req.json();

    const adminEmail = "henrique.serafin2003@gmail.com";
    const htmlBody = `
      <h3>Nova solicitação de agendamento - Laboratório - ${name}</h3>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>E-mail do solicitante:</strong> ${from}</p>
      <p><strong>Data desejada:</strong> ${date}</p>
      <p><strong>Horário:</strong> ${start_hour} às ${end_hour}</p>
      ${description ? `<p><strong>Descrição:</strong> ${description}</p>` : ""}
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Agendamentos <onboarding@resend.dev>`,
        to: [adminEmail],
        subject: "Nova solicitação de agendamento",
        html: htmlBody,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify({ success: true, data }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: response.ok ? 200 : 400,
    });

  } catch (error) {
    console.error("Erro:", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 500,
    });
  }
});
