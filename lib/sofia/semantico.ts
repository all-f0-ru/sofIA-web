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
    .replace(/[\u0300-\u036f]/g, "");
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

/* ------------------------------------------------------------------
   Resaltado: marca qué partes de la pregunta reconoció el modelo.
   Se usa en la portada y en "Cómo piensa sofIA".
   ------------------------------------------------------------------ */

export type TipoToken = "entidad" | "metrica" | "intencion" | "periodo";

export interface Segmento {
  texto: string;
  tipo?: TipoToken;
}

const PATRONES_RESALTADO: { tipo: TipoToken; patron: RegExp }[] = [
  { tipo: "entidad", patron: /\b(?:ot[\s-]*)?26\d\d\b|\bordenes?\b|\boperari[oa]s?\b|\bpartidas?\b|\brutas?\b|\bproductos?\b/g },
  { tipo: "periodo", patron: /\besta semana\b|\bla semana\b|\beste mes\b|\bhoy\b|\bsemana\b/g },
  {
    tipo: "metrica",
    patron:
      /\bmaterial(?:es)?\b|\bmermas?\b|\bkg\b|\bkilos?\b|\btiempos?\b|\bhoras?\b|\batras\w*|\bdemor\w*|\bproductividad\b|\bdesperdici\w*|\bsobreconsum\w*|\bmargen\b|\bpresupuesto\b/g,
  },
  { tipo: "intencion", patron: /\bpor que\b|\bcuant[oa]s?\b|\bcuales?\b|\bresumen\b|\bmejor\b|\bpeor\b|\bmas\b|\bcomo va\b|\bse paso\b|\bse perdio\b/g },
];

/** Divide la pregunta en segmentos y marca los que el modelo semántico reconoce. */
export function resaltar(pregunta: string): Segmento[] {
  // Normaliza carácter por carácter para que los índices coincidan con el texto original.
  const normal = Array.from(pregunta)
    .map((c) => {
      const n = c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return n.length === 1 ? n : c.toLowerCase().charAt(0);
    })
    .join("");
  const marcas: { ini: number; fin: number; tipo: TipoToken }[] = [];
  for (const { tipo, patron } of PATRONES_RESALTADO) {
    patron.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = patron.exec(normal))) {
      const ini = m.index;
      const fin = ini + m[0].length;
      if (!marcas.some((x) => ini < x.fin && fin > x.ini)) marcas.push({ ini, fin, tipo });
    }
  }
  marcas.sort((a, b) => a.ini - b.ini);
  const original = Array.from(pregunta);
  const segmentos: Segmento[] = [];
  let cursor = 0;
  for (const mk of marcas) {
    if (mk.ini > cursor) segmentos.push({ texto: original.slice(cursor, mk.ini).join("") });
    segmentos.push({ texto: original.slice(mk.ini, mk.fin).join(""), tipo: mk.tipo });
    cursor = mk.fin;
  }
  if (cursor < original.length) segmentos.push({ texto: original.slice(cursor).join("") });
  return segmentos;
}

export const ETIQUETA_TOKEN: Record<TipoToken, string> = {
  entidad: "entidad",
  metrica: "métrica",
  intencion: "intención",
  periodo: "periodo",
};

/** Preguntas de ejemplo que se escriben solas en la portada y en el modo feria. */
export const EJEMPLOS = [
  "¿Por qué la OT-2611 se pasó en material?",
  "¿Qué órdenes se atrasaron más esta semana?",
  "¿Cuánto material se perdió en mermas?",
  "¿Qué operario tiene mejor productividad?",
  "¿Cómo va la OT-2615?",
  "Dame un resumen de la semana",
];
