import { NextResponse } from "next/server";
import { responder } from "@/lib/sofia/proveedores";

export const dynamic = "force-dynamic";

const LARGO_MAXIMO = 300;

/** POST /api/preguntar  { "pregunta": "¿Por qué la OT-2611 se pasó en material?" } */
export async function POST(request: Request) {
  let cuerpo: { pregunta?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo debe ser JSON con el campo \"pregunta\"." }, { status: 400 });
  }

  const pregunta = typeof cuerpo.pregunta === "string" ? cuerpo.pregunta.trim() : "";
  if (!pregunta) {
    return NextResponse.json({ error: "Escribe una pregunta para sofIA." }, { status: 400 });
  }
  if (pregunta.length > LARGO_MAXIMO) {
    return NextResponse.json({ error: `La pregunta puede tener hasta ${LARGO_MAXIMO} caracteres.` }, { status: 400 });
  }

  const respuesta = await responder(pregunta);
  return NextResponse.json(respuesta);
}
