import { CAUSAS_POR_PROCESO, ORDENES } from "./datos";
import {
  ETIQUETA_NIVEL,
  desvMaterial,
  desvTiempo,
  estadoOrden,
  horasNoPlanificadas,
  nivel,
  num,
  pct,
  productividadPorOperario,
  rankingTiempo,
  resumenSemana,
  sobreconsumo,
} from "./motor";
import { describir, generarSQL, interpretar, type Consulta } from "./semantico";
import type { Bloque, FilaCalculo, OrdenTrabajo, RespuestaSofia } from "./tipos";

/**
 * Orquesta los 4 pasos con el redactor simulado:
 * 1. modelo semántico → 2. consulta → 3. motor lógico → 4. redacción.
 * El redactor simulado usa plantillas; el real usará un modelo de lenguaje
 * que recibe SOLO las cifras del paso 3.
 */
export function responderSimulado(pregunta: string): RespuestaSofia {
  const consulta = interpretar(pregunta);
  const base = {
    pregunta,
    interpretacion: describir(consulta),
    sql: generarSQL(consulta),
    modo: "simulado" as const,
  };
  return { ...base, ...redactar(consulta) };
}

type Redaccion = Pick<RespuestaSofia, "calculo" | "texto" | "notaRedaccion" | "bloques" | "otSeleccionada">;

function redactar(c: Consulta): Redaccion {
  switch (c.tipo) {
    case "orden":
      return porOrden(c.orden);
    case "ranking_tiempo":
      return ranking();
    case "sobreconsumo":
      return mermas();
    case "productividad":
      return operarios();
    case "resumen":
      return resumen();
    default:
      return {
        calculo: [{ etiqueta: "Resultado", valor: "sin cálculo" }],
        texto:
          "No reconocí una orden ni una métrica en tu pregunta. Puedo responder sobre una OT específica (por ejemplo **OT-2615**), desviaciones de tiempo, consumo de material, productividad por operario o un resumen de la semana.",
        notaRedaccion: "Responde sin inventar datos cuando no hay cálculo.",
        bloques: [],
      };
  }
}

function porOrden(o: OrdenTrabajo): Redaccion {
  const dm = desvMaterial(o);
  const dt = desvTiempo(o);
  const estado = estadoOrden(o);
  let texto: string;
  if (estado === "ok") {
    texto = `La **${o.id}** (${o.pieza}) está en rango: material ${pct(dm)} y tiempo ${pct(dt)}. No hay nada que revisar por ahora.`;
  } else {
    const partes: string[] = [];
    if (nivel(dm) !== "ok")
      partes.push(`se usaron **${num(Math.abs(o.matReal - o.matEst))} kg ${o.matReal > o.matEst ? "más" : "menos"}** de lo planificado (${pct(dm)})`);
    if (nivel(dt) !== "ok")
      partes.push(`la orden ${o.tReal > o.tEst ? "tardó" : "terminó"} **${num(Math.abs(o.tReal - o.tEst))} h ${o.tReal > o.tEst ? "más" : "antes"}** (${pct(dt)})`);
    texto = `En la **${o.id}** ${partes.join(" y ")}.`;
    const causa = CAUSAS_POR_PROCESO[o.proceso] ?? "una diferencia entre lo planificado y la ejecución";
    texto +=
      o.reprocesos > 0
        ? ` Hubo ${o.reprocesos} ${o.reprocesos === 1 ? "reproceso" : "reprocesos"} en ${o.proceso.charAt(0).toLowerCase()}${o.proceso.slice(1)}, así que lo más probable es ${causa}. Recomiendo revisar esa etapa con ${o.operario} antes de la próxima orden similar.`
        : ` No hubo reprocesos registrados; la causa más probable es ${causa}.`;
  }
  return {
    calculo: [
      { etiqueta: "Material est.", valor: `${num(o.matEst)} kg` },
      { etiqueta: "Material real", valor: `${num(o.matReal)} kg` },
      { etiqueta: "Desv. material", valor: pct(dm), nivel: nivel(dm) },
      { etiqueta: "Tiempo est.", valor: `${num(o.tEst)} h` },
      { etiqueta: "Tiempo real", valor: `${num(o.tReal)} h` },
      { etiqueta: "Desv. tiempo", valor: pct(dt), nivel: nivel(dt) },
      { etiqueta: "Reprocesos", valor: String(o.reprocesos) },
      { etiqueta: "Estado", valor: ETIQUETA_NIVEL[estado], nivel: estado },
    ],
    texto,
    notaRedaccion: "Usa solo las cifras del paso 3. La causa es una hipótesis basada en el proceso y los reprocesos registrados.",
    bloques: [
      {
        tipo: "cotas",
        cotas: [
          { etiqueta: "Material", estimado: o.matEst, real: o.matReal, unidad: "kg" },
          { etiqueta: "Tiempo", estimado: o.tEst, real: o.tReal, unidad: "h" },
        ],
      },
    ],
    otSeleccionada: o.id,
  };
}

