-- ==========================================================
-- PSYCORTEX - RESEND EMAIL TRIGGER ON CONSULTATION SUBMISSION
-- ==========================================================
-- Ejecuta este script en el SQL Editor de tu Supabase Dashboard:
-- https://supabase.com/dashboard/project/yefobyrygndbvhuzhkop/sql/new

-- 1. Habilitar la extensión pg_net (nativa en Supabase)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Crear la función que envía el correo a través de la API de Resend
CREATE OR REPLACE FUNCTION public.send_inquiry_resend_email()
RETURNS TRIGGER AS $$
DECLARE
  email_body JSONB;
BEGIN
  email_body := jsonb_build_object(
    'from', 'Psycortex Consultas <onboarding@resend.dev>',
    'to', jsonb_build_array('info@psycortexcorporate.com'),
    'reply_to', NEW.email,
    'subject', 'Nueva Consulta Psycortex: ' || COALESCE(NEW.name, 'Solicitante') || ' (' || COALESCE(NEW.organization, 'Organización') || ')',
    'html', '<!DOCTYPE html>' ||
            '<html><head><meta charset="utf-8">' ||
            '<style>' ||
            'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #F7F5F0; margin: 0; padding: 24px; color: #1c1917; }' ||
            '.card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e7e5e4; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04); }' ||
            '.header { border-bottom: 2px solid #D89A98; padding-bottom: 16px; margin-bottom: 24px; }' ||
            '.badge { display: inline-block; background: rgba(216, 154, 152, 0.2); color: #9E5351; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 999px; margin-bottom: 8px; }' ||
            'h1 { font-size: 22px; margin: 0; color: #1c1917; }' ||
            '.field { margin-bottom: 16px; }' ||
            '.label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #78716c; margin-bottom: 4px; font-weight: 600; }' ||
            '.val { font-size: 15px; color: #1c1917; background: #fafaf9; padding: 10px 14px; border-radius: 6px; border: 1px solid #f5f5f4; }' ||
            '.val a { color: #9E5351; text-decoration: none; font-weight: 500; }' ||
            '.msg { font-size: 15px; color: #1c1917; background: #fafaf9; padding: 14px; border-radius: 6px; border: 1px solid #f5f5f4; white-space: pre-wrap; line-height: 1.5; }' ||
            '.footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f5f5f4; font-size: 12px; color: #a8a29e; text-align: center; }' ||
            '</style></head>' ||
            '<body>' ||
            '<div class="card">' ||
            '  <div class="header">' ||
            '    <span class="badge">Nueva Consulta Web</span>' ||
            '    <h1>Psycortex Corporate</h1>' ||
            '  </div>' ||
            '  <div class="field"><div class="label">Nombre Completo</div><div class="val"><strong>' || COALESCE(NEW.name, 'No especificado') || '</strong></div></div>' ||
            '  <div class="field"><div class="label">Correo Electrónico</div><div class="val"><a href="mailto:' || COALESCE(NEW.email, '') || '">' || COALESCE(NEW.email, 'No especificado') || '</a></div></div>' ||
            '  <div class="field"><div class="label">Organización / Empresa</div><div class="val">' || COALESCE(NEW.organization, 'No especificado') || '</div></div>' ||
            '  <div class="field"><div class="label">Tipo de Programa</div><div class="val"><strong>' || COALESCE(NEW.engagement_type, 'No especificado') || '</strong></div></div>' ||
            '  <div class="field"><div class="label">Desafíos Actuales / Objetivos</div><div class="msg">' || COALESCE(NEW.message, 'Sin mensaje') || '</div></div>' ||
            '  <div class="footer">Enviado automáticamente desde el sitio web de Psycortex</div>' ||
            '</div></body></html>'
  );

  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.resend_api_key', true) -- Or replace with 'Bearer re_your_api_key'
    ),
    body := email_body
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear el Trigger en la tabla inquiries
DROP TRIGGER IF EXISTS on_inquiry_created_send_resend_email ON public.inquiries;

CREATE TRIGGER on_inquiry_created_send_resend_email
  AFTER INSERT ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.send_inquiry_resend_email();
