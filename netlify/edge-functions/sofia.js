// netlify/edge-functions/sofia.js
// Proxy entre el sitio y el flujo de n8n. Guarda la clave del webhook en el servidor
// (nunca en el navegador) y asigna la identidad del usuario según su código de acceso.
//
// Variables de entorno en Netlify (Site configuration > Environment variables):
//   SOFIA_WEBHOOK_URL  https://TU-DOMINIO-N8N/webhook/sofia-chat
//   SOFIA_API_KEY      la misma clave de la credencial "sofIA API key" (cabecera x-api-key)
//   SOFIA_USERS        {"CLAVE-GERENCIA":{"userId":"gerencia","rol":"gerencia"},"CLAVE-SUP":{"userId":"supervisor1","rol":"supervisor"}}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const leerUsuarios = () => {
  try { return JSON.parse(Netlify.env.get('SOFIA_USERS') || '{}'); } catch { return {}; }
};

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'metodo' }, 405);

  let b;
  try {
    const texto = await request.text();
    if (texto.length > 4000) return json({ error: 'solicitud' }, 413);
    b = JSON.parse(texto);
  } catch {
    return json({ error: 'solicitud' }, 400);
  }

  // 1) Acceso: el código identifica al usuario. El navegador NO decide userId ni rol.
  const codigo = String(b.codigo || '').trim();
  const usuario = codigo ? leerUsuarios()[codigo] : null;
  if (!usuario || !usuario.userId) {
    await new Promise((r) => setTimeout(r, 800)); // frena intentos repetidos
    return json({ error: 'acceso' }, 401);
  }
  if (b.ping) return json({ ok: true, esAdmin: usuario.rol === 'administrador' });

  // 2) Validación mínima del mensaje
  const message = String(b.message || '').trim().slice(0, 1000);
  if (!message) return json({ error: 'vacio' }, 400);
  const sessionId = String(b.sessionId || '').replace(/[^\w-]/g, '').slice(0, 64);

  const url = Netlify.env.get('SOFIA_WEBHOOK_URL');
  const key = Netlify.env.get('SOFIA_API_KEY');
  if (!url || !key) return json({ error: 'configuracion' }, 500);

  // 3) Llamada a n8n (el encabezado de respuesta de una Edge Function admite hasta 40 s)
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ message, sessionId, userId: usuario.userId, rol: usuario.rol || 'sin-rol' }),
      signal: AbortSignal.timeout(38000),
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data || typeof data.respuesta !== 'string') return json({ error: 'upstream' }, 502);
    return json({ respuesta: data.respuesta, estado: data.estado || 'ok' });
  } catch (e) {
    return json({ error: e && e.name === 'TimeoutError' ? 'timeout' : 'upstream' }, e && e.name === 'TimeoutError' ? 504 : 502);
  }
};

export const config = { path: '/api/sofia' };
