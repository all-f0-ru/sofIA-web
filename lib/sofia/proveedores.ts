import { responderSimulado } from "./responder";
import type { RespuestaSofia } from "./tipos";

/**
 * Punto único donde se elige cómo responde sofIA.
 *
 * - "simulado": modelo semántico por reglas + motor lógico + redactor con plantillas.
 *   No necesita servidor de IA ni base de datos. Es lo que se muestra en la feria.
 * - "ia": aquí se conectará la versión real (ver README, sección "Conectar la IA real").
 *   Los pasos 1 y 2 usarán el diccionario semántico de la empresa y la base de datos;
 *   el paso 4 enviará al modelo de lenguaje SOLO las cifras calculadas en el paso 3.
 */
export type ModoSofia = "simulado" | "ia";

export function modoActual(): ModoSofia {
  return process.env.SOFIA_MODO === "ia" ? "ia" : "simulado";
}

export async function responder(pregunta: string): Promise<RespuestaSofia> {
  if (modoActual() === "ia") {
    return responderConIA(pregunta);
  }
  return responderSimulado(pregunta);
}

async function responderConIA(pregunta: string): Promise<RespuestaSofia> {
  // TODO(sofIA): reemplazar por el pipeline real:
  //   1. const consulta = await modeloSemantico.interpretar(pregunta)
  //   2. const filas = await db.query(consulta.sql)
  //   3. const calculo = motor.calcular(consulta, filas)
  //   4. const texto = await redactorIA.redactar(calculo)
  // Mientras tanto se usa la versión simulada para que el sitio nunca quede sin respuesta.
  const respuesta = responderSimulado(pregunta);
  return { ...respuesta, notaRedaccion: `${respuesta.notaRedaccion} (modo IA aún no conectado: respuesta simulada)` };
}
