import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const LARGO_MAXIMO = 300;
// Valores en .env.local (local) o en Netlify > Environment variables. Nunca escribirlos aquí: el repositorio es público.
const CODIGO_ACCESO = process.env.CODIGO_ACCESO || "";
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";
const CODIGO_ADMIN = process.env.CODIGO_ADMIN || "";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

export async function POST(request: Request) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo debe ser JSON válido." },
      { status: 400 }
    );
  }
  // 1. Validar el código de acceso (Usuario normal o Administrador)
const codigoRecibido = typeof cuerpo.codigo === "string" ? cuerpo.codigo.trim() : "";
const esAdmin = CODIGO_ADMIN !== "" && codigoRecibido === CODIGO_ADMIN;

if ((!CODIGO_ACCESO || codigoRecibido !== CODIGO_ACCESO) && !esAdmin) {
  return NextResponse.json(
    { error: "Código de acceso inválido." },
    { status: 401 }
  );
}

// 2. Si el widget solo está comprobando el código (ping: true), devolvemos si esAdmin
if (cuerpo.ping === true) {
  return NextResponse.json({ ok: true, esAdmin });
}


  // 1. Validar el código de acceso enviado por el widget
  //const codigoRecibido = typeof cuerpo.codigo === "string" ? cuerpo.codigo.trim() : "";
  //if (codigoRecibido !== CODIGO_ACCESO) {
    //return NextResponse.json(
      //{ error: "Código de acceso inválido." },
      //{ status: 401 }
    //);
  //}

  // 2. Si el widget solo está comprobando el código (ping: true), respondemos OK (200)
  if (cuerpo.ping === true) {
    return NextResponse.json({ ok: true });
  }

  // 3. Validar la pregunta enviada en el campo "message" (o "pregunta")
  const rawPregunta = cuerpo.message ?? cuerpo.pregunta;
  const pregunta = typeof rawPregunta === "string" ? rawPregunta.trim() : "";

  if (!pregunta) {
    return NextResponse.json(
      { error: "Escribe una pregunta para sofIA." },
      { status: 400 }
    );
  }
  if (pregunta.length > LARGO_MAXIMO) {
    return NextResponse.json(
      { error: `La pregunta puede tener hasta ${LARGO_MAXIMO} caracteres.` },
      { status: 400 }
    );
  }

  // 4. Enviar la pregunta y el sessionId al webhook de n8n
  try {
    const resN8n = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": N8N_API_KEY,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
      action: "sendMessage",
      pregunta,
      chatInput: pregunta,
      sessionId: typeof cuerpo.sessionId === "string" ? cuerpo.sessionId : "sesion-demo",
    }),

    });

    if (!resN8n.ok) {
      return NextResponse.json(
        { error: `Error al comunicar con sofIA (${resN8n.status}).` },
        { status: 502 }
      );
    }

    const dataN8n = await resN8n.json();

    // Extraer el texto sin importar cómo lo nombre n8n
    const texto =
      dataN8n.respuesta ||
      dataN8n.output ||
      dataN8n.text ||
      (Array.isArray(dataN8n) && dataN8n[0]?.output) ||
      "No se recibió respuesta del agente.";

    // El widget espera exactamente el campo "respuesta" como string
    return NextResponse.json({ respuesta: String(texto) });
  } catch (error) {
    console.error("Error conectando con n8n:", error);
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor de sofIA." },
      { status: 500 }
    );
  }
}
