// Tipos compartidos por el modelo semántico, el motor lógico y el redactor.

/** Nivel de una desviación según los umbrales configurados. */
export type Nivel = "ok" | "warn" | "crit";

/** Orden de trabajo con sus valores planificados y reales. */
export interface OrdenTrabajo {
  id: string;
  pieza: string;
  proceso: string;
  operario: string;
  /** Material estimado (kg) */
  matEst: number;
  /** Material real (kg) */
  matReal: number;
  /** Tiempo estimado (h) */
  tEst: number;
  /** Tiempo real (h) */
  tReal: number;
  reprocesos: number;
}

/** Lo que el modelo semántico entendió de la pregunta. */
export interface Interpretacion {
  intencion:
    | "explicar_desviacion"
    | "ranking"
    | "agregar"
    | "comparar"
    | "resumen"
    | "desconocida";
  entidad: string;
  metrica: string;
  periodo?: string;
  extra?: Record<string, string>;
}

/** Una fila del paso "Cálculo" del inspector. */
export interface FilaCalculo {
  etiqueta: string;
  valor: string;
  nivel?: Nivel;
}

export interface CotaDato {
  etiqueta: string;
  estimado: number;
  real: number;
  unidad: string;
}

export interface CeldaTabla {
  texto: string;
  nivel?: Nivel;
  mono?: boolean;
}

/** Bloques visuales que acompañan la respuesta. */
export type Bloque =
  | { tipo: "cotas"; cotas: CotaDato[] }
  | { tipo: "tabla"; columnas: string[]; alinearDerecha?: number[]; filas: CeldaTabla[][] };

/** Respuesta completa: los 4 pasos que muestra el inspector. */
export interface RespuestaSofia {
  pregunta: string;
  /** Paso 1: modelo semántico */
  interpretacion: Interpretacion;
  /** Paso 2: consulta generada */
  sql: string;
  /** Paso 3: motor lógico */
  calculo: FilaCalculo[];
  /** Paso 4: redacción. Usa **negrita** para destacar cifras. */
  texto: string;
  notaRedaccion: string;
  bloques: Bloque[];
  /** OT seleccionada en la lista, si la pregunta trata de una sola orden. */
  otSeleccionada?: string;
  modo: "simulado" | "ia";
}
