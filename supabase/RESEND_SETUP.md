# Guía de Conexión de Resend con Psycortex y Supabase

Esta guía te permite recibir un correo cada vez que un cliente envía una solicitud de consulta en el sitio web de Psycortex.

---

## 1. Obtener tu API Key de Resend

1. Ve a [Resend.com](https://resend.com) e inicia sesión o regístrate.
2. Ve a **API Keys** y haz clic en **Create API Key**.
3. Dale un nombre (ej. `Psycortex Website`) con permisos de **Full access** o **Sending access**.
4. Copia tu clave (empieza con `re_...`).

*(Opcional recomendado)*: En Resend > **Domains**, puedes verificar tu dominio corporativo para enviar correos desde `notificaciones@tudominio.com`. Si no tienes dominio verificado aún, puedes usar `onboarding@resend.dev` para enviar al correo de tu cuenta de Resend.

---

## 2. Configuración en Supabase (Opción Rápida desde el Dashboard)

Tu proyecto de Supabase actual es:
- **URL**: `https://yefobyrygndbvhuzhkop.supabase.co`

### Opción A: Supabase Edge Function (Recomendado)

1. Abre tu **Supabase Dashboard** en [https://supabase.com/dashboard/project/yefobyrygndbvhuzhkop](https://supabase.com/dashboard/project/yefobyrygndbvhuzhkop).
2. En el menú lateral izquierdo, haz clic en **Edge Functions**.
3. Haz clic en **Create a Function** y nómbrala: `send-inquiry`.
4. Pega el código que se encuentra en [supabase/functions/send-inquiry/index.ts](file:///Users/tariqwest/.gemini/antigravity/scratch/psycho-balance/supabase/functions/send-inquiry/index.ts).
5. Ve a **Edge Functions** > **Secrets** (o **Project Settings** > **Configuration** > **Edge Function Secrets**) y agrega las siguientes variables de entorno:
   - `RESEND_API_KEY`: Tu clave de Resend (`re_...`)
   - `NOTIFICATION_EMAIL`: `Psycortexcorporate@gmail.com` (o el correo donde deseas recibir las alertas)
   - `FROM_EMAIL`: `Psycortex Consultas <onboarding@resend.dev>` (o `notificaciones@tudominio.com` si verificaste tu dominio)
6. Guarda los cambios. ¡Listo! El formulario web ya está configurado para invocar esta función automáticamente.

---

### Opción B: Despliegue con Supabase CLI (Vía Terminal)

Si prefieres desplegar mediante la terminal:

```bash
# 1. Iniciar sesión en Supabase
npx supabase login

# 2. Enlazar con tu proyecto
npx supabase link --project-ref yefobyrygndbvhuzhkop

# 3. Establecer los secretos de Resend
npx supabase secrets set RESEND_API_KEY=re_TU_CLAVE_AQUI NOTIFICATION_EMAIL=Psycortexcorporate@gmail.com

# 4. Desplegar la función
npx supabase functions deploy send-inquiry --no-verify-jwt
```

---

## 3. ¿Qué datos incluye la notificación de correo?

Cada vez que un usuario envíe el formulario de contacto, recibirás un correo con diseño corporativo que incluye:
- **Nombre completo** del solicitante
- **Correo electrónico corporativo** (con botón de respuesta directa / `reply-to`)
- **Organización / Empresa**
- **Tipo de programa seleccionado** (Esencial, Integral, Estratégico 360, etc.)
- **Desafíos actuales y objetivos detallados**
- **Fecha y hora** exacta del registro
