"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Cota from "../Cota";
import RobotLogo from "../RobotLogo";
import { ORDENES, PERIODO_LARGO } from "@/lib/sofia/datos";
import { ETIQUETA_NIVEL, estadoOrden } from "@/lib/sofia/motor";
import { responderSimulado } from "@/lib/sofia/responder";
import type { Bloque, RespuestaSofia } from "@/lib/sofia/tipos";

const SUGERENCIAS = [
  "¿Por qué la OT-2611 se pasó en material?",
  "¿Qué órdenes se atrasaron más esta semana?",
  "¿Cuánto material se perdió en mermas?",
  "¿Qué operario tiene mejor productividad?",
  "Dame un resumen de la semana",
];

interface Mensaje {
  id: number;
  pregunta: string;
  respuesta?: RespuestaSofia;
}

const PAUSA_PASO_MS = 380;

/** Pide la respuesta a la API; si no hay servidor (p. ej. vista local estática), responde en el navegador. */
async function pedirRespuesta(pregunta: string): Promise<RespuestaSofia> {
  try {
    const r = await fetch("/api/preguntar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as RespuestaSofia;
  } catch {
    return responderSimulado(pregunta);
  }
}

/** Convierte **texto** en <strong>. */
function TextoRico({ texto }: { texto: string }) {
  const partes = texto.split(/\*\*(.+?)\*\*/g);
  return (
    <p>
      {partes.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}
    </p>
  );
}

function VistaBloque({ bloque }: { bloque: Bloque }) {
  if (bloque.tipo === "cotas") {
    return (
      <div style={{ display: "grid", gap: 10 }}>
        {bloque.cotas.map((c) => (
          <Cota key={c.etiqueta} {...c} />
        ))}
      </div>
    );
  }
  const derecha = new Set(bloque.alinearDerecha ?? []);
  return (
    <table className="mini">
      <thead>
        <tr>
          {bloque.columnas.map((c, i) => (
            <th key={c} className={derecha.has(i) ? "r" : undefined}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bloque.filas.map((fila, i) => (
          <tr key={i}>
            {fila.map((celda, j) => (
              <td key={j} className={[derecha.has(j) ? "r" : "", celda.nivel ?? "", celda.mono ? "mono" : ""].join(" ").trim() || undefined}>
                {celda.texto}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Inspector({ r, paso }: { r: RespuestaSofia; paso: number }) {
  const chips = Object.entries({
    intención: r.interpretacion.intencion,
    entidad: r.interpretacion.entidad,
    métrica: r.interpretacion.metrica,
    ...(r.interpretacion.periodo ? { periodo: r.interpretacion.periodo } : {}),
    ...(r.interpretacion.extra ?? {}),
  });
  const clase = (n: number) => `istep${paso < n ? " pending" : ""}`;
  return (
    <aside className="insp" aria-label="Inspector de la consulta">
      <h4 style={{ gridColumn: "1 / -1" }}>Cómo se transformó la pregunta</h4>
      <div className={clase(1)}>
        <div className="lbl">
          1 · Interpretación <span className="who sem">semántico</span>
        </div>
        {paso >= 1 && (
          <div className="chips">
            {chips.map(([k, v]) => (
              <span className="chip" key={k}>
                <b>{k}</b> {v}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={clase(2)}>
        <div className="lbl">
          2 · Consulta generada <span className="who sem">semántico</span>
        </div>
        {paso >= 2 && <pre>{r.sql}</pre>}
      </div>
      <div className={clase(3)}>
        <div className="lbl">
          3 · Cálculo <span className="who log">motor lógico</span>
        </div>
        {paso >= 3 && (
          <dl className="kv">
            {r.calculo.map((f) => (
              <div key={f.etiqueta} style={{ display: "contents" }}>
                <dt>{f.etiqueta}</dt>
                <dd className={f.nivel}>{f.valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <div className={clase(4)}>
        <div className="lbl">
          4 · Redacción <span className="who ia">IA generativa</span>
        </div>
        {paso >= 4 && <p style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.notaRedaccion}</p>}
      </div>
    </aside>
  );
}

export default function DemoApp() {
  const [mensajes, setMensajes] = useState<Mensaje[]>(() => [
    { id: 0, pregunta: SUGERENCIAS[0], respuesta: responderSimulado(SUGERENCIAS[0]) },
  ]);
  const [inspeccion, setInspeccion] = useState<RespuestaSofia>(() => responderSimulado(SUGERENCIAS[0]));
  const [paso, setPaso] = useState(4);
  const [ocupado, setOcupado] = useState(false);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");
  const hilo = useRef<HTMLDivElement>(null);
  const siguienteId = useRef(1);

  useEffect(() => {
    const el = hilo.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensajes]);

  async function preguntar(pregunta: string) {
    if (ocupado) return;
    const q = pregunta.trim();
    if (!q) {
      setError("Escribe una pregunta primero.");
      return;
    }
    setError("");
    setOcupado(true);
    const id = siguienteId.current++;
    setMensajes((m) => [...m, { id, pregunta: q }]);
    setPaso(0);

    const respuesta = await pedirRespuesta(q);
    setInspeccion(respuesta);

    const sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let n = 1; n <= 4; n++) {
      if (!sinAnimacion) await new Promise((ok) => setTimeout(ok, PAUSA_PASO_MS));
      setPaso(n);
    }
    setMensajes((m) => m.map((x) => (x.id === id ? { ...x, respuesta } : x)));
    setOcupado(false);
  }

  function alEnviar(e: FormEvent) {
    e.preventDefault();
    const q = texto;
    setTexto("");
    void preguntar(q);
  }

  return (
    <div className="app">
      <div className="app-bar">
        <div className="lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span className="t">sofIA · Maestranza Norte (caso metalmecánica)</span>
        <span style={{ color: "var(--muted)" }}>{PERIODO_LARGO}</span>
        <span className="ex">DATOS DE EJEMPLO</span>
      </div>
      <div className="app-grid">
        <aside className="side" aria-label="Órdenes de trabajo">
          <h4>Órdenes de trabajo</h4>
          {ORDENES.map((o) => {
            const e = estadoOrden(o);
            return (
              <button
                key={o.id}
                type="button"
                className={`ot${inspeccion.otSeleccionada === o.id ? " sel" : ""}`}
                onClick={() => void preguntar(`¿Cómo va la ${o.id}?`)}
              >
                <span className="id">{o.id}</span>
                <span className={`pill ${e}`}>{ETIQUETA_NIVEL[e]}</span>
                <span className="pz">{o.pieza}</span>
              </button>
            );
          })}
        </aside>

        <div className="chat">
          <div className="thread" ref={hilo} aria-live="polite">
            {mensajes.map((m) => (
              <div key={m.id} style={{ display: "contents" }}>
                <div className="msg-u fade">{m.pregunta}</div>
                <div className={`msg-a${m.respuesta ? " fade" : ""}`}>
                  <span className="who" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <RobotLogo size={16} />
                    sofIA
                  </span>
                  <div className="bubble">
                    {m.respuesta ? (
                      <>
                        <TextoRico texto={m.respuesta.texto} />
                        {m.respuesta.bloques.length > 0 && (
                          <div style={{ display: "grid", gap: 10 }}>
                            {m.respuesta.bloques.map((b, i) => (
                              <VistaBloque key={i} bloque={b} />
                            ))}
                          </div>
                        )}
                        <p className="note">Cifras del motor lógico · causas sugeridas por IA, a validar por el supervisor.</p>
                      </>
                    ) : (
                      <span className="typing" aria-label="sofIA está pensando">
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="composer">
            <div className="sugg">
              {SUGERENCIAS.map((s) => (
                <button key={s} type="button" onClick={() => void preguntar(s)}>
                  {s}
                </button>
              ))}
            </div>
            <form className="inrow" onSubmit={alEnviar}>
              <label htmlFor="pregunta" className="sr-only">
                Pregunta para sofIA
              </label>
              <input
                id="pregunta"
                autoComplete="off"
                maxLength={300}
                placeholder="Pregúntale a sofIA… ej. ¿cómo va la OT-2615?"
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  if (error) setError("");
                }}
              />
              <button className="btn" type="submit" disabled={ocupado}>
                Preguntar
              </button>
            </form>
            {error && <p className="error-msg">{error}</p>}
          </div>
        </div>

        <Inspector r={inspeccion} paso={paso} />
      </div>
    </div>
  );
}
