"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import RobotLogo from "./RobotLogo";
import { ChipsInterpretacion, PreguntaResaltada } from "./Semantica";
import { EJEMPLOS } from "@/lib/sofia/semantico";
import { responderSimulado } from "@/lib/sofia/responder";

const MS_TECLA = 38;
const MS_BORRAR = 14;
const MS_PAUSA = 3600;

/** Pide a la demo que responda una pregunta y baja hasta ella. */
export function abrirEnDemo(pregunta: string) {
  window.dispatchEvent(new CustomEvent("sofia:preguntar", { detail: pregunta }));
  document.getElementById("interfaz")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HeroInteractivo() {
  const [texto, setTexto] = useState(EJEMPLOS[0]);
  const [auto, setAuto] = useState(true);
  const [sqlVisible, setSqlVisible] = useState(Number.MAX_SAFE_INTEGER);
  const ejemplo = useRef(0);

  const analisis = useMemo(() => (texto.trim().length > 2 ? responderSimulado(texto) : null), [texto]);
  const sql = analisis?.sql ?? "";

  // Escritura automática de ejemplos mientras nadie usa el campo.
  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelado = false;
    const esperar = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
    (async () => {
      await esperar(MS_PAUSA);
      while (!cancelado) {
        // borrar
        for (let n = EJEMPLOS[ejemplo.current].length; n >= 0 && !cancelado; n--) {
          setTexto(EJEMPLOS[ejemplo.current].slice(0, n));
          await esperar(MS_BORRAR);
        }
        ejemplo.current = (ejemplo.current + 1) % EJEMPLOS.length;
        const q = EJEMPLOS[ejemplo.current];
        for (let n = 1; n <= q.length && !cancelado; n++) {
          setTexto(q.slice(0, n));
          await esperar(MS_TECLA);
        }
        await esperar(MS_PAUSA);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [auto]);

  // La consulta SQL se "escribe" cuando cambia.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSqlVisible(Number.MAX_SAFE_INTEGER);
      return;
    }
    setSqlVisible(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 6;
      setSqlVisible(n);
      if (n >= sql.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [sql]);

  function tomarControl() {
    if (auto) {
      setAuto(false);
      setTexto("");
    }
  }

  function alEnviar(e: FormEvent) {
    e.preventDefault();
    if (texto.trim()) abrirEnDemo(texto.trim());
  }

  const entendio = analisis && analisis.interpretacion.intencion !== "desconocida";

  return (
    <header className="hero" id="inicio">
      <div className="wrap hero-top">
        <div>
          <div className="eyebrow">Modelo semántico + IA generativa para MiPymes</div>
          <h1>
            Pregúntale a tu negocio. <em>Te responde</em> con números y razones.
          </h1>
        </div>
        <div>
          <p className="lede">
            sofIA traduce una pregunta escrita como la dices a una consulta exacta sobre tus datos, calcula con reglas que
            puedes auditar y te explica el resultado en simple. Mira cómo piensa: escribe abajo.
          </p>
          <div className="cta">
            <a className="btn" href="#interfaz">
              Probar la demo
            </a>
            <a className="btn ghost" href="#como-funciona">
              Ver cómo piensa
            </a>
          </div>
        </div>
      </div>

      <div className="wrap hero-consola">
        <div className="consola">
          <div className="consola-bar">
            <span className="consola-titulo">
              <RobotLogo size={18} /> Modelo semántico de sofIA
            </span>
            <span className={`consola-estado${entendio ? " ok" : ""}`}>
              <i aria-hidden="true" /> {auto ? "demostración automática" : entendio ? "pregunta entendida" : "escuchando…"}
            </span>
          </div>

          <form className="consola-input" onSubmit={alEnviar}>
            <label htmlFor="pregunta-hero" className="sr-only">
              Escribe una pregunta para sofIA
            </label>
            <span className="consola-prompt" aria-hidden="true">
              ›
            </span>
            <input
              id="pregunta-hero"
              autoComplete="off"
              maxLength={160}
              value={texto}
              placeholder="Escribe como hablas: ¿cuánto material se perdió esta semana?"
              onFocus={tomarControl}
              onPointerDown={tomarControl}
              onChange={(e) => {
                setAuto(false);
                setTexto(e.target.value);
              }}
            />
            <button className="btn" type="submit">
              Ver respuesta
            </button>
          </form>

          <div className="consola-grid" aria-live="polite">
            <section className="consola-panel">
              <h3 className="panel-lbl">
                <span>1</span> Lo que entendió
              </h3>
              {texto.trim() ? <PreguntaResaltada pregunta={texto} /> : <p className="panel-vacio">Escribe una pregunta…</p>}
              {analisis && entendio && <ChipsInterpretacion i={analisis.interpretacion} />}
              {analisis && !entendio && (
                <p className="panel-vacio">
                  Todavía no reconoce una orden ni una métrica. Prueba con “material”, “atrasos”, “operario” o “OT-2615”.
                </p>
              )}
            </section>
            <section className="consola-panel">
              <h3 className="panel-lbl">
                <span>2</span> La consulta que generó
              </h3>
              <pre className="consola-sql">
                {sql.slice(0, sqlVisible)}
                {sqlVisible < sql.length && <span className="cursor" aria-hidden="true" />}
              </pre>
            </section>
            <section className="consola-panel">
              <h3 className="panel-lbl">
                <span>3</span> Lo que calculó el motor
              </h3>
              {analisis && entendio ? (
                <>
                  <dl className="kv">
                    {analisis.calculo.slice(0, 5).map((f) => (
                      <div key={f.etiqueta} style={{ display: "contents" }}>
                        <dt>{f.etiqueta}</dt>
                        <dd className={f.nivel}>{f.valor}</dd>
                      </div>
                    ))}
                  </dl>
                  <button type="button" className="consola-link" onClick={() => abrirEnDemo(texto.trim())}>
                    Ver la explicación completa →
                  </button>
                </>
              ) : (
                <p className="panel-vacio">Sin cálculo. sofIA no inventa números si no entendió la pregunta.</p>
              )}
            </section>
          </div>
        </div>
        <p className="tag">
          <span className="dot" />
          Caso piloto: talleres metalmecánicos de Antofagasta · datos de ejemplo
        </p>
      </div>
    </header>
  );
}
