import { ORDENES, PERIODO } from "./datos";
import type { Interpretacion, OrdenTrabajo } from "./tipos";

/**
 * Modelo semántico (versión simulada).
 * Traduce la pregunta en lenguaje natural a una intención, entidades y métricas,
 * y genera la consulta SQL equivalente sobre el esquema del taller.
 *
 * En la versión real, esta capa usará el diccionario semántico de cada empresa
 * (entidades, sinónimos y métricas) y un modelo de lenguaje para casos ambiguos.
 */

export type Consulta =
  | { tipo: "orden"; orden: OrdenTrabajo }
  | { tipo: "ranking_tiempo" }
  | { tipo: "sobreconsumo" }
  | { tipo: "productividad" }
  | { tipo: "resumen" }
  | { tipo: "desconocida" };

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Diccionario de sinónimos → métrica. El orden importa: gana la primera coincidencia. */
const REGLAS: { patron: RegExp; tipo: Exclude<Consulta["tipo"], "orden" | "desconocida"> }[] = [
  { patron: /operari|productiv|quien/, tipo: "productividad" },
  { patron: /tiempo|hora|demor|atras|lent/, tipo: "ranking_tiempo" },
  { patron: /material|merma|kg|kilo|desperdic|sobreconsum|perd/, tipo: "sobreconsumo" },
  { patron: /resumen|semana|estado|como va|general|kpi/, tipo: "resumen" },
];

export function interpretar(pregunta: string): Consulta {
  const s = normalizar(pregunta);
  const m = s.match(/(?:ot[\s-]*)?(26\d\d)/);
  if (m) {
    const orden = ORDENES.find((o) => o.id === `OT-${m[1]}`);
    if (orden) return { tipo: "orden", orden };
  }
  for (const regla of REGLAS) {
    if (regla.patron.test(s)) return { tipo: regla.tipo };
  }
  return { tipo: "desconocida" };
}

export function describir(c: Consulta): Interpretacion {
  switch (c.tipo) {
    case "orden":
      return { intencion: "explicar_desviacion", entidad: c.orden.id, metrica: "desv_material, desv_tiempo", periodo: PERIODO };
    case "ranking_tiempo":
      return { intencion: "ranking", entidad: "todas las OT", metrica: "desv_tiempo", periodo: PERIODO, extra: { orden: "desc, top 3" } };
    case "sobreconsumo":
      return { intencion: "agregar", entidad: "todas las OT", metrica: "sobreconsumo_kg", periodo: PERIODO };
    case "productividad":
      return { intencion: "comparar", entidad: "operarios", metrica: "productividad", periodo: PERIODO };
    case "resumen":
      return { intencion: "resumen", entidad: "todas las OT", metrica: "estado, reprocesos, eficiencia", periodo: PERIODO };
    default:
      return { intencion: "desconocida", entidad: "—", metrica: "—" };
  }
}

export function generarSQL(c: Consulta): string {
  switch (c.tipo) {
    case "orden":
      return `SELECT ot, mat_est, mat_real,
  ROUND((mat_real-mat_est)/mat_est*100,1) AS desv_mat,
  ROUND((t_real-t_est)/t_est*100,1)     AS desv_t,
  reprocesos, proceso, operario
FROM ordenes_trabajo
WHERE ot = '${c.orden.id}';`;
    case "ranking_tiempo":
      return `SELECT ot, proceso,
  ROUND((t_real-t_est)/t_est*100,1) AS desv_t
FROM ordenes_trabajo
WHERE semana = 42
ORDER BY desv_t DESC
LIMIT 3;`;
    case "sobreconsumo":
      return `SELECT ot, proceso,
  GREATEST(mat_real-mat_est,0) AS sobre_kg
FROM ordenes_trabajo
WHERE semana = 42
ORDER BY sobre_kg DESC;`;
    case "productividad":
      return `SELECT operario, COUNT(*) AS ot,
  ROUND(SUM(t_est)/SUM(t_real)*100,1) AS productividad
FROM ordenes_trabajo
WHERE semana = 42
GROUP BY operario
ORDER BY productividad DESC;`;
    case "resumen":
      return `SELECT estado, COUNT(*) FROM v_kpi_ot
WHERE semana = 42 GROUP BY estado;
SELECT AVG(eficiencia),
  AVG(CASE WHEN reprocesos>0 THEN 1 ELSE 0 END)
FROM v_kpi_ot WHERE semana = 42;`;
    default:
      return "-- No se generó consulta: el modelo\n-- semántico no reconoció una métrica\n-- ni una orden en la pregunta.";
  }
}
