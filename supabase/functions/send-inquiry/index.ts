import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "info@psycortexcorporate.com";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Psycortex Consultas <onboarding@resend.dev>";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://psycortexcorporate.com";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  const isAllowed = origin && (
    origin.endsWith("psycortexcorporate.com") ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1")
  );
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .slice(0, 2000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY secret is not set in Supabase environment variables.");
    }

    const rawData = await req.json();
    const name = escapeHtml(rawData.name);
    const email = escapeHtml(rawData.email);
    const organization = escapeHtml(rawData.organization);
    const program = escapeHtml(rawData.engagement || rawData.engagement_type || "No especificado");
    const message = escapeHtml(rawData.message);

    // Format HTML Email Template with Psycortex branding
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F5F0; margin: 0; padding: 20px; color: #1c1917; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e7e5e4; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
          .header { border-bottom: 2px solid #D89A98; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { font-size: 22px; margin: 0; color: #1c1917; letter-spacing: -0.5px; }
          .badge { display: inline-block; background: rgba(216, 154, 152, 0.18); color: #9E5351; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 999px; margin-bottom: 10px; }
          .field-group { margin-bottom: 18px; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #78716c; margin-bottom: 4px; font-weight: 600; }
          .value { font-size: 15px; color: #1c1917; line-height: 1.5; background: #fafaf9; padding: 10px 14px; border-radius: 6px; border: 1px solid #f5f5f4; }
          .value a { color: #9E5351; text-decoration: none; font-weight: 500; }
          .message-box { font-size: 15px; color: #1c1917; line-height: 1.6; background: #fafaf9; padding: 14px; border-radius: 6px; border: 1px solid #f5f5f4; white-space: pre-wrap; }
          .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #f5f5f4; font-size: 12px; color: #a8a29e; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">Nueva Solicitud de Consulta</span>
            <h1>Psycortex Corporate Inquiry</h1>
          </div>

          <div class="field-group">
            <div class="label">Nombre Completo</div>
            <div class="value"><strong>${name || 'No especificado'}</strong></div>
          </div>

          <div class="field-group">
            <div class="label">Correo Electrónico</div>
            <div class="value"><a href="mailto:${email}">${email || 'No especificado'}</a></div>
          </div>

          <div class="field-group">
            <div class="label">Organización</div>
            <div class="value">${organization || 'No especificado'}</div>
          </div>

          <div class="field-group">
            <div class="label">Tipo de Programa / Compromiso</div>
            <div class="value"><strong>${program}</strong></div>
          </div>

          <div class="field-group">
            <div class="label">Desafíos Actuales / Objetivos</div>
            <div class="message-box">${message || 'Sin mensaje adicional'}</div>
          </div>

          <div class="footer">
            Enviado automáticamente desde el formulario web de Psycortex • ${new Date().toLocaleString('es-ES', { timeZone: 'America/El_Salvador' })}
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFICATION_EMAIL],
        reply_to: email,
        subject: `Nueva Consulta Psycortex: ${name} (${organization || 'Organización'})`,
        html: htmlContent,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      console.error("Resend error:", resData);
      return new Response(JSON.stringify({ error: resData }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: resData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
