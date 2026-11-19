import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Configuración en .env.local (local) o en Netlify > Environment variables (producción)
const CODIGO_ADMIN = process.env.CODIGO_ADMIN || "";
const N8N_CARGA_URL = process.env.N8N_CARGA_URL || ""; // https://TU-DOMINIO-N8N/webhook/gealytics-cargar-archivo
const N8N_CARGA_HEADER = process.env.N8N_CARGA_HEADER || "x-api-key"; // nombre de la cabecera de la credencial Header Auth
const N8N_CARGA_KEY = process.env.N8N_CARGA_KEY || ""; // valor de esa credencial

const EXTENSIONES = [".xlsx", ".csv"]; // .sql queda fuera a propósito: no se ejecutan scripts subidos
const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  if (!CODIGO_ADMIN || !N8N_CARGA_URL || !N8N_CARGA_KEY) {
    return NextResponse.json({ error: "La carga de archivos no está configurada." }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "No se recibió ningún archivo válido." }, { status: 400 });
  }

  const codigo = String(formData.get("codigo") || "").trim();
  if (codigo !== CODIGO_ADMIN) {
    return NextResponse.json({ error: "Solo administradores pueden cargar datos." }, { status: 401 });
  }

  const archivo = formData.get("file");
  if (!archivo || !(archivo instanceof File) || archivo.size === 0) {
    return NextResponse.json({ error: "No se recibió ningún archivo válido." }, { status: 400 });
  }
  const nombre = archivo.name.toLowerCase();
  if (!EXTENSIONES.some((ext) => nombre.endsWith(ext))) {
    return NextResponse.json({ error: "Formato no soportado. Sube un archivo .xlsx o .csv." }, { status: 400 });
  }
  if (archivo.size > TAMANO_MAXIMO) {
    return NextResponse.json({ error: "El archivo supera el máximo de 5 MB." }, { status: 400 });
  }

  // Reenviar el archivo al webhook de carga en n8n (campo "file", el mismo que leen los nodos de extracción)
  const n8nForm = new FormData();
  n8nForm.append("file", archivo, archivo.name);

  try {
    const resN8n = await fetch(N8N_CARGA_URL, {
      method: "POST",
      headers: { [N8N_CARGA_HEADER]: N8N_CARGA_KEY, "ngrok-skip-browser-warning": "true" },
      body: n8nForm,
    });

    let data: { ok?: boolean; mensaje?: string } = {};
    try {
      data = await resN8n.json();
    } catch {
      /* n8n respondió algo que no es JSON */
    }

    if (resN8n.status === 401 || resN8n.status === 403) {
      return NextResponse.json({ error: "El servidor de carga rechazó la clave de acceso." }, { status: 502 });
    }
    if (!resN8n.ok || data.ok === false) {
      return NextResponse.json(
        { error: data.mensaje || `Error al procesar el archivo (${resN8n.status}).` },
        { status: 502 }
      );
    }

    return NextResponse.json({ respuesta: data.mensaje || "Datos cargados correctamente." });
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    return NextResponse.json({ error: "No se pudo conectar con el servidor de carga." }, { status: 502 });
  }
}
