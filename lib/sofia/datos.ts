import type { OrdenTrabajo } from "./tipos";

/**
 * Datos de ejemplo del caso metalmecánico (semana 42).
 * Cuando la demo se conecte a la base de datos real, este archivo se reemplaza
 * por una consulta a `ordenes_trabajo`.
 */
export const ORDENES: OrdenTrabajo[] = [
  { id: "OT-2604", pieza: "Eje de transmisión SAE 1045", proceso: "Mecanizado CNC", operario: "M. Castillo", matEst: 42, matReal: 43.1, tEst: 6, tReal: 5.5, reprocesos: 0 },
  { id: "OT-2607", pieza: 'Brida ANSI 6" clase 150', proceso: "Mecanizado CNC", operario: "P. Araya", matEst: 18, matReal: 18.4, tEst: 3, tReal: 3.4, reprocesos: 0 },
  { id: "OT-2611", pieza: "Bastidor soldado", proceso: "Soldadura MIG", operario: "J. Rojas", matEst: 100, matReal: 120, tEst: 5, tReal: 7, reprocesos: 1 },
  { id: "OT-2615", pieza: "Planchas A36 e=10 mm", proceso: "Corte plasma", operario: "P. Araya", matEst: 380, matReal: 402, tEst: 3, tReal: 3.8, reprocesos: 1 },
  { id: "OT-2618", pieza: "Soporte de bomba", proceso: "Soldadura MIG", operario: "M. Castillo", matEst: 64, matReal: 63, tEst: 8, tReal: 8.6, reprocesos: 0 },
  { id: "OT-2620", pieza: "Pasador templado Ø25", proceso: "Torneado", operario: "J. Rojas", matEst: 12, matReal: 12.2, tEst: 4, tReal: 4.1, reprocesos: 0 },
];

export const PERIODO = "semana 42";
export const PERIODO_LARGO = "Semana 42 · 12–16 oct 2026";

/** Causas típicas por proceso, usadas por el redactor simulado. */
export const CAUSAS_POR_PROCESO: Record<string, string> = {
  "Soldadura MIG": "un error en el corte inicial o en la preparación de biseles, que obligó a rehacer cordones",
  "Corte plasma": "un nesting poco eficiente o parámetros de corte (amperaje, velocidad) que generaron rebaba y piezas fuera de cota",
  "Mecanizado CNC": "sobremedida del material en bruto o un cambio de herramienta no previsto",
  Torneado: "ajuste de herramienta o sobremedida del material en bruto",
};
