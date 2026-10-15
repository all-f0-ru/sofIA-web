import type { Nivel, OrdenTrabajo } from "./tipos";

/**
 * Motor lógico: cálculos deterministas y auditables.
 * La IA nunca calcula; solo redacta a partir de lo que devuelven estas funciones.
 */

/** Umbrales de desviación (en %). Configurables por empresa. */
export const UMBRALES = { atencion: 5, critico: 15 };

export const ETIQUETA_NIVEL: Record<Nivel, string> = {
  ok: "En rango",
  warn: "Atención",
  crit: "Crítico",
};

/** (real − estimado) / estimado × 100 */
export function desviacion(estimado: number, real: number): number {
  if (estimado === 0) return 0;
  return ((real - estimado) / estimado) * 100;
}

export function nivel(valor: number): Nivel {
  const v = Math.abs(valor);
  if (v > UMBRALES.critico) return "crit";
  if (v > UMBRALES.atencion) return "warn";
  return "ok";
}

export function desvMaterial(o: OrdenTrabajo): number {
  return desviacion(o.matEst, o.matReal);
}

export function desvTiempo(o: OrdenTrabajo): number {
  return desviacion(o.tEst, o.tReal);
}

/** Estado de la OT según la mayor de sus desviaciones. */
export function estadoOrden(o: OrdenTrabajo): Nivel {
  return nivel(Math.max(Math.abs(desvMaterial(o)), Math.abs(desvTiempo(o))));
}

/** 100 − promedio(|desv material|, |desv tiempo|) */
export function eficienciaOrden(o: OrdenTrabajo): number {
  return 100 - (Math.abs(desvMaterial(o)) + Math.abs(desvTiempo(o))) / 2;
}

export function rankingTiempo(ordenes: OrdenTrabajo[], top = 3): OrdenTrabajo[] {
  return [...ordenes].sort((a, b) => desvTiempo(b) - desvTiempo(a)).slice(0, top);
}

export function horasNoPlanificadas(ordenes: OrdenTrabajo[]): number {
  return ordenes.reduce((s, o) => s + Math.max(0, o.tReal - o.tEst), 0);
}

export interface Sobreconsumo {
  orden: OrdenTrabajo;
  kg: number;
}

export function sobreconsumo(ordenes: OrdenTrabajo[]): { detalle: Sobreconsumo[]; total: number; planificado: number } {
  const detalle = ordenes
    .map((orden) => ({ orden, kg: Math.max(0, orden.matReal - orden.matEst) }))
    .filter((x) => x.kg > 0)
    .sort((a, b) => b.kg - a.kg);
  const total = detalle.reduce((s, x) => s + x.kg, 0);
  const planificado = ordenes.reduce((s, o) => s + o.matEst, 0);
  return { detalle, total, planificado };
}

export interface Productividad {
  operario: string;
  ordenes: number;
  /** Σ h est / Σ h real × 100 */
  porcentaje: number;
}

export function productividadPorOperario(ordenes: OrdenTrabajo[]): Productividad[] {
  const grupos = new Map<string, { est: number; real: number; n: number }>();
  for (const o of ordenes) {
    const g = grupos.get(o.operario) ?? { est: 0, real: 0, n: 0 };
    g.est += o.tEst;
    g.real += o.tReal;
    g.n += 1;
    grupos.set(o.operario, g);
  }
  return [...grupos.entries()]
    .map(([operario, g]) => ({ operario, ordenes: g.n, porcentaje: (g.est / g.real) * 100 }))
    .sort((a, b) => b.porcentaje - a.porcentaje);
}

export function resumenSemana(ordenes: OrdenTrabajo[]) {
  const conteo: Record<Nivel, number> = { ok: 0, warn: 0, crit: 0 };
  ordenes.forEach((o) => conteo[estadoOrden(o)]++);
  const conReproceso = ordenes.filter((o) => o.reprocesos > 0).length;
  const eficiencia = ordenes.reduce((s, o) => s + eficienciaOrden(o), 0) / ordenes.length;
  return {
    total: ordenes.length,
    conteo,
    tasaReprocesos: (conReproceso / ordenes.length) * 100,
    eficiencia,
  };
}

/* Formato chileno: coma decimal y espacio antes del %. */
export function num(n: number, decimales = 1): string {
  return n.toLocaleString("es-CL", { maximumFractionDigits: decimales, minimumFractionDigits: 0 });
}

export function pct(n: number): string {
  const signo = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${signo}${num(Math.abs(n))} %`;
}