function ranking(): Redaccion {
  const top = rankingTiempo(ORDENES);
  const horas = horasNoPlanificadas(ORDENES);
  const tabla: Bloque = {
    tipo: "tabla",
    columnas: ["OT", "Proceso", "Desv. tiempo"],
    alinearDerecha: [2],
    filas: top.map((o) => [
      { texto: o.id, mono: true },
      { texto: o.proceso },
      { texto: pct(desvTiempo(o)), nivel: nivel(desvTiempo(o)) },
    ]),
  };
  const conReproceso = top.slice(0, 2).every((o) => o.reprocesos > 0);
  return {
    calculo: [
      ...top.map<FilaCalculo>((o) => ({ etiqueta: o.id, valor: pct(desvTiempo(o)), nivel: nivel(desvTiempo(o)) })),
      { etiqueta: "Horas no planificadas", valor: `${num(horas)} h` },
    ],
    texto: `Las órdenes que más se alargaron fueron **${top[0].id}** (${pct(desvTiempo(top[0]))}), **${top[1].id}** (${pct(desvTiempo(top[1]))}) y **${top[2].id}** (${pct(desvTiempo(top[2]))}). En total la semana sumó **${num(horas)} horas no planificadas**.${conReproceso ? " Las dos primeras tuvieron reprocesos, así que ahí está la mayor oportunidad de mejora." : ""}`,
    notaRedaccion: "Ordena y resume el resultado del ranking. No recalcula.",
    bloques: [tabla],
  };
}

function mermas(): Redaccion {
  const { detalle, total, planificado } = sobreconsumo(ORDENES);
  const porcentaje = (total / planificado) * 100;
  return {
    calculo: [
      { etiqueta: "Material planificado", valor: `${num(planificado)} kg` },
      { etiqueta: "Sobreconsumo total", valor: `${num(total)} kg` },
      { etiqueta: "% sobre lo planificado", valor: pct(porcentaje), nivel: nivel(porcentaje) },
      { etiqueta: "Mayor aporte", valor: detalle[0]?.orden.id ?? "—" },
    ],
    texto: `Esta semana se consumieron **${num(total)} kg sobre lo planificado** (${pct(porcentaje)} del total). Casi todo viene de dos órdenes: **${detalle[0].orden.id}** con ${num(detalle[0].kg)} kg y **${detalle[1].orden.id}** con ${num(detalle[1].kg)} kg. Revisar el corte en esos dos procesos tendría el mayor impacto.`,
    notaRedaccion: "Resume el agregado y destaca dónde se concentra.",
    bloques: [
      {
        tipo: "tabla",
        columnas: ["OT", "Proceso", "kg sobre plan"],
        alinearDerecha: [2],
        filas: detalle.map((x) => [{ texto: x.orden.id, mono: true }, { texto: x.orden.proceso }, { texto: num(x.kg) }]),
      },
    ],
  };
}

function operarios(): Redaccion {
  const lista = productividadPorOperario(ORDENES);
  const mejor = lista[0];
  const peor = lista[lista.length - 1];
  return {
    calculo: lista.map((p) => ({ etiqueta: p.operario, valor: `${num(p.porcentaje)} %`, nivel: nivel(100 - p.porcentaje) })),
    texto: `**${mejor.operario}** tiene la mejor productividad (${num(mejor.porcentaje)} %: terminó prácticamente en las horas estimadas). **${peor.operario}** queda en ${num(peor.porcentaje)} %, pero su resultado está muy influido por la OT-2611, que tuvo un reproceso. Antes de sacar conclusiones sobre la persona, conviene revisar esa orden.`,
    notaRedaccion: "Compara y advierte cuando una sola OT explica el resultado. No evalúa personas.",
    bloques: [
      {
        tipo: "tabla",
        columnas: ["Operario", "OT", "Productividad"],
        alinearDerecha: [1, 2],
        filas: lista.map((p) => [{ texto: p.operario }, { texto: String(p.ordenes) }, { texto: `${num(p.porcentaje)} %` }]),
      },
    ],
  };
}

function resumen(): Redaccion {
  const r = resumenSemana(ORDENES);
  return {
    calculo: [
      { etiqueta: "OT totales", valor: String(r.total) },
      { etiqueta: "Críticas", valor: String(r.conteo.crit), nivel: "crit" },
      { etiqueta: "Atención", valor: String(r.conteo.warn), nivel: "warn" },
      { etiqueta: "En rango", valor: String(r.conteo.ok), nivel: "ok" },
      { etiqueta: "Tasa de reprocesos", valor: `${num(r.tasaReprocesos)} %` },
      { etiqueta: "Eficiencia promedio", valor: `${num(r.eficiencia)} %` },
    ],
    texto: `Esta semana hay **${r.total} órdenes**: ${r.conteo.crit} críticas, ${r.conteo.warn} en atención y ${r.conteo.ok} en rango. La tasa de reprocesos es ${num(r.tasaReprocesos)} % y la eficiencia promedio ${num(r.eficiencia)} %. Lo urgente es la OT-2611; el resto se puede ajustar en la planificación de la próxima semana.`,
    notaRedaccion: "Resume el estado general en tres frases.",
    bloques: [],
  };
}
